// Vercel Serverless Function: /api/nfce
// Proxy seguro para emissão, consulta, cancelamento e teste de conexão de NFC-e (Modelo 65) via Focus NFe API v2

function limparDigitos(val) {
  return String(val || '').replace(/\D/g, '');
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
    if (secretHeader !== secretServidor) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado para emitir NFC-e.' });
    }
  }

  try {
    const body = req.body || {};
    const { acao = 'emitir', ambiente = 'homologacao', tokenFocusNfe } = body;

    if (!ACOES_PERMITIDAS.has(String(acao))) {
      return res.status(400).json({ sucesso: false, erro: 'Ação fiscal não permitida.' });
    }
    if (acao === 'emitir' && (!body.venda || !body.venda.id)) {
      return res.status(400).json({ sucesso: false, erro: 'Dados da venda inválidos para emissão.' });
    }

    // Permite usar token específico da loja ou token global de revenda/conta Focus NFe no servidor
    const token = String(tokenFocusNfe || process.env.FOCUS_NFE_TOKEN || '').trim();
    if (!token) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Token da Focus NFe não configurado. Informe o token nas Configurações Fiscais da loja ou na variável FOCUS_NFE_TOKEN.',
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
      if (!ref) {
        return res.status(400).json({ sucesso: false, erro: 'Referência (ref) da NFC-e não informada.' });
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
      if (!ref) {
        return res.status(400).json({ sucesso: false, erro: 'Referência (ref) da NFC-e não informada.' });
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
      const cnpjEmitente = limparDigitos(emitente.cnpj);

      if (cnpjEmitente.length !== 14) {
        return res.status(400).json({
          sucesso: false,
          erro: 'CNPJ da loja inválido para emissão fiscal. Verifique as Configurações Fiscais.',
        });
      }

      const itensVenda = Array.isArray(venda.itens) ? venda.itens : [];
      if (itensVenda.length === 0) {
        return res.status(400).json({ sucesso: false, erro: 'A venda não possui itens para emitir NFC-e.' });
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
      let descontoAcumulado = 0;

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

        if (descontoTotal > 0 && somaBrutaItens > 0) {
          const descItem =
            idx === itensVenda.length - 1
              ? Number(Math.max(0, descontoTotal - descontoAcumulado).toFixed(2))
              : Number(((vBruto / somaBrutaItens) * descontoTotal).toFixed(2));
          descontoAcumulado = Number((descontoAcumulado + descItem).toFixed(2));
          if (descItem > 0) {
            objItem.valor_desconto = descItem;
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
