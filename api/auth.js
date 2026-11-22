// Vercel Serverless Function / Express Handler: /api/auth
// Emite Firebase Custom Token (JWT RS256) com Custom Claims (role, lojaId, sessaoId, is_master)
// usando exclusivamente process.env.FIREBASE_SERVICE_ACCOUNT_JSON, sem depender de pacotes extras.

import crypto from 'node:crypto';

const RATE_JANELA_MS = 60 * 1000;
const RATE_MAX = 25;
const tentativasIp = new Map();

function checarRateLimit(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local')
    .split(',')[0]
    .trim();
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
    if (!serviceAccount?.client_email || !serviceAccount?.private_key) {
      throw new Error('Campos client_email/private_key ausentes');
    }
  } catch {
    return res.status(500).json({
      configurado: false,
      erro: 'FIREBASE_SERVICE_ACCOUNT_JSON inválido.',
    });
  }

  const body = req.body || {};
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

  // Se papel == master e houver MASTER_API_SECRET configurado, exige conferência
  if (papel === 'master' && process.env.VITE_MASTER_PORTAL_TOKEN) {
    const tokenMaster = String(body.masterToken || '').trim();
    if (tokenMaster && tokenMaster !== process.env.VITE_MASTER_PORTAL_TOKEN) {
      return res.status(401).json({ configurado: true, erro: 'Token master inválido.' });
    }
  }

  const sessaoId = crypto.randomUUID();
  const uid = papel === 'master'
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
