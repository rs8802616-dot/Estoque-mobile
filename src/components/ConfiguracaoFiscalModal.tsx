import React, { useEffect, useMemo, useState } from 'react';
import { ConfigFiscalLoja, Supermercado } from '../types';
import { testarConexaoFocusNfe, validarProntidaoFiscal } from '../lib/focusNfeService';

interface ConfiguracaoFiscalModalProps {
  visivel: boolean;
  onFechar: () => void;
  loja: Supermercado | null;
  onSalvarConfigFiscal: (config: ConfigFiscalLoja, cnpjAtualizado?: string) => Promise<void> | void;
}

const UFS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

const CONFIG_INICIAL: ConfigFiscalLoja = {
  habilitado: false,
  ambiente: 'homologacao',
  tokenFocusNfe: '',
  razaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  regimeTributario: '1',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  codigoMunicipioIbge: '',
  uf: 'SP',
  serieNfce: 1,
  proximoNumeroNfce: 1,
  idCsc: '000001',
  codigoCsc: '',
  emitirAutomaticoNoPdv: false,
  ncmPadrao: '22021000',
  cfopPadrao: '5405',
  csosnPadrao: '500',
  unidadePadrao: 'UN',
  certificadoA1ConfiguradoNaFocus: false,
};

export const ConfiguracaoFiscalModal: React.FC<ConfiguracaoFiscalModalProps> = ({
  visivel,
  onFechar,
  loja,
  onSalvarConfigFiscal,
}) => {
  const [form, setForm] = useState<ConfigFiscalLoja>(CONFIG_INICIAL);
  const [cnpjEditavel, setCnpjEditavel] = useState<string>('');
  const [mostrarToken, setMostrarToken] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [testandoConexao, setTestandoConexao] = useState<boolean>(false);
  const [resultadoTeste, setResultadoTeste] = useState<{ tipo: 'ok' | 'aviso' | 'erro'; texto: string } | null>(null);

  useEffect(() => {
    if (visivel && loja) {
      const cfg = loja.configFiscal;
      setForm({
        ...CONFIG_INICIAL,
        ...cfg,
        razaoSocial: cfg?.razaoSocial || loja.nome || '',
        nomeFantasia: cfg?.nomeFantasia || loja.nome || '',
        logradouro: cfg?.logradouro || loja.endereco || '',
        municipio: cfg?.municipio || loja.cidade || '',
      });
      setCnpjEditavel(loja.cnpj || '');
      setResultadoTeste(null);
    }
  }, [visivel, loja]);

  const prontidao = useMemo(() => {
    if (!loja) return { pronto: false, habilitado: false, pendencias: [] as string[] };
    return validarProntidaoFiscal({
      ...loja,
      cnpj: cnpjEditavel,
      configFiscal: form,
    });
  }, [loja, cnpjEditavel, form]);

  if (!visivel || !loja) return null;

  const atualizarCampo = <K extends keyof ConfigFiscalLoja>(campo: K, valor: ConfigFiscalLoja[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleTestarConexao = async () => {
    setTestandoConexao(true);
    setResultadoTeste(null);
    try {
      const res = await testarConexaoFocusNfe(cnpjEditavel, form);
      if (res.sucesso && res.aviso) {
        setResultadoTeste({ tipo: 'aviso', texto: res.aviso });
      } else if (res.sucesso) {
        setResultadoTeste({ tipo: 'ok', texto: res.mensagem || 'Conexão validada com sucesso na Focus NFe!' });
      } else {
        setResultadoTeste({ tipo: 'erro', texto: res.erro || 'Não foi possível validar o token na Focus NFe.' });
      }
    } catch (err: any) {
      setResultadoTeste({
        tipo: 'erro',
        texto: err?.message || 'Erro de comunicação com a rota /api/nfce.',
      });
    } finally {
      setTestandoConexao(false);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSalvarConfigFiscal(form, cnpjEditavel);
      onFechar();
    } finally {
      setSalvando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 11px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '0.86rem',
    fontWeight: 500,
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '4px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 100100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 10px 44px 10px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: 'calc(100dvh - 54px)',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* CABEÇALHO */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧾</span>
              <span>Configuração Fiscal (NFC-e / Focus NFe)</span>
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              Loja ativa: <b style={{ color: '#ffffff' }}>{loja.nome}</b> • Emissão direta no ato da venda
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* FORMULÁRIO COM SCROLL */}
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* STATUS DE PRONTIDÃO FISCAL */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: prontidao.pronto ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${prontidao.pronto ? '#6ee7b7' : '#fcd34d'}`,
                color: prontidao.pronto ? '#065f46' : '#92400e',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>
                {prontidao.pronto
                  ? `✅ Tudo pronto para emitir NFC-e (${form.ambiente === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO / TESTES'})!`
                  : form.habilitado
                    ? '⚠️ Faltam alguns dados para concluir a habilitação fiscal:'
                    : 'ℹ️ Emissão Fiscal (NFC-e) ainda está desativada para esta loja.'}
              </div>
              {prontidao.pendencias.length > 0 && (
                <div style={{ fontSize: '0.77rem', lineHeight: 1.45 }}>
                  Pendências: <b>{prontidao.pendencias.join(' • ')}</b>
                </div>
              )}
              <div style={{ marginTop: '6px', fontSize: '0.74rem', opacity: 0.9 }}>
                💡 No painel da <b>Focus NFe</b>, lembre-se de subir o <b>Certificado Digital A1</b> da loja e ativar a emissão de <b>NFC-e</b>.
              </div>
            </div>

            {/* ATIVAÇÃO E AMBIENTE */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  <input
                    type="checkbox"
                    checked={form.habilitado}
                    onChange={(e) => atualizarCampo('habilitado', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  <span>Habilitar emissão de Cupom Fiscal (NFC-e) no PDV</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(form.emitirAutomaticoNoPdv)}
                    onChange={(e) => atualizarCampo('emitirAutomaticoNoPdv', e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                  />
                  <span>Marcar "Emitir NFC-e" automaticamente no caixa</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Ambiente da Focus NFe:</label>
                  <select
                    value={form.ambiente}
                    onChange={(e) => atualizarCampo('ambiente', e.target.value as 'homologacao' | 'producao')}
                    style={{
                      ...inputStyle,
                      fontWeight: 700,
                      backgroundColor: form.ambiente === 'producao' ? '#ecfdf5' : '#fffbeb',
                      color: form.ambiente === 'producao' ? '#065f46' : '#92400e',
                    }}
                  >
                    <option value="homologacao">🟡 Homologação (Testes sem validade fiscal)</option>
                    <option value="producao">🟢 Produção (Validade fiscal real na SEFAZ)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Token da API Focus NFe (da Loja ou Revenda):</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type={mostrarToken ? 'text' : 'password'}
                      value={form.tokenFocusNfe || ''}
                      onChange={(e) => atualizarCampo('tokenFocusNfe', e.target.value)}
                      placeholder="Cole o token da Focus NFe..."
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarToken((v) => !v)}
                      style={{
                        padding: '0 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#f1f5f9',
                        cursor: 'pointer',
                      }}
                      title={mostrarToken ? 'Ocultar token' : 'Mostrar token'}
                    >
                      {mostrarToken ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleTestarConexao}
                  disabled={testandoConexao}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #0284c7',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: testandoConexao ? 'wait' : 'pointer',
                  }}
                >
                  {testandoConexao ? '⏳ Testando na Focus NFe...' : '🔌 Testar Conexão Focus NFe'}
                </button>
                {resultadoTeste && (
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color:
                        resultadoTeste.tipo === 'ok'
                          ? '#047857'
                          : resultadoTeste.tipo === 'aviso'
                            ? '#b45309'
                            : '#dc2626',
                    }}
                  >
                    {resultadoTeste.texto}
                  </span>
                )}
              </div>
            </div>

            {/* DADOS DO EMITENTE */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                🏢 Dados Fiscais da Loja / Adega (Emitente)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>CNPJ:</label>
                  <input
                    type="text"
                    value={cnpjEditavel}
                    onChange={(e) => setCnpjEditavel(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Inscrição Estadual (IE):</label>
                  <input
                    type="text"
                    value={form.inscricaoEstadual || ''}
                    onChange={(e) => atualizarCampo('inscricaoEstadual', e.target.value)}
                    placeholder="Ex: 123456789"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Regime Tributário (CRT):</label>
                  <select
                    value={form.regimeTributario || '1'}
                    onChange={(e) => atualizarCampo('regimeTributario', e.target.value as ConfigFiscalLoja['regimeTributario'])}
                    style={inputStyle}
                  >
                    <option value="1">1 - Simples Nacional</option>
                    <option value="4">4 - MEI (Microempreendedor)</option>
                    <option value="2">2 - Simples Nacional (Excesso)</option>
                    <option value="3">3 - Regime Normal (Lucro Pres./Real)</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={labelStyle}>Razão Social:</label>
                    <input
                      type="text"
                      value={form.razaoSocial || ''}
                      onChange={(e) => atualizarCampo('razaoSocial', e.target.value)}
                      placeholder="Nome empresarial oficial"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Nome Fantasia:</label>
                    <input
                      type="text"
                      value={form.nomeFantasia || ''}
                      onChange={(e) => atualizarCampo('nomeFantasia', e.target.value)}
                      placeholder="Nome da adega ou loja"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* ENDEREÇO FISCAL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '10px' }}>
                <div>
                  <label style={labelStyle}>CEP:</label>
                  <input
                    type="text"
                    value={form.cep || ''}
                    onChange={(e) => atualizarCampo('cep', e.target.value)}
                    placeholder="00000-000"
                    style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Logradouro (Rua / Av.):</label>
                  <input
                    type="text"
                    value={form.logradouro || ''}
                    onChange={(e) => atualizarCampo('logradouro', e.target.value)}
                    placeholder="Av. Brasil"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Número:</label>
                  <input
                    type="text"
                    value={form.numero || ''}
                    onChange={(e) => atualizarCampo('numero', e.target.value)}
                    placeholder="100 ou S/N"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bairro:</label>
                  <input
                    type="text"
                    value={form.bairro || ''}
                    onChange={(e) => atualizarCampo('bairro', e.target.value)}
                    placeholder="Centro"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Município:</label>
                  <input
                    type="text"
                    value={form.municipio || ''}
                    onChange={(e) => atualizarCampo('municipio', e.target.value)}
                    placeholder="São Paulo"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>UF:</label>
                  <select
                    value={form.uf || 'SP'}
                    onChange={(e) => atualizarCampo('uf', e.target.value)}
                    style={inputStyle}
                  >
                    {UFS_BR.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PARÂMETROS NFC-E (CSC E SÉRIE) & PADRÕES TRIBUTÁRIOS */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  🔐 Parâmetros NFC-e (SEFAZ)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>Série NFC-e:</label>
                    <input
                      type="number"
                      min={1}
                      value={form.serieNfce ?? 1}
                      onChange={(e) => atualizarCampo('serieNfce', Number(e.target.value) || 1)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Próximo Nº:</label>
                    <input
                      type="number"
                      min={1}
                      value={form.proximoNumeroNfce ?? 1}
                      onChange={(e) => atualizarCampo('proximoNumeroNfce', Number(e.target.value) || 1)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>ID do CSC:</label>
                    <input
                      type="text"
                      value={form.idCsc || ''}
                      onChange={(e) => atualizarCampo('idCsc', e.target.value)}
                      placeholder="Ex: 000001"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Código CSC:</label>
                    <input
                      type="text"
                      value={form.codigoCsc || ''}
                      onChange={(e) => atualizarCampo('codigoCsc', e.target.value)}
                      placeholder="Token CSC da SEFAZ"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  📦 Padrão Tributário de Produtos (Fallback)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>NCM Padrão (8 díg.):</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={form.ncmPadrao || ''}
                      onChange={(e) => atualizarCampo('ncmPadrao', e.target.value.replace(/\D/g, ''))}
                      placeholder="22021000"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CFOP Padrão:</label>
                    <select
                      value={form.cfopPadrao || '5405'}
                      onChange={(e) => atualizarCampo('cfopPadrao', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="5102">5102 - Venda Mercadoria</option>
                      <option value="5405">5405 - Venda c/ ST (Bebidas/Adega)</option>
                      <option value="5101">5101 - Produção Própria</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>CSOSN / CST Padrão:</label>
                    <select
                      value={form.csosnPadrao || '500'}
                      onChange={(e) => atualizarCampo('csosnPadrao', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="102">102 - Tributada Simples Nac.</option>
                      <option value="500">500 - ICMS Cobrado por ST (Adega)</option>
                      <option value="400">400 - Não Tributada</option>
                      <option value="900">900 - Outros</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Unidade Padrão:</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={form.unidadePadrao || 'UN'}
                      onChange={(e) => atualizarCampo('unidadePadrao', e.target.value.toUpperCase())}
                      placeholder="UN"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RODAPÉ FIXO */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={onFechar}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 800,
                cursor: salvando ? 'wait' : 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              {salvando ? '⏳ Salvando...' : '💾 Salvar Configurações Fiscais'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
