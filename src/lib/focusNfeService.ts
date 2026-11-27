import { signOut } from 'firebase/auth';
import { ConfigFiscalLoja, ItemEstoque, NfceRegistro, Supermercado, Venda } from '../types';
import { renovarSessaoFirebaseServidor } from './authClient';
import { auth } from './firebase';

async function headersNfceComAuth(forcarRefresh = false): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    if (auth?.currentUser?.isAnonymous) {
      await signOut(auth).catch(() => {});
      await renovarSessaoFirebaseServidor();
    } else if (!auth?.currentUser) {
      await renovarSessaoFirebaseServidor();
    }
    if (auth?.currentUser && !auth.currentUser.isAnonymous) {
      const token = await auth.currentUser.getIdToken(forcarRefresh);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch {}
  return headers;
}

async function postNfceApi(payload: Record<string, unknown>): Promise<RespostaNfceApi> {
  const bodyStr = JSON.stringify(payload);
  let resp = await fetch('/api/nfce', {
    method: 'POST',
    credentials: 'same-origin',
    headers: await headersNfceComAuth(false),
    body: bodyStr,
  });

  if (resp.status === 401) {
    const renovado = await renovarSessaoFirebaseServidor().catch(() => ({ autenticado: false }));
    if (renovado.autenticado) {
      resp = await fetch('/api/nfce', {
        method: 'POST',
        credentials: 'same-origin',
        headers: await headersNfceComAuth(true),
        body: bodyStr,
      });
    }
  }

  return parseRespostaNfce(resp);
}

export interface ProntidaoFiscal {
  pronto: boolean;
  habilitado: boolean;
  pendencias: string[];
}

export interface RespostaNfceApi {
  sucesso: boolean;
  ref?: string;
  ambiente?: 'homologacao' | 'producao';
  status?: NfceRegistro['status'];
  numero?: string;
  serie?: string;
  chave?: string;
  danfeUrl?: string;
  xmlUrl?: string;
  qrcodeUrl?: string;
  mensagemSefaz?: string;
  mensagem?: string;
  aviso?: string;
  erro?: string;
}

export function validarProntidaoFiscal(loja?: Supermercado | null): ProntidaoFiscal {
  if (!loja) {
    return { pronto: false, habilitado: false, pendencias: ['Loja não identificada'] };
  }

  const cfg = loja.configFiscal;
  const habilitado = Boolean(cfg?.habilitado);
  const pendencias: string[] = [];

  const cnpjLimpo = String(loja.cnpj || '').replace(/\D/g, '');
  if (cnpjLimpo.length !== 14) pendencias.push('CNPJ da loja (14 dígitos)');
  if (!cfg?.razaoSocial?.trim()) pendencias.push('Razão Social');
  if (!cfg?.inscricaoEstadual?.trim()) pendencias.push('Inscrição Estadual (IE)');
  if (!cfg?.logradouro?.trim() || !cfg?.municipio?.trim() || !cfg?.uf?.trim()) {
    pendencias.push('Endereço fiscal (Logradouro, Município e UF)');
  }
  if (!cfg?.tokenFocusNfe?.trim()) pendencias.push('Token da API Focus NFe');
  if (!cfg?.idCsc?.trim() || !cfg?.codigoCsc?.trim()) pendencias.push('CSC e ID do CSC (SEFAZ)');

  return {
    pronto: habilitado && pendencias.length === 0,
    habilitado,
    pendencias,
  };
}

async function parseRespostaNfce(resp: Response): Promise<RespostaNfceApi> {
  const texto = await resp.text();
  try {
    const parsed = JSON.parse(texto);
    if (!resp.ok && parsed && !parsed.erro) {
      return { sucesso: false, erro: `Erro HTTP ${resp.status} no serviço fiscal.` };
    }
    return parsed;
  } catch {
    return {
      sucesso: false,
      erro: resp.ok
        ? 'Resposta inválida do servidor fiscal.'
        : `Serviço fiscal indisponível (HTTP ${resp.status}).`,
    };
  }
}

export async function testarConexaoFocusNfe(
  cnpj: string,
  configFiscal: Partial<ConfigFiscalLoja>,
  lojaId?: string
): Promise<RespostaNfceApi> {
  return postNfceApi({
    acao: 'testar_conexao',
    lojaId: lojaId || '',
    ambiente: configFiscal.ambiente || 'homologacao',
    tokenFocusNfe: configFiscal.tokenFocusNfe || '',
    cnpj,
  });
}

export async function emitirNfceVenda(
  venda: Venda,
  loja: Supermercado,
  estoqueLoja: ItemEstoque[],
  cpfNaNota?: string
): Promise<RespostaNfceApi> {
  const cfg = loja.configFiscal;
  if (!cfg?.habilitado) {
    return {
      sucesso: false,
      erro: 'Emissão fiscal (NFC-e) não está ativada nas Configurações Fiscais desta loja.',
    };
  }

  const itensEnriquecidos = venda.itens.map((item) => {
    const prodEstoque = estoqueLoja.find(
      (p) => p.codigo === item.codigo || p.codigo_barras === item.codigo
    );
    return {
      ...item,
      ncm: prodEstoque?.ncm || cfg.ncmPadrao || '21069090',
      cfop: prodEstoque?.cfop || cfg.cfopPadrao || '5102',
      csosn: prodEstoque?.csosn || cfg.csosnPadrao || '102',
      cest: prodEstoque?.cest || undefined,
      unidade_medida: prodEstoque?.unidade_medida || cfg.unidadePadrao || 'UN',
      origem_fiscal: prodEstoque?.origem_fiscal || '0',
    };
  });

  const ref = venda.nfce?.ref || `pdv_${loja.id}_${venda.id}`;

  return postNfceApi({
    acao: 'emitir',
    lojaId: loja.id,
    ref,
    ambiente: cfg.ambiente || 'homologacao',
    tokenFocusNfe: cfg.tokenFocusNfe || '',
    cpfNaNota: cpfNaNota ?? venda.cpfNaNota ?? '',
    emitente: {
      cnpj: loja.cnpj,
      razaoSocial: cfg.razaoSocial || loja.nome,
      nomeFantasia: cfg.nomeFantasia || loja.nome,
      inscricaoEstadual: cfg.inscricaoEstadual || '',
      regimeTributario: cfg.regimeTributario || '1',
      cep: cfg.cep || '',
      logradouro: cfg.logradouro || loja.endereco || '',
      numero: cfg.numero || 'S/N',
      bairro: cfg.bairro || '',
      municipio: cfg.municipio || loja.cidade || '',
      uf: cfg.uf || '',
    },
    padroes: {
      ncmPadrao: cfg.ncmPadrao || '21069090',
      cfopPadrao: cfg.cfopPadrao || '5102',
      csosnPadrao: cfg.csosnPadrao || '102',
      unidadePadrao: cfg.unidadePadrao || 'UN',
    },
    venda: {
      ...venda,
      itens: itensEnriquecidos,
    },
  });
}

export async function consultarNfceVenda(
  ref: string,
  loja: Supermercado
): Promise<RespostaNfceApi> {
  const cfg = loja.configFiscal;
  return postNfceApi({
    acao: 'consultar',
    lojaId: loja.id,
    ref,
    ambiente: cfg?.ambiente || 'homologacao',
    tokenFocusNfe: cfg?.tokenFocusNfe || '',
  });
}

export async function cancelarNfceVenda(
  ref: string,
  justificativa: string,
  loja: Supermercado
): Promise<RespostaNfceApi> {
  const cfg = loja.configFiscal;
  return postNfceApi({
    acao: 'cancelar',
    lojaId: loja.id,
    ref,
    justificativa,
    ambiente: cfg?.ambiente || 'homologacao',
    tokenFocusNfe: cfg?.tokenFocusNfe || '',
  });
}
