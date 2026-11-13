import test from 'node:test';
import assert from 'node:assert/strict';
import {
  criarHashComSalt,
  verificarSenhaComHash,
  validarPoliticaSenha,
} from '../src/utils/security';
import { localizarMelhorLoteEstoque } from '../src/lib/balancaUtils';
import type { ItemEstoque } from '../src/types';

test('criarHashComSalt e verificarSenhaComHash validam senha correta e rejeitam incorreta', async () => {
  const { senhaHash, senhaSalt } = await criarHashComSalt('MinhaSenha@2026');
  assert.ok(senhaHash.length > 0);
  assert.ok(senhaSalt.length > 0);

  const ok = await verificarSenhaComHash('MinhaSenha@2026', senhaHash, senhaSalt);
  assert.equal(ok, true);

  const errado = await verificarSenhaComHash('123456', senhaHash, senhaSalt);
  assert.equal(errado, false);

  const vazio = await verificarSenhaComHash('', senhaHash, senhaSalt);
  assert.equal(vazio, false);
});

test('validarPoliticaSenha exige mínimo 6 caracteres e confirmação igual', () => {
  const curta = validarPoliticaSenha('12345', '12345');
  assert.equal(curta.valida, false);

  const diferente = validarPoliticaSenha('abcdef', 'abcdeg');
  assert.equal(diferente.valida, false);

  const valida = validarPoliticaSenha('abc123', 'abc123');
  assert.equal(valida.valida, true);
});

test('localizarMelhorLoteEstoque casa EAN com/sem zero à esquerda e prioriza lote com saldo FIFO', () => {
  const estoque: ItemEstoque[] = [
    {
      lote: 'lote_zerado',
      lojaId: 'loja_1',
      codigo: '7894900011517',
      nome: 'Coca-Cola 2Lt',
      categoria: 'Bebidas',
      quantidade: 0,
      preco_custo: 6,
      preco_venda: 10,
      validade: '2026-12-01',
    },
    {
      lote: 'lote_mais_longe',
      lojaId: 'loja_1',
      codigo: '7894900011517',
      nome: 'Coca-Cola 2Lt',
      categoria: 'Bebidas',
      quantidade: 12,
      preco_custo: 6,
      preco_venda: 10,
      validade: '2027-06-01',
    },
    {
      lote: 'lote_fifo',
      lojaId: 'loja_1',
      codigo: '7894900011517',
      nome: 'Coca-Cola 2Lt',
      categoria: 'Bebidas',
      quantidade: 5,
      preco_custo: 6,
      preco_venda: 10,
      validade: '2027-01-15',
    },
  ];

  const encontrado = localizarMelhorLoteEstoque('07894900011517', estoque);
  assert.equal(encontrado?.lote, 'lote_fifo');
});
