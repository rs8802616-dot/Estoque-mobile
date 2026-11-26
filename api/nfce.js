// Vercel Serverless Function: /api/nfce
// Proxy seguro para emissão, consulta, cancelamento e teste de conexão de NFC-e (Modelo 65) via Focus NFe API v2

import crypto from 'node:crypto';
import { parseServiceAccountEnv } from './_serviceAccount.js';

function limparDigitos(val) {
  return String(val || '').replace(/\D/g, '');
}

function compararTempoConstante(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Cache dos certificados públicos do Firebase Auth (securetoken)
let certsCache = null;
let certsCacheExpMs = 0;

async function obterCertificadosFirebase(forcarAtualizacao = false) {
  const agora = Date.now();
  if (!forcarAtualizacao && certsCache && agora < certsCacheExpMs) {
    return certsCache;
  }
  const resp = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!resp.ok) {
    throw new Error('Falha ao obter certificados públicos do Firebase Auth.');
  }
  const cc = String(resp.headers.get('cache-control') || '');
  const matchMaxAge = cc.match(/max-age=(\d+)/i);
  const maxAgeSeg = matchMaxAge ? Number(matchMaxAge[1]) : 3600;
  const json = await resp.json();
  certsCache = json || {};
  certsCacheExpMs = agora + Math.max(60, maxAgeSeg) * 1000;
  return certsCache;
}

async function verificarFirebaseIdToken(idToken, projectId) {
  if (!idToken || typeof idToken !== 'string') return null;
  const partes = idToken.split('.');
  if (partes.length !== 3) return null;
  const [hB64, pB64, sB64] = partes;
  if (!hB64 || !pB64 || !sB64) return null;

  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(hB64, 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(pB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (header?.alg !== 'RS256' || typeof header?.kid !== 'string' || !header.kid) {
    return null;
  }

  let certs = await obterCertificadosFirebase(false);
  let certPem = certs[header.kid];
  if (!certPem) {
    certs = await obterCertificadosFirebase(true);
    certPem = certs[header.kid];
  }
  if (!certPem) return null;

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${hB64}.${pB64}`);
  verifier.end();
  let assinaturaOk = false;
  try {
    assinaturaOk = verifier.verify(certPem, Buffer.from(sB64, 'base64url'));
  } catch {
    return null;
  }
  if (!assinaturaOk) return null;

  const agoraSec = Math.floor(Date.now() / 1000);
  if (payload?.aud !== projectId) return null;
  if (payload?.iss !== `https://securetoken.googleapis.com/${projectId}`) return null;
  if (typeof payload?.sub !== 'string' || !payload.sub || payload.sub.length > 128) return null;
  if (Number(payload?.exp || 0) <= agoraSec) return null;
  if (Number(payload?.iat || 0) > agoraSec + 300) return null;

  // Bloqueia sessões anônimas na API fiscal
  if (payload?.firebase?.sign_in_provider === 'anonymous') {
    return null;
  }

  const isMaster = payload?.is_master === true || payload?.role === 'master';
  const lojaId = typeof payload?.lojaId === 'string' && payload.lojaId.trim() ? payload.lojaId.trim() : null;
  if (!isMaster && !lojaId) {
    return null;
  }

  return {
    uid: payload.sub,
    isMaster,
    lojaId,
    role: String(payload?.role || ''),
  };
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

async function lerDocFirestoreAdmin(projectId, accessToken, caminho) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${caminho}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`Firestore GET ${resp.status}`);
  const data = await resp.json();
  const out = {};
  for (const [k, v] of Object.entries(data.fields || {})) {
    const val = extrairValorFirestore(v);
    if (val !== undefined) out[k] = val;
  }
  return out;
}

function getBaseUrl(ambiente) {
  return ambiente === 'producao'
    ? 'https://api.focusnfe.com.br'
    : 'https://homologacao.focusnfe.com.br';
}

function mapearFormaPagamentoSefaz(forma) {
  switch (forma) {
    case 'dinheiro':
      return '01'; // Dinheiro
    case 'cartao_credito':
      return '03'; // Cartão de Crédito
    case 'cartao_debito':
      return '04'; // Cartão de Débito
    case 'fiado':
      return '05'; // Crédito Loja
    case 'pix':
      return '17'; // Pagamento Instantâneo (PIX)
    default:
      return '99'; // Outros
  }
}

function formatarDataIsoBrasil(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const offsetMin = -180; // America/Sao_Paulo (-03:00)
  const local = new Date(date.getTime() + (date.getTimezoneOffset() + offsetMin) * 60000);
  return (
    `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}` +
    `T${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}-03:00`
  );
}

function normalizarUrlFocus(baseUrl, pathOrUrl) {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  return `${baseUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

const ACOES_PERMITIDAS = new Set(['testar_conexao', 'emitir', 'consultar', 'cancelar']);
const rateLimitPorIp = new Map();
const RATE_LIMIT_JANELA_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQ = 40;

function verificarRateLimitNfce(req) {
  const ip =
    String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local')
      .split(',')[0]
      .trim();
  const agora = Date.now();
  const registro = rateLimitPorIp.get(ip) || { count: 0, resetEm: agora + RATE_LIMIT_JANELA_MS };
  if (agora > registro.resetEm) {
    registro.count = 0;
    registro.resetEm = agora + RATE_LIMIT_JANELA_MS;
  }
  registro.count += 1;
  rateLimitPorIp.set(ip, registro);
  if (rateLimitPorIp.size > 500) {
    for (const [k, v] of rateLimitPorIp.entries()) {
      if (agora > v.resetEm) rateLimitPorIp.delete(k);
    }
  }
  return registro.count <= RATE_LIMIT_MAX_REQ;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-NFCE-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido. Use POST.' });
  }

  if (!verificarRateLimitNfce(req)) {
    return res.status(429).json({
      sucesso: false,
      erro: 'Muitas solicitações fiscais em sequência. Aguarde 1 minuto e tente novamente.',
    });
  }

  const secretServidor = String(process.env.NFCE_API_SECRET || '').trim();
  if (secretServidor) {
    const secretHeader = String(req.headers['x-nfce-secret'] || '').trim();
    if (!compararTempoConstante(secretHeader, secretServidor)) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado para emitir NFC-e.' });
    }
  }

  let serviceAccount = null;
  const rawSa = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
  if (rawSa) {
    try {
      serviceAccount = parseServiceAccountEnv(rawSa);
    } catch {}
  }

  const projectId = String(
    serviceAccount?.project_id || process.env.FIREBASE_PROJECT_ID || 'adega-delivery-pdv'
  ).trim();

  try {
    const body = req.body || {};
    const { acao = 'emitir', ambiente = 'homologacao', tokenFocusNfe } = body;
    const lojaIdBody = String(body.lojaId || '').trim();
    const temTokenCorpo = Boolean(String(tokenFocusNfe || '').trim());

    const exigirAuth =
      Boolean(serviceAccount) ||
      process.env.EXIGIR_AUTH_API === 'true' ||
      !temTokenCorpo;

    let claims = null;
    if (exigirAuth) {
      const authHeaderReq = String(req.headers.authorization || '');
      if (!authHeaderReq.startsWith('Bearer ')) {
        return res.status(401).json({
          sucesso: false,
          erro: 'Sessão autenticada obrigatória para operações fiscais (NFC-e).',
        });
      }
      const idToken = authHeaderReq.slice(7).trim();
      claims = await verificarFirebaseIdToken(idToken, projectId);
      if (!claims) {
        return res.status(401).json({
          sucesso: false,
          erro: 'Token de sessão inválido, expirado ou sessão anônima não autorizada.',
        });
      }
      if (!claims.isMaster) {
        if (!lojaIdBody || lojaIdBody !== claims.lojaId) {
          return res.status(403).json({
            sucesso: false,
            erro: 'Você não possui permissão para operar NFC-e em nome desta loja.',
          });
        }
      }
    }

    if (!ACOES_PERMITIDAS.has(String(acao))) {
      return res.status(400).json({ sucesso: false, erro: 'Ação fiscal não permitida.' });
    }

    if (acao === 'emitir') {
      if (!body.venda || !body.venda.id) {
        return res.status(400).json({ sucesso: false, erro: 'Dados da venda inválidos para emissão.' });
      }
      const valorTotalNum = Number(body.venda.valorTotal);
      if (!Number.isFinite(valorTotalNum) || valorTotalNum < 0) {
        return res.status(400).json({ sucesso: false, erro: 'Valor total da venda inválido para NFC-e.' });
      }
    }

    // Busca token Focus NFe seguro no Firestore quando Service Account estiver configurada
    let tokenDoFirestore = '';
    const lojaParaBuscar = lojaIdBody || claims?.lojaId || '';
    if (serviceAccount && lojaParaBuscar) {
      try {
        const accessToken = await obterAccessTokenAdmin(serviceAccount);
        const lojaDoc = await lerDocFirestoreAdmin(
          projectId,
          accessToken,
          `supermercados/${encodeURIComponent(lojaParaBuscar)}`
        );
        tokenDoFirestore = String(lojaDoc?.configFiscal?.tokenFocusNfe || '').trim();
      } catch {}
    }

    let token = '';
    if (acao === 'testar_conexao') {
      token =
        String(tokenFocusNfe || '').trim() ||
        tokenDoFirestore ||
        (claims ? String(process.env.FOCUS_NFE_TOKEN || '').trim() : '');
    } else {
      token =
        tokenDoFirestore ||
        (claims ? String(process.env.FOCUS_NFE_TOKEN || '').trim() : '') ||
        (!serviceAccount ? String(tokenFocusNfe || '').trim() : '');
    }

    if (!token) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Token da Focus NFe não configurado para esta loja. Salve o token nas Configurações Fiscais antes de emitir.',
      });
    }

    const baseUrl = getBaseUrl(ambiente);
    const authHeader = 'Basic ' + Buffer.from(`${token}:`).toString('base64');

    // 1. TESTAR CONEXÃO / VALIDAR CREDENCIAIS NA FOCUS NFE
    if (acao === 'testar_conexao') {
      const cnpj = limparDigitos(body.cnpj);
      const url = cnpj ? `${baseUrl}/v2/empresas/${cnpj}` : `${baseUrl}/v2/hooks`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Authorization: authHeader },
      });
      const text = await resp.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (resp.status === 401 || resp.status === 403) {
        return res.status(200).json({
          sucesso: false,
          erro: 'Token Focus NFe inválido ou sem permissão para este ambiente.',
          detalhe: data,
        });
      }

      if (resp.status === 404 && cnpj) {
        return res.status(200).json({
          sucesso: true,
          aviso: 'Token válido! Porém este CNPJ ainda não está cadastrado na sua conta Focus NFe (ou está em outro ambiente).',
          ambiente,
          detalhe: data,
        });
      }

      return res.status(200).json({
        sucesso: resp.ok,
        ambiente,
        mensagem: resp.ok
          ? `Conexão confirmada com a Focus NFe (${ambiente === 'producao' ? 'Produção' : 'Homologação'}).`
          : data?.mensagem || `Resposta Focus NFe: HTTP ${resp.status}`,
        empresa: resp.ok ? data : undefined,
      });
    }

    // 2. CONSULTAR STATUS DE NFC-E JÁ ENVIADA
    if (acao === 'consultar') {
      const ref = String(body.ref || '').trim();
      if (!ref || ref.length > 120) {
        return res.status(400).json({ sucesso: false, erro: 'Referência (ref) da NFC-e inválida.' });
      }

      const resp = await fetch(`${baseUrl}/v2/nfce/${encodeURIComponent(ref)}?completa=1`, {
        method: 'GET',
        headers: { Authorization: authHeader },
      });
      const data = await resp.json().catch(() => ({}));

      return res.status(200).json({
        sucesso: resp.ok,
        ref,
        ambiente,
        status: data.status || (resp.ok ? 'processando_autorizacao' : 'erro_autorizacao'),
        numero: data.numero ? String(data.numero) : undefined,
        serie: data.serie ? String(data.serie) : undefined,
        chave: data.chave_nfe || undefined,
        danfeUrl: normalizarUrlFocus(baseUrl, data.caminho_danfe),
        xmlUrl: normalizarUrlFocus(baseUrl, data.caminho_xml_nota_fiscal),
        qrcodeUrl: data.qrcode_url || undefined,
        mensagemSefaz: data.mensagem_sefaz || data.mensagem || undefined,
        raw: data,
      });
    }

    // 3. CANCELAR NFC-E
    if (acao === 'cancelar') {
      const ref = String(body.ref || '').trim();
      const justificativa = String(body.justificativa || '').trim();
      if (!ref || ref.length > 120) {
        return res.status(400).json({ sucesso: false, erro: 'Referência (ref) da NFC-e inválida.' });
      }
      if (justificativa.length < 15) {
        return res.status(400).json({
          sucesso: false,
          erro: 'A justificativa de cancelamento na SEFAZ precisa ter pelo menos 15 caracteres.',
        });
      }

      const resp = await fetch(`${baseUrl}/v2/nfce/${encodeURIComponent(ref)}`, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ justificativa }),
      });
      const data = await resp.json().catch(() => ({}));

      return res.status(200).json({
        sucesso: resp.ok && data.status === 'cancelado',
        status: data.status || 'erro',
        mensagemSefaz: data.mensagem_sefaz || data.mensagem || 'Solicitação processada.',
        raw: data,
      });
    }

    // 4. EMITIR NFC-E (MODELO 65)
    if (acao === 'emitir') {
      const { ref, emitente = {}, venda = {}, cpfNaNota = '', padroes = {} } = body;
      const refFinal = String(ref || `pdv_${Date.now()}`).trim();
      if (!refFinal || refFinal.length > 120) {
        return res.status(400).json({ sucesso: false, erro: 'Referência da NFC-e inválida ou longa demais.' });
      }
      const cnpjEmitente = limparDigitos(emitente.cnpj);

      if (cnpjEmitente.length !== 14) {
        return res.status(400).json({
          sucesso: false,
          erro: 'CNPJ da loja inválido para emissão fiscal. Verifique as Configurações Fiscais.',
        });
      }

      const itensVenda = Array.isArray(venda.itens) ? venda.itens : [];
      if (itensVenda.length === 0 || itensVenda.length > 500) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Quantidade de itens inválida para emissão de NFC-e (1 a 500 itens).',
        });
      }

      const ncmPadrao = limparDigitos(padroes.ncmPadrao || '21069090').padEnd(8, '0').slice(0, 8);
      const cfopPadrao = limparDigitos(padroes.cfopPadrao || '5102').slice(0, 4) || '5102';
      const csosnPadrao = limparDigitos(padroes.csosnPadrao || '102').slice(0, 3) || '102';
      const unidadePadrao = String(padroes.unidadePadrao || 'UN').trim().toUpperCase() || 'UN';

      const descontoTotal = venda.desconto && Number(venda.desconto) > 0 ? Number(Number(venda.desconto).toFixed(2)) : 0;
      const taxaEntrega = venda.taxaEntrega && Number(venda.taxaEntrega) > 0 ? Number(Number(venda.taxaEntrega).toFixed(2)) : 0;
      const somaBrutaItens = itensVenda.reduce(
        (acc, item) => acc + Number((item.subtotal != null ? item.subtotal : Number(item.quantidade || 1) * Number(item.preco_unitario || 0)).toFixed(2)),
        0
      );
      const descontoAplicavel = Math.min(descontoTotal, somaBrutaItens);
      let descontoAcumulado = 0;
      let outrasDespesasAcumuladas = 0;

      const itemsMapeados = itensVenda.map((item, idx) => {
        const qtd = Number(item.quantidade || 1);
        const vUnit = Number(item.preco_unitario || 0);
        const vBruto = Number((item.subtotal != null ? item.subtotal : qtd * vUnit).toFixed(2));
        const ncmItem = limparDigitos(item.ncm || ncmPadrao).padEnd(8, '0').slice(0, 8);
        const cfopItem = limparDigitos(item.cfop || cfopPadrao).slice(0, 4) || cfopPadrao;
        const csosnItem = limparDigitos(item.csosn || csosnPadrao).slice(0, 3) || csosnPadrao;
        const unItem = String(item.unidade_medida || unidadePadrao).trim().toUpperCase().slice(0, 6) || 'UN';

        const objItem = {
          numero_item: idx + 1,
          codigo_produto: String(item.codigo || `ITEM${idx + 1}`).slice(0, 60),
          descricao: String(item.nome || 'PRODUTO').slice(0, 120),
          codigo_ncm: ncmItem,
          cfop: cfopItem,
          unidade_comercial: unItem,
          quantidade_comercial: qtd,
          valor_unitario_comercial: Number(vUnit.toFixed(4)),
          valor_bruto: vBruto,
          unidade_tributavel: unItem,
          quantidade_tributavel: qtd,
          valor_unitario_tributavel: Number(vUnit.toFixed(4)),
          icms_origem: Number(item.origem_fiscal || 0),
          icms_situacao_tributaria: csosnItem,
          pis_situacao_tributaria: '07',
          cofins_situacao_tributaria: '07',
        };

        if (descontoAplicavel > 0 && somaBrutaItens > 0) {
          const descBruto =
            idx === itensVenda.length - 1
              ? Number(Math.max(0, descontoAplicavel - descontoAcumulado).toFixed(2))
              : Number(((vBruto / somaBrutaItens) * descontoAplicavel).toFixed(2));
          const descItem = Number(Math.min(descBruto, vBruto).toFixed(2));
          descontoAcumulado = Number((descontoAcumulado + descItem).toFixed(2));
          if (descItem > 0) {
            objItem.valor_desconto = descItem;
          }
        }

        if (taxaEntrega > 0 && somaBrutaItens > 0) {
          const despItem =
            idx === itensVenda.length - 1
              ? Number(Math.max(0, taxaEntrega - outrasDespesasAcumuladas).toFixed(2))
              : Number(((vBruto / somaBrutaItens) * taxaEntrega).toFixed(2));
          outrasDespesasAcumuladas = Number((outrasDespesasAcumuladas + despItem).toFixed(2));
          if (despItem > 0) {
            objItem.valor_outras_despesas = despItem;
          }
        }

        if (item.cest) {
          objItem.cest = limparDigitos(item.cest).slice(0, 7);
        }
        return objItem;
      });

      const payloadFocus = {
        natureza_operacao: 'VENDA AO CONSUMIDOR',
        data_emissao: formatarDataIsoBrasil(),
        tipo_documento: 1,
        finalidade_emissao: 1,
        consumidor_final: 1,
        presenca_comprador: taxaEntrega > 0 ? 2 : 1,
        cnpj_emitente: cnpjEmitente,
        nome_emitente: emitente.razaoSocial || emitente.nomeFantasia || 'ESTABELECIMENTO COMERCIAL',
        nome_fantasia_emitente: emitente.nomeFantasia || emitente.razaoSocial || undefined,
        inscricao_estadual_emitente: limparDigitos(emitente.inscricaoEstadual) || undefined,
        regime_tributario_emitente: Number(emitente.regimeTributario || 1),
        logradouro_emitente: emitente.logradouro || undefined,
        numero_emitente: emitente.numero || 'S/N',
        bairro_emitente: emitente.bairro || undefined,
        municipio_emitente: emitente.municipio || undefined,
        uf_emitente: emitente.uf ? String(emitente.uf).toUpperCase() : undefined,
        cep_emitente: limparDigitos(emitente.cep) || undefined,
        items: itemsMapeados,
        formas_pagamento: [
          {
            forma_pagamento: mapearFormaPagamentoSefaz(venda.formaPagamento),
            valor_pagamento: Number(Number(venda.valorTotal || 0).toFixed(2)),
          },
        ],
      };

      const docDest = limparDigitos(cpfNaNota);
      if (docDest.length === 11) {
        payloadFocus.cpf_destinatario = docDest;
      } else if (docDest.length === 14) {
        payloadFocus.cnpj_destinatario = docDest;
      }

      if (descontoTotal > 0) {
        payloadFocus.valor_desconto = descontoTotal;
      }

      if (taxaEntrega > 0) {
        payloadFocus.valor_outras_despesas = taxaEntrega;
      }

      const resp = await fetch(`${baseUrl}/v2/nfce?ref=${encodeURIComponent(refFinal)}`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadFocus),
      });

      const data = await resp.json().catch(() => ({}));
      const statusRet = data.status || (resp.ok ? 'processando_autorizacao' : 'erro_autorizacao');

      return res.status(200).json({
        sucesso: resp.ok && statusRet !== 'erro_autorizacao',
        ref: refFinal,
        ambiente,
        status: statusRet,
        numero: data.numero ? String(data.numero) : undefined,
        serie: data.serie ? String(data.serie) : undefined,
        chave: data.chave_nfe || undefined,
        danfeUrl: normalizarUrlFocus(baseUrl, data.caminho_danfe),
        xmlUrl: normalizarUrlFocus(baseUrl, data.caminho_xml_nota_fiscal),
        qrcodeUrl: data.qrcode_url || undefined,
        mensagemSefaz:
          data.mensagem_sefaz ||
          data.mensagem ||
          (Array.isArray(data.erros) ? data.erros.map((e) => e.mensagem || e).join('; ') : undefined),
        raw: data,
      });
    }

    return res.status(400).json({ sucesso: false, erro: `Ação fiscal desconhecida: ${acao}` });
  } catch (err) {
    console.error('[API /api/nfce] Erro inesperado:', err);
    return res.status(500).json({
      sucesso: false,
      erro: err?.message || 'Erro interno ao comunicar com a Focus NFe.',
    });
  }
}
