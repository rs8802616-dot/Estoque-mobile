// Vercel Serverless Function / Express Handler: /api/auth
// - Emite Firebase Custom Token (JWT RS256) com Custom Claims (role, lojaId, sessaoId, is_master)
// - Valida credenciais no servidor com PBKDF2-SHA256 (210k iterações + pepper) e migra SHA-256 legado
// - Controla lockout de tentativas (5 falhas / 15 min) no Firestore via Service Account

import crypto from 'node:crypto';

const RATE_JANELA_MS = 60 * 1000;
const RATE_MAX = 25;
const MAX_TENTATIVAS_LOCKOUT = 5;
const BLOQUEIO_MS = 15 * 60 * 1000;
const PBKDF2_ITERACOES = 210000;
const SENHAS_PADRAO_FRACAS = new Set(['123', '1234', '123456', '12345678', 'mudar@123', 'mudar123', 'senha123']);
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
  return undefined;
}

function converterParaFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v === null) fields[k] = { nullValue: null };
    else if (typeof v === 'string') fields[k] = { stringValue: v };
    else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    else if (typeof v === 'number') {
      fields[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    }
  }
  return fields;
}

async function lerDocFirestoreAdmin(projectId, accessToken, caminho) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${caminho}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`Firestore GET ${resp.status}`);
  const data = await resp.json();
  const out = {};
  for (const [k, v] of Object.entries(data.fields || {})) {
    out[k] = extrairValorFirestore(v);
  }
  return out;
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

function parseCookies(req) {
  const raw = String(req.headers?.cookie || '');
  const out = {};
  raw.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

function criarCookieMasterAssinado(secretHmac) {
  const payload = base64Url(JSON.stringify({ role: 'master', exp: Date.now() + 12 * 60 * 60 * 1000 }));
  const sig = crypto.createHmac('sha256', secretHmac).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verificarCookieMasterAssinado(cookieVal, secretHmac) {
  if (!cookieVal || typeof cookieVal !== 'string' || !cookieVal.includes('.')) return false;
  const [payload, sig] = cookieVal.split('.');
  if (!payload || !sig) return false;
  const esperado = crypto.createHmac('sha256', secretHmac).update(payload).digest('base64url');
  if (!compararTempoConstante(sig, esperado)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return parsed?.role === 'master' && Number(parsed?.exp || 0) > Date.now();
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
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
  const acao = String(body.acao || 'emitir_sessao').trim();
  const masterSecret = String(
    process.env.MASTER_PORTAL_TOKEN || process.env.VITE_MASTER_PORTAL_TOKEN || ''
  ).trim();
  const hmacSecret = String(
    process.env.SENHA_PEPPER || masterSecret || 'estoque_master_hmac_v1'
  );

  if (acao === 'validar_master_token') {
    const tokenRecebido = String(body.token || '').trim();
    if (!masterSecret || !tokenRecebido || !compararTempoConstante(tokenRecebido, masterSecret)) {
      return res.status(401).json({ validado: false, erro: 'Token master inválido.' });
    }
    const cookieVal = criarCookieMasterAssinado(hmacSecret);
    const isHttps =
      String(req.headers['x-forwarded-proto'] || '').includes('https') ||
      Boolean(process.env.VERCEL);
    const flags = `HttpOnly; Path=/; Max-Age=43200; SameSite=Strict${isHttps ? '; Secure' : ''}`;
    res.setHeader('Set-Cookie', `em_master_sessao=${encodeURIComponent(cookieVal)}; ${flags}`);
    return res.status(200).json({ validado: true });
  }

  if (acao === 'checar_sessao_master') {
    const cookies = parseCookies(req);
    const ok = verificarCookieMasterAssinado(cookies.em_master_sessao, hmacSecret);
    return res.status(ok ? 200 : 401).json({ validado: ok });
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
    serviceAccount = JSON.parse(rawSa);
    if (!serviceAccount?.client_email || !serviceAccount?.private_key || !serviceAccount?.project_id) {
      throw new Error('Campos client_email/private_key/project_id ausentes');
    }
    serviceAccount.private_key = String(serviceAccount.private_key).replace(/\\n/g, '\n');
  } catch {
    return res.status(500).json({
      configurado: false,
      erro: 'FIREBASE_SERVICE_ACCOUNT_JSON inválido.',
    });
  }

  const pepper = String(process.env.SENHA_PEPPER || 'estoque_mobile_pepper_v1');

  // Fluxo completo com verificação de senha + lockout no servidor (para login de loja)
  if (acao === 'autenticar_loja') {
    const lojaId = String(body.lojaId || '').trim();
    const senha = String(body.senha || '');
    if (!lojaId || !senha) {
      return res.status(400).json({ configurado: true, erro: 'Informe lojaId e senha.' });
    }

    try {
      const accessToken = await obterAccessTokenAdmin(serviceAccount);
      const projectId = serviceAccount.project_id;
      const ip = getClientIp(req).replace(/[^a-zA-Z0-9._-]/g, '_');
      const lockoutPath = `controle_login/${lojaId}__${ip}`;
      const lockDoc = (await lerDocFirestoreAdmin(projectId, accessToken, lockoutPath)) || {
        tentativas: 0,
        bloqueadoAte: 0,
      };

      const agora = Date.now();
      if (lockDoc.bloqueadoAte && Number(lockDoc.bloqueadoAte) > agora) {
        const seg = Math.ceil((Number(lockDoc.bloqueadoAte) - agora) / 1000);
        return res.status(429).json({
          configurado: true,
          bloqueado: true,
          segundosRestantes: seg,
          erro: `Acesso bloqueado por segurança. Tente novamente em ${Math.ceil(seg / 60)} min.`,
        });
      }

      const lojaDoc = await lerDocFirestoreAdmin(projectId, accessToken, `supermercados/${lojaId}`);
      if (!lojaDoc) {
        return res.status(404).json({ configurado: true, erro: 'Loja não encontrada.' });
      }

      let senhaOk = false;
      let precisaMigrarPbkdf2 = false;

      const saltPbkdf2Atual = lojaDoc.senhaSaltPbkdf2 || lojaDoc.senhaSalt;
      if (lojaDoc.senhaAlgo === 'pbkdf2' && lojaDoc.senhaHashPbkdf2 && saltPbkdf2Atual) {
        senhaOk = compararTempoConstante(
          derivarPbkdf2(senha, saltPbkdf2Atual, pepper),
          lojaDoc.senhaHashPbkdf2
        );
      } else if (lojaDoc.senhaHash && lojaDoc.senhaSalt) {
        senhaOk = compararTempoConstante(sha256Legado(senha, lojaDoc.senhaSalt), lojaDoc.senhaHash);
        if (senhaOk) precisaMigrarPbkdf2 = true;
      } else if (lojaDoc.senha || lojaDoc.senhaAdmin) {
        senhaOk = compararTempoConstante(senha, String(lojaDoc.senha || lojaDoc.senhaAdmin));
        if (senhaOk) precisaMigrarPbkdf2 = true;
      }

      if (!senhaOk) {
        const novasTentativas = Number(lockDoc.tentativas || 0) + 1;
        const bloqueadoAte =
          novasTentativas >= MAX_TENTATIVAS_LOCKOUT ? Date.now() + BLOQUEIO_MS : 0;
        await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
          tentativas: novasTentativas,
          bloqueadoAte,
          atualizadoEm: Date.now(),
        });
        return res.status(401).json({
          configurado: true,
          tentativas: novasTentativas,
          bloqueado: bloqueadoAte > 0,
          erro:
            bloqueadoAte > 0
              ? 'Limite de 5 tentativas excedido. Acesso bloqueado por 15 minutos.'
              : `Senha incorreta (${novasTentativas}/${MAX_TENTATIVAS_LOCKOUT}).`,
        });
      }

      // Login válido: limpa lockout e migra hash legado para PBKDF2
      await gravarDocFirestoreAdmin(projectId, accessToken, lockoutPath, {
        tentativas: 0,
        bloqueadoAte: 0,
        atualizadoEm: Date.now(),
      });

      if (precisaMigrarPbkdf2) {
        const novoSalt = crypto.randomBytes(16).toString('hex');
        await gravarDocFirestoreAdmin(projectId, accessToken, `supermercados/${lojaId}`, {
          senhaAlgo: 'pbkdf2',
          senhaSaltPbkdf2: novoSalt,
          senhaHashPbkdf2: derivarPbkdf2(senha, novoSalt, pepper),
        });
      }

      const sessaoId = crypto.randomUUID();
      const customToken = criarCustomTokenFirebase(serviceAccount, `${lojaId}_admin`, {
        role: 'admin_loja',
        is_master: false,
        lojaId,
        sessaoId,
      });

      return res.status(200).json({
        configurado: true,
        autenticado: true,
        customToken,
        sessaoId,
        deveTrocarSenha: Boolean(lojaDoc.senha_revogada) || SENHAS_PADRAO_FRACAS.has(senha.toLowerCase()),
      });
    } catch (err) {
      return res.status(500).json({
        configurado: true,
        erro: err?.message || 'Erro interno ao autenticar loja.',
      });
    }
  }

  // Emissão padrão de Custom Token após autenticação
  const papel = String(body.papel || '').trim();
  const lojaId = body.lojaId ? String(body.lojaId).trim() : null;
  const usuarioId = String(body.usuarioId || 'operador').trim().slice(0, 80);

  const papeisPermitidos = new Set(['master', 'admin_loja', 'caixa', 'gerente', 'garcom', 'cozinha']);
  if (!papeisPermitidos.has(papel)) {
    return res.status(400).json({ configurado: true, erro: 'Papel de sessão inválido.' });
  }
  if (papel !== 'master' && !lojaId) {
    return res.status(400).json({ configurado: true, erro: 'lojaId obrigatório para usuário de loja.' });
  }

  if (papel === 'master' && process.env.VITE_MASTER_PORTAL_TOKEN) {
    const tokenMaster = String(body.masterToken || '').trim();
    if (tokenMaster && tokenMaster !== process.env.VITE_MASTER_PORTAL_TOKEN) {
      return res.status(401).json({ configurado: true, erro: 'Token master inválido.' });
    }
  }

  const sessaoId = crypto.randomUUID();
  const uid =
    papel === 'master'
      ? `master_${usuarioId}`
      : `${lojaId}_${usuarioId}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  const claims = {
    role: papel,
    is_master: papel === 'master',
    ...(lojaId ? { lojaId } : {}),
    sessaoId,
  };

  try {
    const customToken = criarCustomTokenFirebase(serviceAccount, uid, claims);
    return res.status(200).json({
      configurado: true,
      customToken,
      sessaoId,
      papel,
      lojaId,
    });
  } catch (err) {
    return res.status(500).json({
      configurado: true,
      erro: err?.message || 'Falha ao assinar Custom Token.',
    });
  }
}
