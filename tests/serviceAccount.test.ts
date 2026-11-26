import test from 'node:test';
import assert from 'node:assert/strict';
import { parseServiceAccountEnv } from '../api/_serviceAccount.js';

const FAKE_SA = {
  type: 'service_account',
  project_id: 'adega-delivery-pdv',
  private_key_id: 'key_teste_123',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-teste@adega-delivery-pdv.iam.gserviceaccount.com',
  client_id: '1234567890',
};

function assertServiceAccountValida(parsed: ReturnType<typeof parseServiceAccountEnv>) {
  assert.equal(parsed.project_id, FAKE_SA.project_id);
  assert.equal(parsed.client_email, FAKE_SA.client_email);
  assert.ok(parsed.private_key.includes('-----BEGIN PRIVATE KEY-----'));
  assert.ok(parsed.private_key.includes('-----END PRIVATE KEY-----'));
  assert.ok(parsed.private_key.includes('\n'));
}

test('parseServiceAccountEnv aceita JSON válido minificado e indentado', () => {
  assertServiceAccountValida(parseServiceAccountEnv(JSON.stringify(FAKE_SA)));
  assertServiceAccountValida(parseServiceAccountEnv(JSON.stringify(FAKE_SA, null, 2)));
});

test('parseServiceAccountEnv repara quebras de linha literais dentro de private_key', () => {
  const pretty = JSON.stringify(FAKE_SA, null, 2);
  const comNewlineLiteral = pretty.replace(
    '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC\\n-----END PRIVATE KEY-----\\n',
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC\n-----END PRIVATE KEY-----\n'
  );
  assertServiceAccountValida(parseServiceAccountEnv(comNewlineLiteral));
});

test('parseServiceAccountEnv recupera JSON colado sem chave de abertura { (erro posição 6)', () => {
  const indentado = JSON.stringify(FAKE_SA, null, 2);
  const semChaveAbertura = indentado.replace(/^\{\s*/, '');
  assertServiceAccountValida(parseServiceAccountEnv(semChaveAbertura));
});

test('parseServiceAccountEnv recupera JSON colado sem { e sem } com vírgula final sobrando', () => {
  const indentado = JSON.stringify(FAKE_SA, null, 2);
  const semChavesComVirgula = indentado.replace(/^\{\s*/, '').replace(/\s*\}$/, ',');
  assertServiceAccountValida(parseServiceAccountEnv(semChavesComVirgula));
});

test('parseServiceAccountEnv aceita JSON envolvido em aspas simples ou aspas duplas externas sem escape', () => {
  const jsonMin = JSON.stringify(FAKE_SA);
  assertServiceAccountValida(parseServiceAccountEnv(`'${jsonMin}'`));
  assertServiceAccountValida(parseServiceAccountEnv(`"${jsonMin}"`));
});

test('parseServiceAccountEnv desembrulha JSON serializado duas vezes', () => {
  const duplo = JSON.stringify(JSON.stringify(FAKE_SA));
  assertServiceAccountValida(parseServiceAccountEnv(duplo));
});

test('parseServiceAccountEnv decodifica JSON em Base64', () => {
  const b64 = Buffer.from(JSON.stringify(FAKE_SA), 'utf8').toString('base64');
  assertServiceAccountValida(parseServiceAccountEnv(b64));
});

test('parseServiceAccountEnv remove cerca markdown e prefixo FIREBASE_SERVICE_ACCOUNT_JSON=', () => {
  const comCerca = '```json\n' + JSON.stringify(FAKE_SA, null, 2) + '\n```';
  assertServiceAccountValida(parseServiceAccountEnv(comCerca));

  const comPrefixo = `FIREBASE_SERVICE_ACCOUNT_JSON='${JSON.stringify(FAKE_SA)}'`;
  assertServiceAccountValida(parseServiceAccountEnv(comPrefixo));
});

test('parseServiceAccountEnv recupera conteúdo com aspas escapadas sem aspas externas', () => {
  const semChavesEscapado = JSON.stringify(FAKE_SA)
    .slice(1, -1)
    .replace(/"/g, '\\"');
  assertServiceAccountValida(parseServiceAccountEnv(semChavesEscapado));
});

test('parseServiceAccountEnv reporta campos ausentes e tamanho em entrada truncada sem vazar segredos', () => {
  const segredoFicticio = '"type": "service_account",';
  assert.throws(
    () => parseServiceAccountEnv(segredoFicticio),
    (err: any) => {
      const msg = String(err?.message || err);
      assert.match(msg, /Campos obrigatórios ausentes/);
      assert.match(msg, /tamanho=26/);
      assert.ok(!msg.includes('PRIVATE KEY-----'));
      return true;
    }
  );
});

test('parseServiceAccountEnv recupera JSON duplicado com primeiro bloco sem { (diagnóstico real)', () => {
  const indentado = JSON.stringify(FAKE_SA, null, 2);
  const primeiroSemChave = indentado.replace(/^\{\s*/, '');
  const duplicado = `${primeiroSemChave}\n${indentado}`;
  assertServiceAccountValida(parseServiceAccountEnv(duplicado));
});

test('parseServiceAccountEnv recupera JSON duplicado com ambos os blocos sem {', () => {
  const indentado = JSON.stringify(FAKE_SA, null, 2);
  const semChave = indentado.replace(/^\{\s*/, '');
  const duplicado = `${semChave}\n${semChave}`;
  assertServiceAccountValida(parseServiceAccountEnv(duplicado));
});

test('parseServiceAccountEnv recupera JSON com aspa dupla inicial solta antes de { (simples e duplicado)', () => {
  const indentado = JSON.stringify(FAKE_SA, null, 2);
  const comAspaSolta = `"${indentado}`;
  assertServiceAccountValida(parseServiceAccountEnv(comAspaSolta));

  const duplicadoComAspaSolta = `"${indentado}\n${indentado}`;
  assertServiceAccountValida(parseServiceAccountEnv(duplicadoComAspaSolta));
});

test('parseServiceAccountEnv prioriza projeto adega-delivery-pdv quando dois projetos são colados juntos', () => {
  const outroProjeto = {
    ...FAKE_SA,
    project_id: 'outro-projeto-antigo',
    client_email: 'firebase-adminsdk@outro-projeto-antigo.iam.gserviceaccount.com',
  };
  const ordemInvertida = `${JSON.stringify(FAKE_SA, null, 2)}\n${JSON.stringify(outroProjeto, null, 2)}`;
  const res = parseServiceAccountEnv(ordemInvertida);
  assertServiceAccountValida(res);
});

test('parseServiceAccountEnv recupera segundo JSON colado no meio do primeiro JSON sem misturar campos', () => {
  const corpoPrimeiro = JSON.stringify(
    {
      type: 'service_account',
      project_id: 'outro-projeto-antigo',
      client_email: 'errado@outro-projeto-antigo.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\nOUTRACHAVEERRADA\n-----END PRIVATE KEY-----\n',
    },
    null,
    2
  );
  const pontoInsercao = corpoPrimeiro.indexOf('"client_email"');
  const contaminado =
    corpoPrimeiro.slice(0, pontoInsercao) +
    JSON.stringify(FAKE_SA, null, 2) +
    '\n  ' +
    corpoPrimeiro.slice(pontoInsercao);
  const res = parseServiceAccountEnv(contaminado);
  assertServiceAccountValida(res);
});
