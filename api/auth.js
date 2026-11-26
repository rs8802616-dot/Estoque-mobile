// Vercel Serverless Function / Express Handler: /api/auth
// - Emite Firebase Custom Token (JWT RS256) com Custom Claims (role, lojaId, operadorId, sessaoId, is_master)
// - Valida tokens de painel (adm_, cx_, gar_, coz_) e link Master no servidor com cookies HttpOnly assinados
// - Valida credenciais de loja e operadores/caixas no servidor com PBKDF2-SHA256 (210k iterações + pepper)
// - Controla lockout de tentativas (5 falhas / 15 min) no Firestore via Service Account

import crypto from 'node:crypto';
import { parseServiceAccountEnv } from './_serviceAccount.js';

const RATE_JANELA_MS = 60 * 1000;
const RATE_MAX = 25;
const MAX_TENTATIVAS_LOCKOUT = 5;
const BLOQUEIO_MS = 15 * 60 * 1000;
const PBKDF2_ITERACOES = 210000;
const SENHAS_PADRAO_FRACAS = new Set([
  '123',
  '1234',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  '00000000',
  'mudar@123',
  'mudar123',
  'senha123',
  'senha@123',
  'admin123',
  'qwerty123',
  'abc12345',
]);
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

function derivarPbkdf2(senha, saltHex, pepper) {
  return crypto
    .pbkdf2Sync(`${senha}${pepper}`, Buffer.from(saltHex, 'utf8'), PBKDF2_ITERACOES, 32, 'sha256')
    .toString('hex');
}

function sha256Legado(senha, salt) {
  return crypto.createHash('sha256').update(`${salt}:${senha}`).digest('hex');
}

function criarCustomTokenFirebase(serviceAccount, uid, claims = {}) {
  const agora = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: agora,
    exp: agora + 3600,
    uid: String(uid).slice(0, 128),
    claims,
  };

  const segmentoHeader = base64Url(JSON.stringify(header));
  const segmentoPayload = base64Url(JSON.stringify(payload));
  const assinaturaBase = `${segmentoHeader}.${segmentoPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(assinaturaBase);
  signer.end();
  const assinatura = signer
    .sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${assinaturaBase}.${assinatura}`;
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
    return { mapValue: { fields: converterParaFirestoreFields(v) } };
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

async function listarColecaoFirestoreAdmin(projectId, accessToken, colecao, pageSize = 200) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodeURIComponent(colecao)}?pageSize=${pageSize}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (resp.status === 404) return [];
  if (!resp.ok) throw new Error(`Firestore LIST ${resp.status}`);
  const data = await resp.json();
  return Array.isArray(data?.documents) ? data.documents.map(extrairDocFirestore).filter(Boolean) : [];
}

function normalizarSlugLojaServer(nomeOuId) {
  const limpo = String(nomeOuId || 'loja-centro')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return limpo || 'loja-centro';
}

function lojaCorrespondeSlug(lojaDoc, slugOuId) {
  if (!lojaDoc || !slugOuId) return false;
  const slugLimpo = String(slugOuId).trim().toLowerCase();
  const idLower = String(lojaDoc.id || lojaDoc._docId || '').toLowerCase();
  const slugField = String(lojaDoc.slug || '').toLowerCase();
  return (
    idLower === slugLimpo ||
    (slugField && slugField === slugLimpo) ||
    normalizarSlugLojaServer(lojaDoc.nome || idLower) === slugLimpo ||
    (slugLimpo === 'loja-centro' && idLower === 'loja_matriz_01')
  );
}

async function localizarLojaFirestoreAdmin(projectId, accessToken, slugOuId) {
  const raw = String(slugOuId || '').trim();
  if (!raw) return null;
  const slugLimpo = raw.toLowerCase();

  const direta = await lerDocFirestoreAdmin(
    projectId,
    accessToken,
    `supermercados/${encodeURIComponent(raw)}`
  );
  if (direta) return direta;

  if (slugLimpo === 'loja-centro') {
    const matriz = await lerDocFirestoreAdmin(projectId, accessToken, 'supermercados/loja_matriz_01');
    if (matriz) return matriz;
  }

  const porSlug = await consultarColecaoPorCampoAdmin(
    projectId,
    accessToken,
    'supermercados',
    'slug',
    slugLimpo
  );
  if (porSlug.length > 0) return porSlug[0];

  if (raw !== slugLimpo) {
    const porSlugRaw = await consultarColecaoPorCampoAdmin(
      projectId,
      accessToken,
      'supermercados',
      'slug',
      raw
    );
    if (porSlugRaw.length > 0) return porSlugRaw[0];
  }

  const todas = await listarColecaoFirestoreAdmin(projectId, accessToken, 'supermercados', 200);
  return todas.find((l) => lojaCorrespondeSlug(l, slugLimpo)) || null;
}

function sanitizarLojaParaPainel(lojaDoc) {
  if (!lojaDoc) return null;
  const id = String(lojaDoc.id || lojaDoc._docId || '');
  return {
    id,
    nome: String(lojaDoc.nome || 'Supermercado'),
    slug: String(lojaDoc.slug || normalizarSlugLojaServer(lojaDoc.nome || id)),
    cnpj: String(lojaDoc.cnpj || ''),
    senha: '',
    senhaAdmin: '',
    status: lojaDoc.status === 'bloqueado' ? 'bloqueado' : 'ativo',
    motivoBloqueio: String(lojaDoc.motivoBloqueio || ''),
    senha_revogada: Boolean(lojaDoc.senha_revogada),
    limiteCaixas: lojaDoc.limiteCaixas,
    limiteSupervisores: lojaDoc.limiteSupervisores,
    permissoesLoja: lojaDoc.permissoesLoja,
    endereco: lojaDoc.endereco,
    cidade: lojaDoc.cidade,
    telefone: lojaDoc.telefone,
    taxa_entrega: lojaDoc.taxa_entrega,
    tempo_estimado_entrega: lojaDoc.tempo_estimado_entrega,
  };
}

function sanitizarOperadorParaCliente(opDoc) {
  if (!opDoc) return null;
  return {
    id: String(opDoc.id || opDoc._docId || ''),
    lojaId: String(opDoc.lojaId || ''),
    nome: String(opDoc.nome || 'Operador'),
    cargo: String(opDoc.cargo || 'Operador de Caixa'),
    cpfOuUsuario: String(opDoc.cpfOuUsuario || ''),
    pinSenha: '',
    permissoes: opDoc.permissoes || {},
    ativo: opDoc.ativo !== false,
    dataCadastro: opDoc.dataCadastro,
  };
}

function verificarSenhaDocumento(docObj, senhaDigitada, pepper, senhaLegadaTexto = '') {
  if (!docObj || typeof senhaDigitada !== 'string' || !senhaDigitada) {
    return { ok: false, precisaMigrarPbkdf2: false };
  }

  const saltPbkdf2Atual = docObj.senhaSaltPbkdf2 || docObj.senhaSalt;
  const pbkdf2AtualValido =
    docObj.senhaAlgo === 'pbkdf2' &&
    Boolean(docObj.senhaHashPbkdf2) &&
    Boolean(saltPbkdf2Atual) &&
    (!docObj.senhaSalt ||
      !docObj.senhaPbkdf2RefSalt ||
      docObj.senhaSalt === docObj.senhaPbkdf2RefSalt);

  if (pbkdf2AtualValido) {
    const ok = compararTempoConstante(
      derivarPbkdf2(senhaDigitada, saltPbkdf2Atual, pepper),
      String(docObj.senhaHashPbkdf2)
    );
    return { ok, precisaMigrarPbkdf2: false };
  }

  if (docObj.senhaHash && docObj.senhaSalt) {
    const ok = compararTempoConstante(
      sha256Legado(senhaDigitada, docObj.senhaSalt),
      String(docObj.senhaHash)
    );
    return { ok, precisaMigrarPbkdf2: ok };
  }

  if (senhaLegadaTexto && String(senhaLegadaTexto).trim().length > 0) {
    const ok = compararTempoConstante(senhaDigitada, String(senhaLegadaTexto));
    return { ok, precisaMigrarPbkdf2: ok };
  }

  return { ok: false, precisaMigrarPbkdf2: false };
}

function parseCookies(req) {
  const raw = String(req.headers?.cookie || '');
  const out = {};
  raw.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      try {
        out[k] = decodeURIComponent(v);
      } catch {
        out[k] = v;
      }
    }
  });
  return out;
}

function criarCookieAssinado(payloadObj, secretHmac) {
  const payload = base64Url(JSON.stringify(payloadObj));
  const sig = crypto.createHmac('sha256', secretHmac).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verificarCookieAssinado(cookieVal, secretHmac) {
  if (!cookieVal || typeof cookieVal !== 'string' || !cookieVal.includes('.')) return null;
  const [payload, sig] = cookieVal.split('.');
  if (!payload || !sig) return null;
  const esperado = crypto.createHmac('sha256', secretHmac).update(payload).digest('base64url');
  if (!compararTempoConstante(sig, esperado)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed || Number(parsed?.exp || 0) <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function criarCookieMasterAssinado(secretHmac) {
  return criarCookieAssinado({ role: 'master', exp: Date.now() + 12 * 60 * 60 * 1000 }, secretHmac);
}

function verificarCookieMasterAssinado(cookieVal, secretHmac) {
  const parsed = verificarCookieAssinado(cookieVal, secretHmac);
  return parsed?.role === 'master';
}

function criarCookieUsuarioAuth(dados, secretHmac) {
  return criarCookieAssinado(
    {
      type: 'usuario_auth',
      uid: String(dados.uid || '').slice(0, 128),
      role: String(dados.role || ''),
      is_master: Boolean(dados.is_master),
      lojaId: dados.lojaId ? String(dados.lojaId) : null,
      operadorId: dados.operadorId ? String(dados.operadorId) : null,
      exp: Date.now() + 12 * 60 * 60 * 1000,
    },
    secretHmac
  );
}

function verificarCookieUsuarioAuth(cookieVal, secretHmac) {
  const parsed = verificarCookieAssinado(cookieVal, secretHmac);
  if (!parsed || parsed.type !== 'usuario_auth' || !parsed.uid || !parsed.role) return null;
  return parsed;
}

function definirCookieHttpOnly(req, res, nome, valor, maxAgeSec = 43200) {
  const isHttps =
    String(req.headers['x-forwarded-proto'] || '').includes('https') ||
    Boolean(process.env.VERCEL);
  const flags = `HttpOnly; Path=/; Max-Age=${maxAgeSec}; SameSite=Strict${isHttps ? '; Secure' : ''}`;
  const novoCookie = `${nome}=${encodeURIComponent(valor)}; ${flags}`;
  const existente = typeof res.getHeader === 'function' ? res.getHeader('Set-Cookie') : undefined;
  if (Array.isArray(existente)) {
    res.setHeader('Set-Cookie', [...existente, novoCookie]);
  } else if (typeof existente === 'string' && existente.length > 0) {
    res.setHeader('Set-Cookie', [existente, novoCookie]);
  } else {
    res.setHeader('Set-Cookie', novoCookie);
  }
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
    return res.status(405).json({ configurado: false, erro: 'Método não permitido. Use POST.' });
  }
  if (!checarRateLimit(req)) {
    return res.status(429).json({ configurado: false, erro: 'Muitas tentativas. Aguarde 1 minuto.' });
  }

  const body = req.body || {};
  const acao = String(body.acao || '').trim();
  const masterSecret = String(
    process.env.MASTER_PORTAL_TOKEN || process.env.VITE_MASTER_PORTAL_TOKEN || ''
  ).trim();
  const hmacSecret = String(
    process.env.SENHA_PEPPER || masterSecret || 'estoque_master_hmac_v1'
  );

  if (acao === 'logout_sessao') {
    definirCookieHttpOnly(req, res, 'em_usuario_auth', '', 0);
    return res.status(200).json({ ok: true });
  }

  if (acao === 'validar_master_token') {
    const tokenRecebido = String(body.token || '').trim();
    if (!masterSecret || !tokenRecebido || !compararTempoConstante(tokenRecebido, masterSecret)) {
      return res.status(401).json({ validado: false, erro: 'Token master inválido.' });
    }
    const cookieVal = criarCookieMasterAssinado(hmacSecret);
    definirCookieHttpOnly(req, res, 'em_master_sessao', cookieVal);
    return res.status(200).json({ validado: true });
  }

  if (acao === 'checar_sessao_master') {
    const cookies = parseCookies(req);
    const ok = verificarCookieMasterAssinado(cookies.em_master_sessao, hmacSecret);
    return res.status(ok ? 200 : 401).json({ validado: ok });
  }

  if (acao === 'autenticar_master') {
    const cookies = parseCookies(req);
    if (!verificarCookieMasterAssinado(cookies.em_master_sessao, hmacSecret)) {
      return res.status(401).json({ configurado: true, autenticado: false, erro: 'Sessão master inválida.' });
    }
    const masterUserEnv = String(process.env.MASTER_ADMIN_USER || '').trim().toLowerCase();
    const masterPassEnv = String(process.env.MASTER_ADMIN_PASS || '').trim();
    if (!masterUserEnv || !masterPassEnv) {
      return res.status(503).json({ configurado: false });
    }
    const u = String(body.usuario || '').trim().toLowerCase();
    const s = String(body.senha || '').trim();
    if (!compararTempoConstante(u, masterUserEnv) || !compararTempoConstante(s, masterPassEnv)) {
      return res.status(401).json({ configurado: true, autenticado: false, erro: 'Usuário ou senha Master inválidos.' });
    }
    const uidMaster = `master_${u}`;
    let customToken = null;
    let customTokenErro = '';
    let firebaseProjectId = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        const sa = parseServiceAccountEnv(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        firebaseProjectId = sa.project_id;
        customToken = criarCustomTokenFirebase(sa, uidMaster, {
          role: 'master',
          is_master: true,
          sessaoId: crypto.randomUUID(),
        });
      } catch (err) {
        customTokenErro = String(err?.message || err || 'Erro ao assinar Firebase Custom Token.');
        console.error('[api/auth] Falha ao assinar customToken Master:', customTokenErro);
      }
    } else {
      customTokenErro = 'FIREBASE_SERVICE_ACCOUNT_JSON não configurada no servidor.';
      console.warn('[api/auth] Master autenticado sem FIREBASE_SERVICE_ACCOUNT_JSON para emitir Custom Token.');
    }
    definirCookieHttpOnly(
      req,
      res,
      'em_usuario_auth',
      criarCookieUsuarioAuth(
        {
          uid: uidMaster,
          role: 'master',
          is_master: true,
          lojaId: null,
          operadorId: null,
        },
        hmacSecret
      )
    );
    return res.status(200).json({
      configurado: true,
      autenticado: true,
      customToken,
      ...(firebaseProjectId ? { firebaseProjectId } : {}),
      ...(customTokenErro ? { customTokenErro } : {}),
    });
  }

  const rawSa = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawSa) {
    return res.status(503).json({
      configurado: false,
      erro: 'FIREBASE_SERVICE_ACCOUNT_JSON não configurado no servidor.',
    });
  }

  let serviceAccount;
  try {
    serviceAccount = parseServiceAccountEnv(rawSa);
  } catch (err) {
    const detalhe = String(err?.message || err || 'formato incorreto');
    console.error('[api/auth] FIREBASE_SERVICE_ACCOUNT_JSON inválido:', detalhe);
    return res.status(500).json({
      configurado: false,
      erro: `FIREBASE_SERVICE_ACCOUNT_JSON inválido: ${detalhe}`,
    });
  }

  const pepper = String(process.env.SENHA_PEPPER || 'estoque_mobile_pepper_v1');

  if (acao === 'renovar_custom_token') {
    const cookies = parseCookies(req);
    const dados = verificarCookieUsuarioAuth(cookies.em_usuario_auth, hmacSecret);
    if (!dados) {
      return res.status(401).json({
        configurado: true,
        autenticado: false,
        erro: 'Sessão de servidor expirada. Faça login novamente.',
      });
    }
    try {
      const claims = {
        role: dados.role,
        is_master: Boolean(dados.is_master),
        ...(dados.lojaId ? { lojaId: dados.lojaId } : {}),
        ...(dados.operadorId ? { operadorId: dados.operadorId } : {}),
        sessaoId: crypto.randomUUID(),
      };
      const customToken = criarCustomTokenFirebase(serviceAccount, dados.uid, claims);
      return res.status(200).json({
        configurado: true,
        autenticado: true,
        customToken,
        firebaseProjectId: serviceAccount.project_id,
      });
    } catch (err) {
      console.error('[api/auth] Falha ao renovar customToken:', err?.message || err);
      return res.status(500).json({
        configurado: true,
        autenticado: false,
        erro: err?.message || 'Erro interno ao renovar token Firebase.',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // A. Validação server-side dos links exclusivos da loja (adm_/cx_/gar_/coz_)
  // ---------------------------------------------------------------------------
  if (acao === 'validar_painel_token') {
    const lojaSlug = String(body.lojaSlug || '').trim();
    const tokenRecebido = String(body.token || '').trim();
    if (!lojaSlug || !tokenRecebido) {
      return res.status(400).json({ configurado: true, validado: false, erro: 'Parâmetros de link incompletos.' });
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const lojaDoc = await localizarLojaFirestoreAdmin(projectId, accessToken, lojaSlug);
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, validado: false, erro: 'Link não reconhecido.' });
      }

      let papelPermitido = null;
      if (lojaDoc.token_admin && compararTempoConstante(tokenRecebido, String(lojaDoc.token_admin))) {
        papelPermitido = 'admin';
      } else if (lojaDoc.token_caixa && compararTempoConstante(tokenRecebido, String(lojaDoc.token_caixa))) {
        papelPermitido = 'caixa';
      } else if (lojaDoc.token_garcom && compararTempoConstante(tokenRecebido, String(lojaDoc.token_garcom))) {
        papelPermitido = 'garcom';
      } else if (lojaDoc.token_cozinha && compararTempoConstante(tokenRecebido, String(lojaDoc.token_cozinha))) {
        papelPermitido = 'cozinha';
      }

      if (!papelPermitido) {
        return res.status(401).json({ configurado: true, validado: false, erro: 'Token de acesso inválido.' });
      }

      const lojaSanitizada = sanitizarLojaParaPainel(lojaDoc);
      const cookieVal = criarCookieAssinado(
        {
          type: 'painel',
          lojaId: lojaSanitizada.id,
          lojaSlug: lojaSanitizada.slug || normalizarSlugLojaServer(lojaSlug),
          papelPermitido,
          exp: Date.now() + 12 * 60 * 60 * 1000,
        },
        hmacSecret
      );
      definirCookieHttpOnly(req, res, 'em_painel_sessao', cookieVal);

      return res.status(200).json({
        configurado: true,
        validado: true,
        papelPermitido,
        loja: lojaSanitizada,
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        validado: false,
        erro: err?.message || 'Erro interno ao validar link do painel.',
      });
    }
  }

  if (acao === 'checar_sessao_painel') {
    const lojaSlug = String(body.lojaSlug || '').trim();
    const cookies = parseCookies(req);
    const sessaoPainel = verificarCookieAssinado(cookies.em_painel_sessao, hmacSecret);
    if (!sessaoPainel || sessaoPainel.type !== 'painel' || !sessaoPainel.lojaId) {
      return res.status(401).json({ configurado: true, validado: false, erro: 'Sessão de painel ausente ou expirada.' });
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const lojaDoc = await lerDocFirestoreAdmin(
        projectId,
        accessToken,
        `supermercados/${encodeURIComponent(String(sessaoPainel.lojaId))}`
      );
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, validado: false, erro: 'Loja não encontrada.' });
      }

      const slugLimpo = lojaSlug.toLowerCase();
      const correspondeSlug =
        !lojaSlug ||
        lojaCorrespondeSlug(lojaDoc, lojaSlug) ||
        String(sessaoPainel.lojaSlug || '').toLowerCase() === slugLimpo;

      if (!correspondeSlug) {
        return res.status(403).json({ configurado: true, validado: false, erro: 'Sessão não corresponde a esta loja.' });
      }

      return res.status(200).json({
        configurado: true,
        validado: true,
        papelPermitido: String(sessaoPainel.papelPermitido || 'admin'),
        loja: sanitizarLojaParaPainel(lojaDoc),
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        validado: false,
        erro: err?.message || 'Erro ao verificar sessão do painel.',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // B. Login de Administrador da Loja com PBKDF2 + lockout + Custom Token
  // ---------------------------------------------------------------------------
  if (acao === 'autenticar_loja') {
    const lojaId = String(body.lojaId || '').trim();
    const senha = String(body.senha || '');
    if (!lojaId || !senha) {
      return res.status(400).json({ configurado: true, erro: 'Informe lojaId e senha.' });
    }

    const cookies = parseCookies(req);
    const sessaoPainel = verificarCookieAssinado(cookies.em_painel_sessao, hmacSecret);
    if (sessaoPainel?.type === 'painel') {
      if (String(sessaoPainel.lojaId || '') !== lojaId) {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: 'Link de acesso não corresponde a esta loja.',
        });
      }
      if (sessaoPainel.papelPermitido && sessaoPainel.papelPermitido !== 'admin') {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: 'Este link é restrito à equipe operacional. Utilize o Link Oficial da Loja (Admin) para acessar como administrador.',
        });
      }
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const ip = getClientIp(req).replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeLojaLock = lojaId.replace(/[^a-zA-Z0-9._-]/g, '_');
      const lockoutPath = `controle_login/${safeLojaLock}__${ip}`;
      const lockDoc = (await lerDocFirestoreAdmin(projectId, accessToken, lockoutPath)) || {
        tentativas: 0,
        bloqueadoAte: 0,
      };

      const agora = Date.now();
      if (lockDoc.bloqueadoAte && Number(lockDoc.bloqueadoAte) > agora) {
        const seg = Math.ceil((Number(lockDoc.bloqueadoAte) - agora) / 1000);
        return res.status(429).json({
          configurado: true,
          autenticado: false,
          bloqueado: true,
          segundosRestantes: seg,
          erro: `Acesso bloqueado por segurança. Tente novamente em ${Math.ceil(seg / 60)} min.`,
        });
      }

      const lojaDoc = await lerDocFirestoreAdmin(
        projectId,
        accessToken,
        `supermercados/${encodeURIComponent(lojaId)}`
      );
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, autenticado: false, erro: 'Loja não encontrada.' });
      }
      if (lojaDoc.status === 'bloqueado') {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: `Acesso suspenso: estabelecimento "${lojaDoc.nome || lojaId}" bloqueado pela administração.`,
        });
      }
      if (lojaDoc.senha_revogada === true) {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          senhaRevogada: true,
          erro: 'Senha revogada pela administração. Cadastre uma nova senha para continuar.',
        });
      }

      const { ok: senhaOk, precisaMigrarPbkdf2 } = verificarSenhaDocumento(
        lojaDoc,
        senha,
        pepper,
        lojaDoc.senha || lojaDoc.senhaAdmin || ''
      );

      if (!senhaOk) {
        const novasTentativas = Number(lockDoc.tentativas || 0) + 1;
        const bloqueadoAte =
          novasTentativas >= MAX_TENTATIVAS_LOCKOUT ? Date.now() + BLOQUEIO_MS : 0;
        await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
          tentativas: novasTentativas,
          bloqueadoAte,
          atualizadoEm: Date.now(),
        });
        return res.status(bloqueadoAte > 0 ? 429 : 401).json({
          configurado: true,
          autenticado: false,
          tentativas: novasTentativas,
          bloqueado: bloqueadoAte > 0,
          erro:
            bloqueadoAte > 0
              ? 'Limite de 5 tentativas excedido. Acesso bloqueado por 15 minutos.'
              : `Senha incorreta (${novasTentativas}/${MAX_TENTATIVAS_LOCKOUT}).`,
        });
      }

      await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
        tentativas: 0,
        bloqueadoAte: 0,
        atualizadoEm: Date.now(),
      });

      const lojaDocId = String(lojaDoc._docId || lojaId);
      if (precisaMigrarPbkdf2) {
        const novoSalt = crypto.randomBytes(16).toString('hex');
        await gravarDocFirestoreAdmin(
          projectId,
          accessToken,
          `supermercados/${encodeURIComponent(lojaDocId)}`,
          {
            senha: '',
            senhaAdmin: '',
            senhaAlgo: 'pbkdf2',
            senhaSaltPbkdf2: novoSalt,
            senhaHashPbkdf2: derivarPbkdf2(senha, novoSalt, pepper),
            senhaPbkdf2RefSalt: lojaDoc.senhaSalt || '',
          }
        );
      }

      const sessaoId = crypto.randomUUID();
      const customToken = criarCustomTokenFirebase(serviceAccount, `${lojaId}_admin`, {
        role: 'admin_loja',
        is_master: false,
        lojaId,
        sessaoId,
      });

      definirCookieHttpOnly(
        req,
        res,
        'em_usuario_auth',
        criarCookieUsuarioAuth(
          {
            uid: `${lojaId}_admin`,
            role: 'admin_loja',
            is_master: false,
            lojaId,
            operadorId: null,
          },
          hmacSecret
        )
      );

      return res.status(200).json({
        configurado: true,
        autenticado: true,
        customToken,
        firebaseProjectId: serviceAccount.project_id,
        sessaoId,
        deveTrocarSenha: Boolean(lojaDoc.senha_revogada) || SENHAS_PADRAO_FRACAS.has(senha.toLowerCase()),
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        autenticado: false,
        erro: err?.message || 'Erro interno ao autenticar loja.',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // C. Redefinição server-side de senha revogada (ou senha fraca obrigatória)
  // ---------------------------------------------------------------------------
  if (acao === 'redefinir_senha_revogada') {
    const lojaId = String(body.lojaId || '').trim();
    const novaSenha = String(body.novaSenha || '').trim();
    const senhaAtual = String(body.senhaAtual || '');
    const senhaHashCliente = String(body.senhaHash || '').trim();
    const senhaSaltCliente = String(body.senhaSalt || '').trim();

    if (!lojaId || !novaSenha) {
      return res.status(400).json({ configurado: true, autenticado: false, erro: 'Dados incompletos para redefinir senha.' });
    }

    const cookies = parseCookies(req);
    const sessaoPainel = verificarCookieAssinado(cookies.em_painel_sessao, hmacSecret);
    if (!sessaoPainel || sessaoPainel.type !== 'painel' || String(sessaoPainel.lojaId || '') !== lojaId || sessaoPainel.papelPermitido !== 'admin') {
      return res.status(401).json({
        configurado: true,
        autenticado: false,
        erro: 'Link de administrador não validado para redefinir a senha desta loja.',
      });
    }

    if (novaSenha.length < 8 || SENHAS_PADRAO_FRACAS.has(novaSenha.toLowerCase())) {
      return res.status(400).json({
        configurado: true,
        autenticado: false,
        erro: 'A nova senha deve ter no mínimo 8 caracteres e não pode ser comum ou padrão.',
      });
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const lojaDoc = await lerDocFirestoreAdmin(
        projectId,
        accessToken,
        `supermercados/${encodeURIComponent(lojaId)}`
      );
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, autenticado: false, erro: 'Loja não encontrada.' });
      }
      if (lojaDoc.status === 'bloqueado') {
        return res.status(403).json({ configurado: true, autenticado: false, erro: 'Estabelecimento bloqueado pela administração.' });
      }

      const podeRedefinir =
        lojaDoc.senha_revogada === true ||
        (senhaAtual.length > 0 &&
          verificarSenhaDocumento(
            lojaDoc,
            senhaAtual,
            pepper,
            lojaDoc.senha || lojaDoc.senhaAdmin || ''
          ).ok);

      if (!podeRedefinir) {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: 'A redefinição não está liberada ou a senha atual não confere.',
        });
      }

      const saltShaFinal = senhaSaltCliente.length >= 16 ? senhaSaltCliente : crypto.randomBytes(16).toString('hex');
      const hashShaFinal = /^[a-f0-9]{64}$/i.test(senhaHashCliente) && senhaSaltCliente === saltShaFinal
        ? senhaHashCliente
        : sha256Legado(novaSenha, saltShaFinal);
      const novoSaltPbkdf2 = crypto.randomBytes(16).toString('hex');
      const novoHashPbkdf2 = derivarPbkdf2(novaSenha, novoSaltPbkdf2, pepper);

      const lojaDocId = String(lojaDoc._docId || lojaId);
      await gravarDocFirestoreAdmin(
        projectId,
        accessToken,
        `supermercados/${encodeURIComponent(lojaDocId)}`,
        {
          senha: '',
          senhaAdmin: '',
          senhaHash: hashShaFinal,
          senhaSalt: saltShaFinal,
          senhaAlgo: 'pbkdf2',
          senhaSaltPbkdf2: novoSaltPbkdf2,
          senhaHashPbkdf2: novoHashPbkdf2,
          senhaPbkdf2RefSalt: saltShaFinal,
          senha_revogada: false,
        }
      );

      const ip = getClientIp(req).replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeLojaLock = lojaId.replace(/[^a-zA-Z0-9._-]/g, '_');
      await gravarDocFirestoreAdmin(projectId, accessToken, `controle_login/${safeLojaLock}__${ip}`, {
        tentativas: 0,
        bloqueadoAte: 0,
        atualizadoEm: Date.now(),
      });

      const sessaoId = crypto.randomUUID();
      const customToken = criarCustomTokenFirebase(serviceAccount, `${lojaId}_admin`, {
        role: 'admin_loja',
        is_master: false,
        lojaId,
        sessaoId,
      });

      definirCookieHttpOnly(
        req,
        res,
        'em_usuario_auth',
        criarCookieUsuarioAuth(
          {
            uid: `${lojaId}_admin`,
            role: 'admin_loja',
            is_master: false,
            lojaId,
            operadorId: null,
          },
          hmacSecret
        )
      );

      return res.status(200).json({
        configurado: true,
        autenticado: true,
        customToken,
        firebaseProjectId: serviceAccount.project_id,
        sessaoId,
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        autenticado: false,
        erro: err?.message || 'Erro interno ao salvar nova senha.',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // D. Login de Operadores / Caixas / Supervisores no servidor (PBKDF2 + lockout)
  // ---------------------------------------------------------------------------
  if (acao === 'autenticar_operador') {
    const lojaId = String(body.lojaId || '').trim();
    const usuario = String(body.usuario || '').trim();
    const senha = String(body.senha || '').trim();
    if (!lojaId || !usuario || !senha) {
      return res.status(400).json({
        configurado: true,
        autenticado: false,
        erro: 'Informe lojaId, usuário e senha.',
      });
    }

    const cookies = parseCookies(req);
    const sessaoPainel = verificarCookieAssinado(cookies.em_painel_sessao, hmacSecret);
    if (sessaoPainel?.type === 'painel' && String(sessaoPainel.lojaId || '') !== lojaId) {
      return res.status(403).json({
        configurado: true,
        autenticado: false,
        erro: 'Link de acesso não corresponde a esta loja.',
      });
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const ip = getClientIp(req).replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeLojaLock = lojaId.replace(/[^a-zA-Z0-9._-]/g, '_');
      const lockoutPath = `controle_login/${safeLojaLock}__op__${ip}`;
      const lockDoc = (await lerDocFirestoreAdmin(projectId, accessToken, lockoutPath)) || {
        tentativas: 0,
        bloqueadoAte: 0,
      };

      const agora = Date.now();
      if (lockDoc.bloqueadoAte && Number(lockDoc.bloqueadoAte) > agora) {
        const seg = Math.ceil((Number(lockDoc.bloqueadoAte) - agora) / 1000);
        return res.status(429).json({
          configurado: true,
          autenticado: false,
          bloqueado: true,
          segundosRestantes: seg,
          erro: `Acesso bloqueado por segurança. Tente novamente em ${Math.ceil(seg / 60)} min.`,
        });
      }

      const lojaDoc = await lerDocFirestoreAdmin(
        projectId,
        accessToken,
        `supermercados/${encodeURIComponent(lojaId)}`
      );
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, autenticado: false, erro: 'Loja não encontrada.' });
      }
      if (lojaDoc.status === 'bloqueado') {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: `Acesso suspenso: o estabelecimento "${lojaDoc.nome || lojaId}" está temporariamente bloqueado.`,
        });
      }

      const opsLoja = await consultarColecaoPorCampoAdmin(
        projectId,
        accessToken,
        'operadores',
        'lojaId',
        lojaId
      );

      const userLower = usuario.toLowerCase();
      const userDigitos = usuario.replace(/\D/g, '');
      const opEncontrado = opsLoja.find((op) => {
        const opCpf = String(op.cpfOuUsuario || '').trim().toLowerCase();
        const opNome = String(op.nome || '').trim().toLowerCase();
        const opDigitos = String(op.cpfOuUsuario || '').replace(/\D/g, '');
        return (
          opCpf === userLower ||
          opNome === userLower ||
          (userDigitos.length >= 6 && opDigitos === userDigitos)
        );
      });

      if (opEncontrado && opEncontrado.ativo === false) {
        return res.status(403).json({
          configurado: true,
          autenticado: false,
          erro: `Acesso bloqueado: o funcionário "${opEncontrado.nome || usuario}" está inativo no cadastro da loja.`,
        });
      }

      const resSenha = opEncontrado
        ? verificarSenhaDocumento(opEncontrado, senha, pepper, opEncontrado.pinSenha || '')
        : { ok: false, precisaMigrarPbkdf2: false };

      if (!resSenha.ok) {
        const novasTentativas = Number(lockDoc.tentativas || 0) + 1;
        const bloqueadoAte =
          novasTentativas >= MAX_TENTATIVAS_LOCKOUT ? Date.now() + BLOQUEIO_MS : 0;
        await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
          tentativas: novasTentativas,
          bloqueadoAte,
          atualizadoEm: Date.now(),
        });
        return res.status(bloqueadoAte > 0 ? 429 : 401).json({
          configurado: true,
          autenticado: false,
          tentativas: novasTentativas,
          bloqueado: bloqueadoAte > 0,
          erro:
            bloqueadoAte > 0
              ? 'Limite de 5 tentativas excedido. Acesso bloqueado por 15 minutos.'
              : `Usuário ou senha inválidos (${novasTentativas}/${MAX_TENTATIVAS_LOCKOUT}).`,
        });
      }

      await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
        tentativas: 0,
        bloqueadoAte: 0,
        atualizadoEm: Date.now(),
      });

      const opDocId = String(opEncontrado._docId || opEncontrado.id);
      if (resSenha.precisaMigrarPbkdf2) {
        const novoSalt = crypto.randomBytes(16).toString('hex');
        await gravarDocFirestoreAdmin(
          projectId,
          accessToken,
          `operadores/${encodeURIComponent(opDocId)}`,
          {
            pinSenha: '',
            senhaAlgo: 'pbkdf2',
            senhaSaltPbkdf2: novoSalt,
            senhaHashPbkdf2: derivarPbkdf2(senha, novoSalt, pepper),
            senhaPbkdf2RefSalt: opEncontrado.senhaSalt || '',
          }
        );
      }

      const opId = String(opEncontrado.id || opDocId);
      const cargo = String(opEncontrado.cargo || 'Operador de Caixa');
      const role =
        cargo === 'Administrador' || cargo === 'Supervisor' ? 'gerente' : 'caixa';
      const sessaoId = crypto.randomUUID();
      const uid = `${lojaId}_op_${opId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);

      const customToken = criarCustomTokenFirebase(serviceAccount, uid, {
        role,
        is_master: false,
        lojaId,
        operadorId: opId,
        sessaoId,
      });

      definirCookieHttpOnly(
        req,
        res,
        'em_usuario_auth',
        criarCookieUsuarioAuth(
          {
            uid,
            role,
            is_master: false,
            lojaId,
            operadorId: opId,
          },
          hmacSecret
        )
      );

      return res.status(200).json({
        configurado: true,
        autenticado: true,
        customToken,
        firebaseProjectId: serviceAccount.project_id,
        sessaoId,
        operador: sanitizarOperadorParaCliente(opEncontrado),
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        autenticado: false,
        erro: err?.message || 'Erro interno ao autenticar operador.',
      });
    }
  }

  return res.status(403).json({
    configurado: true,
    erro: 'Ação de autenticação não autorizada. Utilize o login autenticado.',
  });
}
