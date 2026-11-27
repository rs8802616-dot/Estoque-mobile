import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/auth.js';

const TEST_MASTER_TOKEN = 'token_master_teste_seguranca';
const TEST_MASTER_USER = 'admin_master_teste';
const TEST_MASTER_PASS = 'SenhaMasterForte#2026';
const TEST_PEPPER = 'pepper_teste_auth_security';

const envOriginal = {
  MASTER_PORTAL_TOKEN: process.env.MASTER_PORTAL_TOKEN,
  MASTER_ADMIN_USER: process.env.MASTER_ADMIN_USER,
  MASTER_ADMIN_PASS: process.env.MASTER_ADMIN_PASS,
  SENHA_PEPPER: process.env.SENHA_PEPPER,
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
};

before(() => {
  process.env.MASTER_PORTAL_TOKEN = TEST_MASTER_TOKEN;
  process.env.MASTER_ADMIN_USER = TEST_MASTER_USER;
  process.env.MASTER_ADMIN_PASS = TEST_MASTER_PASS;
  process.env.SENHA_PEPPER = TEST_PEPPER;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
});

after(() => {
  const restaurar = (chave: keyof typeof envOriginal) => {
    const val = envOriginal[chave];
    if (val === undefined) {
      delete process.env[chave];
    } else {
      process.env[chave] = val;
    }
  };
  restaurar('MASTER_PORTAL_TOKEN');
  restaurar('MASTER_ADMIN_USER');
  restaurar('MASTER_ADMIN_PASS');
  restaurar('SENHA_PEPPER');
  restaurar('FIREBASE_SERVICE_ACCOUNT_JSON');
});

async function invocarAuth(
  body: Record<string, unknown>,
  opcoes: { ip: string; cookie?: string; method?: string }
) {
  const headers: Record<string, string | string[]> = {};
  const req = {
    method: opcoes.method || 'POST',
    headers: {
      'x-forwarded-for': opcoes.ip,
      ...(opcoes.cookie ? { cookie: opcoes.cookie } : {}),
    },
    socket: { remoteAddress: opcoes.ip },
    body,
  };

  let statusCode = 200;
  let jsonBody: Record<string, unknown> = {};

  const res = {
    setHeader(k: string, v: string | string[]) {
      headers[k] = v;
    },
    getHeader(k: string) {
      return headers[k];
    },
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: Record<string, unknown>) {
      jsonBody = payload;
      return this;
    },
    end() {
      return this;
    },
  };

  await handler(req as any, res as any);
  return { statusCode, headers, body: jsonBody };
}

async function obterCookieMaster(ip: string): Promise<string> {
  const resp = await invocarAuth(
    { acao: 'validar_master_token', token: TEST_MASTER_TOKEN },
    { ip }
  );
  assert.equal(resp.statusCode, 200);
  const setCookie = resp.headers['Set-Cookie'];
  const lista = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const par = lista.find((c) => c.startsWith('em_master_sessao='));
  assert.ok(par, 'Cookie em_master_sessao deve ser emitido');
  return par.split(';')[0];
}

test('autenticar_master bloqueia na 5a ate a 8a tentativa e nunca retorna configurado: false', async () => {
  const ip = '203.0.113.10';
  const cookie = await obterCookieMaster(ip);

  for (let i = 1; i <= 4; i++) {
    const res = await invocarAuth(
      { acao: 'autenticar_master', usuario: 'errado', senha: 'errada' },
      { ip, cookie }
    );
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.configurado, true);
    assert.equal(res.body.autenticado, false);
    assert.equal(res.body.bloqueado, false);
    assert.equal(res.body.tentativas, i);
  }

  for (let i = 5; i <= 8; i++) {
    const res = await invocarAuth(
      {
        acao: 'autenticar_master',
        usuario: i === 8 ? TEST_MASTER_USER : 'errado',
        senha: i === 8 ? TEST_MASTER_PASS : 'errada',
      },
      { ip, cookie }
    );
    assert.equal(res.statusCode, 429);
    assert.equal(res.body.configurado, true);
    assert.equal(res.body.autenticado, false);
    assert.equal(res.body.bloqueado, true);
    assert.ok(Number(res.body.segundosRestantes) > 0);
  }
});

test('rate limit global retorna 429 com configurado: true e bloqueado: true', async () => {
  const ip = '203.0.113.11';

  for (let i = 1; i <= 25; i++) {
    await invocarAuth({ acao: 'checar_sessao_master' }, { ip });
  }

  const excedido = await invocarAuth(
    { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
    { ip }
  );
  assert.equal(excedido.statusCode, 429);
  assert.equal(excedido.body.configurado, true);
  assert.equal(excedido.body.autenticado, false);
  assert.equal(excedido.body.bloqueado, true);
  assert.ok(Number(excedido.body.segundosRestantes) > 0);
});

test('lockout isola IPs diferentes e zera contador apos login Master valido', async () => {
  const ipBloqueado = '203.0.113.12';
  const ipLivre = '203.0.113.13';

  const cookieBloqueado = await obterCookieMaster(ipBloqueado);
  for (let i = 0; i < 5; i++) {
    await invocarAuth(
      { acao: 'autenticar_master', usuario: 'x', senha: 'y' },
      { ip: ipBloqueado, cookie: cookieBloqueado }
    );
  }
  const checkBloqueado = await invocarAuth(
    { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
    { ip: ipBloqueado, cookie: cookieBloqueado }
  );
  assert.equal(checkBloqueado.statusCode, 429);
  assert.equal(checkBloqueado.body.bloqueado, true);

  const cookieLivre = await obterCookieMaster(ipLivre);
  const f1 = await invocarAuth(
    { acao: 'autenticar_master', usuario: 'err', senha: 'err' },
    { ip: ipLivre, cookie: cookieLivre }
  );
  assert.equal(f1.statusCode, 401);
  assert.equal(f1.body.tentativas, 1);

  const f2 = await invocarAuth(
    { acao: 'autenticar_master', usuario: 'err', senha: 'err' },
    { ip: ipLivre, cookie: cookieLivre }
  );
  assert.equal(f2.statusCode, 401);
  assert.equal(f2.body.tentativas, 2);

  const ok = await invocarAuth(
    { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
    { ip: ipLivre, cookie: cookieLivre }
  );
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.body.configurado, true);
  assert.equal(ok.body.autenticado, true);

  const novaFalhaAposSucesso = await invocarAuth(
    { acao: 'autenticar_master', usuario: 'err', senha: 'err' },
    { ip: ipLivre, cookie: cookieLivre }
  );
  assert.equal(novaFalhaAposSucesso.statusCode, 401);
  assert.equal(novaFalhaAposSucesso.body.tentativas, 1);
});

test('autenticar_master sem cookie retorna 401 com configurado: true', async () => {
  const res = await invocarAuth(
    { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
    { ip: '203.0.113.14' }
  );
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.configurado, true);
  assert.equal(res.body.autenticado, false);
});

test('lockout de 15 minutos reseta contador automaticamente ao expirar', async () => {
  const realNow = Date.now;
  let tempoFake = realNow();
  Date.now = () => tempoFake;

  try {
    const ip = '203.0.113.15';
    const cookie = await obterCookieMaster(ip);

    for (let i = 1; i <= 4; i++) {
      const r = await invocarAuth(
        { acao: 'autenticar_master', usuario: 'x', senha: 'y' },
        { ip, cookie }
      );
      assert.equal(r.statusCode, 401);
    }

    const r5 = await invocarAuth(
      { acao: 'autenticar_master', usuario: 'x', senha: 'y' },
      { ip, cookie }
    );
    assert.equal(r5.statusCode, 429);
    assert.equal(r5.body.bloqueado, true);

    // Avanca 15 min + 2s para expirar o bloqueio
    tempoFake += 15 * 60 * 1000 + 2000;

    const aposExpirarFalha = await invocarAuth(
      { acao: 'autenticar_master', usuario: 'x', senha: 'y' },
      { ip, cookie }
    );
    assert.equal(aposExpirarFalha.statusCode, 401);
    assert.equal(aposExpirarFalha.body.bloqueado, false);
    assert.equal(aposExpirarFalha.body.tentativas, 1);

    const valido = await invocarAuth(
      { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
      { ip, cookie }
    );
    assert.equal(valido.statusCode, 200);
    assert.equal(valido.body.autenticado, true);
  } finally {
    Date.now = realNow;
  }
});

test('metodo HTTP diferente de POST retorna 405 com configurado: true', async () => {
  const res = await invocarAuth({}, { ip: '203.0.113.16', method: 'GET' });
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.configurado, true);
  assert.equal(res.body.autenticado, false);
});

test('FIREBASE_SERVICE_ACCOUNT_JSON invalido retorna 500 com configurado: true', async () => {
  const anterior = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON = '{"invalido"';
  try {
    const res = await invocarAuth(
      { acao: 'autenticar_loja', lojaId: 'loja_teste', senha: '123' },
      { ip: '203.0.113.17' }
    );
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.configurado, true);
    assert.equal(res.body.autenticado, false);
  } finally {
    if (anterior === undefined) {
      delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    } else {
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON = anterior;
    }
  }
});

test('checar_sessao_usuario rejeita ausencia de cookie e cookie adulterado com 401', async () => {
  const semCookie = await invocarAuth({ acao: 'checar_sessao_usuario' }, { ip: '203.0.113.18' });
  assert.equal(semCookie.statusCode, 401);
  assert.equal(semCookie.body.configurado, true);
  assert.equal(semCookie.body.autenticado, false);

  const adulterado = await invocarAuth(
    { acao: 'checar_sessao_usuario' },
    { ip: '203.0.113.19', cookie: 'em_usuario_auth=payload_falso.assinatura_invalida' }
  );
  assert.equal(adulterado.statusCode, 401);
  assert.equal(adulterado.body.configurado, true);
  assert.equal(adulterado.body.autenticado, false);
});

test('checar_sessao_usuario valida cookie apos login Master e logout_sessao expira em_usuario_auth', async () => {
  const ip = '203.0.113.20';
  const cookieMaster = await obterCookieMaster(ip);

  const loginRes = await invocarAuth(
    { acao: 'autenticar_master', usuario: TEST_MASTER_USER, senha: TEST_MASTER_PASS },
    { ip, cookie: cookieMaster }
  );
  assert.equal(loginRes.statusCode, 200);
  assert.equal(loginRes.body.autenticado, true);

  const setCookie = loginRes.headers['Set-Cookie'];
  const listaCookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const parUsuario = listaCookies.find((c) => c.startsWith('em_usuario_auth='));
  assert.ok(parUsuario, 'Cookie em_usuario_auth deve ser emitido apos login valido');
  const cookieUsuario = parUsuario.split(';')[0];

  const sessaoRes = await invocarAuth(
    { acao: 'checar_sessao_usuario' },
    { ip, cookie: cookieUsuario }
  );
  assert.equal(sessaoRes.statusCode, 200);
  assert.equal(sessaoRes.body.configurado, true);
  assert.equal(sessaoRes.body.autenticado, true);
  assert.equal(sessaoRes.body.role, 'master');
  assert.equal(sessaoRes.body.is_master, true);
  assert.equal(sessaoRes.body.lojaId, null);
  assert.equal(sessaoRes.body.uid, `master_${TEST_MASTER_USER}`);

  const logoutRes = await invocarAuth(
    { acao: 'logout_sessao' },
    { ip, cookie: cookieUsuario }
  );
  assert.equal(logoutRes.statusCode, 200);
  const logoutCookies = Array.isArray(logoutRes.headers['Set-Cookie'])
    ? logoutRes.headers['Set-Cookie']
    : logoutRes.headers['Set-Cookie']
      ? [logoutRes.headers['Set-Cookie']]
      : [];
  const expirado = logoutCookies.find((c) => c.startsWith('em_usuario_auth=;'));
  assert.ok(expirado && expirado.includes('Max-Age=0'), 'logout_sessao deve expirar em_usuario_auth');
});
