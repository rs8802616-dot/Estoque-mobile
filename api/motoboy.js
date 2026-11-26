// Vercel Serverless Function / Express Handler: /api/motoboy
// - Entrega dados do pedido ao link exclusivo do motoboy sem expor o PIN de confirmação
// - Valida o PIN de entrega no servidor com comparação em tempo constante e bloqueio após 5 erros

import crypto from 'node:crypto';

const RATE_JANELA_MS = 60 * 1000;
const RATE_MAX = 30;
const MAX_TENTATIVAS_PIN = 5;
const LGPD_EXPIRACAO_MS = 5 * 60 * 1000;
const tentativasIp = new Map();

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local')
    .split(',')[0]
    .trim();
}

function checarRateLimit(req) {
  const ip = getClientIp(req);
  const agora = Date.now();
  const reg = tentativasIp.get(ip) || { count: 0, resetEm: agora + RATE_JANELA_MS };
  if (agora > reg.resetEm) {
    reg.count = 0;
    reg.resetEm = agora + RATE_JANELA_MS;
  }
  reg.count += 1;
  tentativasIp.set(ip, reg);
  if (tentativasIp.size > 500) {
    for (const [k, v] of tentativasIp.entries()) {
      if (agora > v.resetEm) tentativasIp.delete(k);
    }
  }
  return reg.count <= RATE_MAX;
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function compararTempoConstante(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function formatarDataHoraBrasil(ts = Date.now()) {
  const utcMinus3 = new Date(ts - 3 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    dataFinalizacao: `${utcMinus3.getUTCFullYear()}-${pad(utcMinus3.getUTCMonth() + 1)}-${pad(utcMinus3.getUTCDate())}`,
    horaFinalizacao: `${pad(utcMinus3.getUTCHours())}:${pad(utcMinus3.getUTCMinutes())}`,
  };
}

async function obterAccessTokenAdmin(serviceAccount) {
  const agora = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: agora,
      exp: agora + 3600,
    })
  );
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  signer.end();
  const sig = signer
    .sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claim}.${sig}`,
  });
  const json = await resp.json();
  if (!resp.ok || !json?.access_token) {
    throw new Error('Falha ao obter access_token OAuth2');
  }
  return json.access_token;
}

function extrairValorFirestore(v) {
  if (!v || typeof v !== 'object') return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return Boolean(v.booleanValue);
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) {
    const out = {};
    for (const [mk, mv] of Object.entries(v.mapValue?.fields || {})) {
      const val = extrairValorFirestore(mv);
      if (val !== undefined) out[mk] = val;
    }
    return out;
  }
  if ('arrayValue' in v) {
    const vals = Array.isArray(v.arrayValue?.values) ? v.arrayValue.values : [];
    return vals.map((item) => extrairValorFirestore(item)).filter((item) => item !== undefined);
  }
  return undefined;
}

function extrairDocFirestore(docObj) {
  if (!docObj || typeof docObj !== 'object') return null;
  const docId = docObj.name ? decodeURIComponent(String(docObj.name).split('/').pop() || '') : '';
  const out = {};
  if (docId) {
    out.id = docId;
    out._docId = docId;
  }
  for (const [k, v] of Object.entries(docObj.fields || {})) {
    const val = extrairValorFirestore(v);
    if (val !== undefined) out[k] = val;
  }
  if (!out.id && docId) out.id = docId;
  return out;
}

function converterValorParaFirestore(v) {
  if (v === undefined) return undefined;
  if (v === null) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (Array.isArray(v)) {
    return {
      arrayValue: {
        values: v.map((item) => converterValorParaFirestore(item)).filter((x) => x !== undefined),
      },
    };
  }
  if (typeof v === 'object') {
    const fields = {};
    for (const [k, val] of Object.entries(v)) {
      const conv = converterValorParaFirestore(val);
      if (conv !== undefined) fields[k] = conv;
    }
    return { mapValue: { fields } };
  }
  return undefined;
}

function converterParaFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const converted = converterValorParaFirestore(v);
    if (converted !== undefined) fields[k] = converted;
  }
  return fields;
}

async function lerDocFirestoreAdmin(projectId, accessToken, caminho) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${caminho}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`Firestore GET ${resp.status}`);
  const data = await resp.json();
  return extrairDocFirestore(data);
}

async function gravarDocFirestoreAdmin(projectId, accessToken, caminho, payloadObj) {
  const keys = Object.keys(payloadObj).filter((k) => payloadObj[k] !== undefined);
  const masks = keys.map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${caminho}?${masks}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: converterParaFirestoreFields(payloadObj) }),
  });
  if (!resp.ok) throw new Error(`Firestore PATCH ${resp.status}`);
}

async function consultarColecaoPorCampoAdmin(projectId, accessToken, colecao, campo, valor) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: colecao }],
        where: {
          fieldFilter: {
            field: { fieldPath: campo },
            op: 'EQUAL',
            value: { stringValue: String(valor) },
          },
        },
        limit: 1,
      },
    }),
  });
  if (!resp.ok) throw new Error(`Firestore runQuery ${resp.status}`);
  const rows = await resp.json();
  if (!Array.isArray(rows)) return [];
  const docs = [];
  for (const row of rows) {
    if (row?.document) {
      const parsed = extrairDocFirestore(row.document);
      if (parsed) docs.push(parsed);
    }
  }
  return docs;
}

function sanitizarPedidoParaMotoboy(pedidoDoc) {
  if (!pedidoDoc) return null;
  const clone = { ...pedidoDoc };
  delete clone._docId;
  const pinLen = String(pedidoDoc.codigoEntregaPin || '').trim().length || 6;
  return {
    ...clone,
    codigoEntregaPin: '',
    pinTamanho: pinLen,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ configurado: false, sucesso: false, erro: 'Método não permitido. Use POST.' });
  }
  if (!checarRateLimit(req)) {
    return res.status(429).json({
      configurado: true,
      sucesso: false,
      erro: 'Muitas tentativas em sequência. Aguarde 1 minuto.',
    });
  }

  const rawSa = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawSa) {
    return res.status(503).json({
      configurado: false,
      sucesso: false,
      erro: 'FIREBASE_SERVICE_ACCOUNT_JSON não configurado no servidor.',
    });
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(rawSa);
    if (!serviceAccount?.client_email || !serviceAccount?.private_key || !serviceAccount?.project_id) {
      throw new Error('Service account incompleto');
    }
    serviceAccount.private_key = String(serviceAccount.private_key).replace(/\\n/g, '\n');
  } catch {
    return res.status(500).json({
      configurado: false,
      sucesso: false,
      erro: 'FIREBASE_SERVICE_ACCOUNT_JSON inválido.',
    });
  }

  const body = req.body || {};
  const acao = String(body.acao || '').trim();
  const projectId = serviceAccount.project_id;

  try {
    const accessToken = await obterAccessTokenAdmin(serviceAccount);

    if (acao === 'buscar_pedido') {
      const numeroPedido = String(body.numeroPedido || '').trim();
      const motoboyToken = String(body.motoboyToken || '').trim();
      if (!numeroPedido || !motoboyToken) {
        return res.status(400).json({
          configurado: true,
          sucesso: false,
          erro: 'Informe numeroPedido e motoboyToken.',
        });
      }

      const encontrados = await consultarColecaoPorCampoAdmin(
        projectId,
        accessToken,
        'pedidos_delivery',
        'motoboyToken',
        motoboyToken
      );
      const pedido = encontrados[0] || null;
      if (
        !pedido ||
        String(pedido.numeroPedido) !== numeroPedido ||
        !compararTempoConstante(motoboyToken, String(pedido.motoboyToken || ''))
      ) {
        return res.status(404).json({
          configurado: true,
          sucesso: false,
          erro: 'Link de entrega não encontrado.',
        });
      }

      if (pedido.motoboyTokenExpiraEm && Date.now() > Number(pedido.motoboyTokenExpiraEm)) {
        return res.status(403).json({
          configurado: true,
          sucesso: false,
          expirado: true,
          erro: 'Este link de entrega expirou.',
        });
      }

      if (
        pedido.status === 'entregue' &&
        pedido.entregueEmTimestamp &&
        Date.now() - Number(pedido.entregueEmTimestamp) > LGPD_EXPIRACAO_MS
      ) {
        return res.status(403).json({
          configurado: true,
          sucesso: false,
          expirado: true,
          erro: 'Link desativado por privacidade após a entrega.',
        });
      }

      let loja = null;
      if (pedido.lojaId) {
        try {
          const lojaDoc = await lerDocFirestoreAdmin(
            projectId,
            accessToken,
            `supermercados/${encodeURIComponent(String(pedido.lojaId))}`
          );
          if (lojaDoc) {
            loja = {
              id: String(lojaDoc.id || pedido.lojaId),
              nome: String(lojaDoc.nome || 'Supermercado'),
              telefone: lojaDoc.telefone || '',
            };
          }
        } catch {}
      }

      return res.status(200).json({
        configurado: true,
        sucesso: true,
        pedido: sanitizarPedidoParaMotoboy(pedido),
        loja,
      });
    }

    if (acao === 'confirmar_pin') {
      const pedidoId = String(body.pedidoId || '').trim();
      const numeroPedido = String(body.numeroPedido || '').trim();
      const motoboyToken = String(body.motoboyToken || '').trim();
      const pinDigitado = String(body.pin || '').trim();

      if ((!pedidoId && !numeroPedido) || !motoboyToken || !pinDigitado) {
        return res.status(400).json({
          configurado: true,
          sucesso: false,
          erro: 'Informe os dados da entrega e o PIN.',
        });
      }

      let pedido = null;
      if (pedidoId) {
        pedido = await lerDocFirestoreAdmin(
          projectId,
          accessToken,
          `pedidos_delivery/${encodeURIComponent(pedidoId)}`
        );
      }
      if (!pedido) {
        const lista = await consultarColecaoPorCampoAdmin(
          projectId,
          accessToken,
          'pedidos_delivery',
          'motoboyToken',
          motoboyToken
        );
        pedido = lista[0] || null;
      }

      if (
        !pedido ||
        !pedido.motoboyToken ||
        !compararTempoConstante(motoboyToken, String(pedido.motoboyToken)) ||
        (numeroPedido && String(pedido.numeroPedido) !== numeroPedido)
      ) {
        return res.status(403).json({
          configurado: true,
          sucesso: false,
          erro: 'Token de entrega inválido.',
        });
      }

      if (pedido.motoboyTokenExpiraEm && Date.now() > Number(pedido.motoboyTokenExpiraEm)) {
        return res.status(403).json({
          configurado: true,
          sucesso: false,
          erro: 'Link de entrega expirado.',
        });
      }

      if (pedido.status === 'entregue') {
        return res.status(200).json({
          configurado: true,
          sucesso: true,
          pedido: sanitizarPedidoParaMotoboy(pedido),
        });
      }

      const tentativasAtuais = Number(pedido.tentativasPinEntrega || 0);
      if (pedido.pinBloqueado || tentativasAtuais >= MAX_TENTATIVAS_PIN) {
        return res.status(429).json({
          configurado: true,
          sucesso: false,
          bloqueado: true,
          erro: 'PIN bloqueado após 5 tentativas incorretas. Solicite confirmação à loja.',
        });
      }

      const pedidoDocId = String(pedido._docId || pedido.id || pedidoId);
      const pinCorreto = String(pedido.codigoEntregaPin || '').trim();
      if (!pinCorreto || !compararTempoConstante(pinDigitado, pinCorreto)) {
        const novasTentativas = tentativasAtuais + 1;
        const pinBloqueado = novasTentativas >= MAX_TENTATIVAS_PIN;
        await gravarDocFirestoreAdmin(
          projectId,
          accessToken,
          `pedidos_delivery/${encodeURIComponent(pedidoDocId)}`,
          {
            tentativasPinEntrega: novasTentativas,
            pinBloqueado,
          }
        );

        return res.status(pinBloqueado ? 429 : 401).json({
          configurado: true,
          sucesso: false,
          bloqueado: pinBloqueado,
          tentativasPinEntrega: novasTentativas,
          erro: pinBloqueado
            ? 'Limite de 5 tentativas excedido. PIN bloqueado — entre em contato com a loja.'
            : `PIN incorreto (${novasTentativas}/${MAX_TENTATIVAS_PIN}). Peça o código correto ao cliente.`,
        });
      }

      const agoraTs = Date.now();
      const { dataFinalizacao, horaFinalizacao } = formatarDataHoraBrasil(agoraTs);
      await gravarDocFirestoreAdmin(
        projectId,
        accessToken,
        `pedidos_delivery/${encodeURIComponent(pedidoDocId)}`,
        {
          status: 'entregue',
          dataFinalizacao,
          horaFinalizacao,
          entregueEmTimestamp: agoraTs,
        }
      );

      const pedidoAtualizado = {
        ...pedido,
        status: 'entregue',
        dataFinalizacao,
        horaFinalizacao,
        entregueEmTimestamp: agoraTs,
      };

      return res.status(200).json({
        configurado: true,
        sucesso: true,
        pedido: sanitizarPedidoParaMotoboy(pedidoAtualizado),
      });
    }

    return res.status(400).json({
      configurado: true,
      sucesso: false,
      erro: 'Ação não reconhecida.',
    });
  } catch (err) {
    return res.status(500).json({
      configurado: true,
      sucesso: false,
      erro: err?.message || 'Erro interno no serviço de entrega.',
    });
  }
}
