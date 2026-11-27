import test from 'node:test';
import assert from 'node:assert/strict';
import {
  criarDetectorBipHardware,
  isCodigoBarrasNumerico,
  removerSufixoBipado,
} from '../src/utils/barcodeScanner';

test('detector reconhece bip rapido de leitor USB/Bluetooth com Enter e preserva target/preValue', () => {
  const detector = criarDetectorBipHardware();
  const codigo = '7891991000832';
  let t = 1000;

  for (const ch of codigo) {
    const r = detector.processarTecla({
      key: ch,
      now: t,
      targetId: 'cad-nome',
      targetValue: 'Cerveja Heineken',
    });
    assert.equal(r.disparou, false);
    t += 15;
  }

  const fim = detector.processarTecla({
    key: 'Enter',
    now: t,
    targetId: 'cad-nome',
    targetValue: 'Cerveja Heineken7891991000832',
  });
  assert.equal(fim.disparou, true);
  if (fim.disparou) {
    assert.equal(fim.codigo, codigo);
    assert.equal(fim.targetId, 'cad-nome');
    assert.equal(fim.preValue, 'Cerveja Heineken');
  }
});

test('detector ignora digitacao humana lenta seguida de Enter', () => {
  const detector = criarDetectorBipHardware();
  const texto = '7891000379585';
  let t = 5000;

  for (const ch of texto) {
    const r = detector.processarTecla({
      key: ch,
      now: t,
      targetId: 'cad-cod',
      targetValue: '',
    });
    assert.equal(r.disparou, false);
    t += 150;
  }

  const fim = detector.processarTecla({
    key: 'Enter',
    now: t,
    targetId: 'cad-cod',
    targetValue: texto,
  });
  assert.equal(fim.disparou, false);
});

test('detector preserva burst quando tecla modificadora Shift ocorre no meio de codigo alfanumerico', () => {
  const detector = criarDetectorBipHardware();
  const sequencia = ['A', 'Shift', 'B', 'C', '-', '1', '2', '3'];
  let t = 2000;

  for (const k of sequencia) {
    const r = detector.processarTecla({
      key: k,
      now: t,
      targetId: 'cad-lote',
      targetValue: '',
    });
    assert.equal(r.disparou, false);
    t += 12;
  }

  const fim = detector.processarTecla({
    key: 'Enter',
    now: t,
    targetId: 'cad-lote',
    targetValue: 'ABC-123',
  });
  assert.equal(fim.disparou, true);
  if (fim.disparou) {
    assert.equal(fim.codigo, 'ABC-123');
    assert.equal(fim.targetId, 'cad-lote');
  }
});

test('detector ignora atalhos com Ctrl/Alt/Meta (ex: Ctrl+V)', () => {
  const detector = criarDetectorBipHardware();
  let t = 3000;

  detector.processarTecla({ key: '7', now: t, targetId: 'cad-nome', targetValue: 'Prod' });
  t += 10;
  const ctrlV = detector.processarTecla({
    key: 'v',
    ctrlKey: true,
    now: t,
    targetId: 'cad-nome',
    targetValue: 'Prod7',
  });
  assert.equal(ctrlV.disparou, false);

  t += 10;
  const enter = detector.processarTecla({
    key: 'Enter',
    now: t,
    targetId: 'cad-nome',
    targetValue: 'Prod7',
  });
  assert.equal(enter.disparou, false);
});

test('detector aceita Tab como terminador no cadastro para EAN >= 6 digitos e rejeita fora dele ou texto curto', () => {
  const detector = criarDetectorBipHardware();
  let t = 4000;
  const codigo = '7891149103223';

  for (const ch of codigo) {
    detector.processarTecla({
      key: ch,
      now: t,
      targetId: 'cad-cod',
      targetValue: '',
      aceitarTab: true,
    });
    t += 15;
  }
  const okTab = detector.processarTecla({
    key: 'Tab',
    now: t,
    targetId: 'cad-cod',
    targetValue: codigo,
    aceitarTab: true,
  });
  assert.equal(okTab.disparou, true);
  if (okTab.disparou) {
    assert.equal(okTab.codigo, codigo);
  }

  // Fora do cadastro (aceitarTab = false) nao dispara no Tab
  t += 500;
  for (const ch of codigo) {
    detector.processarTecla({ key: ch, now: t, aceitarTab: false });
    t += 15;
  }
  const semTab = detector.processarTecla({ key: 'Tab', now: t, aceitarTab: false });
  assert.equal(semTab.disparou, false);

  // Texto curto / nao-numerico com aceitarTab = true tambem nao dispara
  t += 500;
  for (const ch of 'abc1') {
    detector.processarTecla({ key: ch, now: t, aceitarTab: true });
    t += 15;
  }
  const curtoTab = detector.processarTecla({ key: 'Tab', now: t, aceitarTab: true });
  assert.equal(curtoTab.disparou, false);
});

test('removerSufixoBipado limpa poluicao em cad-nome, cad-preco e fallback sem preValue', () => {
  assert.equal(
    removerSufixoBipado('Heineken 330ml7891991000832', '7891991000832', 'Heineken 330ml'),
    'Heineken 330ml'
  );
  assert.equal(
    removerSufixoBipado('8.907891991000832', '7891991000832', '8.90'),
    '8.90'
  );
  assert.equal(
    removerSufixoBipado('123456', '00123456', ''),
    ''
  );
  assert.equal(
    removerSufixoBipado('ProdutoTeste7891991000832', '7891991000832'),
    'ProdutoTeste'
  );
});

test('isCodigoBarrasNumerico diferencia EAN/GTIN de codigos internos', () => {
  assert.equal(isCodigoBarrasNumerico('7891991000832'), true);
  assert.equal(isCodigoBarrasNumerico('78910003'), true);
  assert.equal(isCodigoBarrasNumerico('07891991000832'), true);
  assert.equal(isCodigoBarrasNumerico('ESP-01'), false);
  assert.equal(isCodigoBarrasNumerico('DOS-10'), false);
  assert.equal(isCodigoBarrasNumerico('12345'), false);
  assert.equal(isCodigoBarrasNumerico('ABC12345678'), false);
});
