export function repararNewlinesEmStringsJson(str) {
  const normalizado = str.replace(/\r\n?/g, '\n');
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < normalizado.length; i++) {
    const ch = normalizado[i];
    if (inString) {
      if (escaped) {
        out += ch === '\n' ? 'n' : ch;
        escaped = false;
      } else if (ch === '\\') {
        out += ch;
        escaped = true;
      } else if (ch === '"') {
        out += ch;
        inString = false;
      } else if (ch === '\n') {
        out += '\\n';
      } else if (ch === '\t') {
        out += '\\t';
      } else {
        out += ch;
      }
    } else {
      if (ch === '"') {
        inString = true;
      }
      out += ch;
    }
  }
  return out;
}

function tentarParseObjeto(candidato) {
  const tentarJson = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      const reparado = repararNewlinesEmStringsJson(str).replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(reparado);
    }
  };

  let parsed = tentarJson(candidato);
  for (let i = 0; i < 3 && typeof parsed === 'string'; i++) {
    parsed = tentarJson(parsed.trim());
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Conteúdo não é um objeto JSON de Service Account.');
  }

  return parsed;
}

function validarENormalizarServiceAccount(parsed, tamanhoTotal) {
  const projectId = String(parsed?.project_id || '').trim();
  const clientEmail = String(parsed?.client_email || '').trim();
  let privateKey = String(parsed?.private_key || '').trim();

  const faltando = [];
  if (!projectId) faltando.push('project_id');
  if (!clientEmail || !clientEmail.includes('@')) faltando.push('client_email');
  if (!privateKey) faltando.push('private_key');

  if (faltando.length > 0) {
    throw new Error(
      `Campos obrigatórios ausentes (${faltando.join(', ')}) [tamanho=${tamanhoTotal}]. Cole o JSON completo da Service Account do Firebase na Vercel.`
    );
  }

  privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r\n?/g, '\n');
  if (!privateKey.includes('-----BEGIN') || !privateKey.includes('-----END')) {
    throw new Error('Campo private_key sem cabeçalho/rodapé PEM válido (BEGIN/END PRIVATE KEY).');
  }

  return {
    ...parsed,
    client_email: clientEmail,
    project_id: projectId,
    private_key: privateKey,
  };
}

function tentarParseCandidatosUnicos(entrada) {
  const candidatos = [];
  const vistos = new Set();
  const addCandidato = (c) => {
    const val = String(c ?? '').trim();
    if (val && !vistos.has(val)) {
      vistos.add(val);
      candidatos.push(val);
    }
  };

  const adicionarCandidatos = (base) => {
    addCandidato(base);

    // Recupera aspa simples/dupla inicial solta antes de `{` ou `"type"`, ex.: `"{\n "type": ... }`
    if (
      (base.startsWith('"') && !base.endsWith('"') && base.length > 2) ||
      (base.startsWith("'") && !base.endsWith("'") && base.length > 2)
    ) {
      const semAspaInicial = base.slice(1).trim();
      addCandidato(semAspaInicial);
      if (semAspaInicial && !semAspaInicial.startsWith('{')) {
        addCandidato(`{${semAspaInicial.endsWith('}') ? semAspaInicial : `${semAspaInicial}}`}`);
      }
    }

    // Recupera JSON colado sem a chave de abertura `{` (e/ou sem `}`), ex.: começando em `"type":`
    if (!base.startsWith('{')) {
      addCandidato(`{${base.endsWith('}') ? base : `${base}}`}`);
    }

    // Recupera JSON envolvido em aspas duplas externas sem escapar aspas internas
    if (base.startsWith('"') && base.endsWith('"') && base.length > 2) {
      const semAspas = base.slice(1, -1).trim();
      addCandidato(semAspas);
      if (!semAspas.startsWith('{')) {
        addCandidato(`{${semAspas.endsWith('}') ? semAspas : `${semAspas}}`}`);
      }
    }

    // Recupera conteúdo colado com aspas escapadas `\"` sem aspas externas envolvendo
    if (base.includes('\\"')) {
      const desescapado = base.replace(/\\"/g, '"').trim();
      addCandidato(desescapado);
      if (!desescapado.startsWith('{')) {
        addCandidato(`{${desescapado.endsWith('}') ? desescapado : `${desescapado}}`}`);
      }
    }

    // Recorta apenas o trecho entre o primeiro `{` e o último `}` se houver texto ao redor
    const ini = base.indexOf('{');
    const fim = base.lastIndexOf('}');
    if (ini !== -1 && fim > ini) {
      addCandidato(base.slice(ini, fim + 1));
    }
  };

  adicionarCandidatos(entrada);
  if (/[\u201C\u201D\u2018\u2019]/.test(entrada)) {
    const normalizadoAspas = entrada
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    adicionarCandidatos(normalizadoAspas);
  }

  let primeiroErro = null;
  for (const candidato of candidatos) {
    try {
      return tentarParseObjeto(candidato);
    } catch (err) {
      if (!primeiroErro) primeiroErro = err;
    }
  }

  const diag = `${primeiroErro?.message || 'JSON inválido'} [inicio=${JSON.stringify(entrada.slice(0, 1))}, fim=${JSON.stringify(entrada.slice(-1))}, tamanho=${entrada.length}, campos: project_id=${entrada.includes('project_id') ? 'ok' : 'nao'}, client_email=${entrada.includes('client_email') ? 'ok' : 'nao'}, private_key=${entrada.includes('PRIVATE KEY') || entrada.includes('private_key') ? 'ok' : 'nao'}]`;
  throw new Error(diag);
}

function extrairBlocosChavesBalanceadas(str) {
  const blocos = [];
  const pilha = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      pilha.push(i);
    } else if (ch === '}' && pilha.length > 0) {
      const inicio = pilha.pop();
      const bloco = str.slice(inicio, i + 1);
      if (bloco.length >= 80) {
        blocos.push(bloco);
      }
    }
  }

  return blocos;
}

function escolherMelhorServiceAccount(validos) {
  if (validos.length <= 1) {
    return validos[0] || null;
  }
  const projetoAlvo = String(process.env.FIREBASE_PROJECT_ID || 'adega-delivery-pdv').trim();
  for (let i = validos.length - 1; i >= 0; i--) {
    if (validos[i].project_id === projetoAlvo) {
      return validos[i];
    }
  }
  return validos[validos.length - 1];
}

function recuperarMultiplosBlocos(texto) {
  const normalizado = texto
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  const pedacos = [];
  const vistos = new Set();
  const addPedaco = (p) => {
    const val = String(p ?? '').trim();
    if (val && !vistos.has(val)) {
      vistos.add(val);
      pedacos.push(val);
    }
  };

  const regexInicioSa = /\{?\s*"type"\s*:\s*"service_account"/g;
  const indices = [];
  let match;
  while ((match = regexInicioSa.exec(normalizado)) !== null) {
    indices.push(match.index);
  }

  for (let i = 0; i < indices.length; i++) {
    if (i + 1 < indices.length) {
      addPedaco(normalizado.slice(indices[i], indices[i + 1]));
    }
    addPedaco(normalizado.slice(indices[i]));
  }

  for (const bloco of extrairBlocosChavesBalanceadas(normalizado)) {
    addPedaco(bloco);
  }

  const semPrefixoAspas = normalizado.replace(/^["'`]+/, '').trim();
  if (semPrefixoAspas !== normalizado) {
    for (const bloco of extrairBlocosChavesBalanceadas(semPrefixoAspas)) {
      addPedaco(bloco);
    }
  }

  const validos = [];
  for (const pedaco of pedacos) {
    try {
      const parsed = tentarParseCandidatosUnicos(pedaco);
      validos.push(validarENormalizarServiceAccount(parsed, texto.length));
    } catch {
      // Ignora fatia incompleta/corrompida e testa próximas fatias
    }
  }

  if (validos.length === 0) {
    return null;
  }

  console.warn(
    `[ServiceAccount] FIREBASE_SERVICE_ACCOUNT_JSON continha múltiplas colagens ou delimitadores extras (tamanho=${texto.length}, blocosValidos=${validos.length}). Recomendado limpar a variável na Vercel.`
  );
  return escolherMelhorServiceAccount(validos);
}

function recuperarPorCamposRegex(texto) {
  const normalizado = texto
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  const projectIds = [...normalizado.matchAll(/"project_id"\s*:\s*"([^"\r\n]+)"/g)].map((m) =>
    m[1].trim()
  );
  const clientEmails = [...normalizado.matchAll(/"client_email"\s*:\s*"([^"@\r\n]+@[^"\r\n]+)"/g)].map(
    (m) => m[1].trim()
  );
  const privateKeys = [
    ...normalizado.matchAll(
      /(-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----(?:\\n|\r?\n)*)/g
    ),
  ].map((m) => m[1]);

  if (
    projectIds.length === 0 ||
    projectIds.length !== clientEmails.length ||
    projectIds.length !== privateKeys.length
  ) {
    return null;
  }

  const validos = [];
  for (let i = 0; i < projectIds.length; i++) {
    try {
      validos.push(
        validarENormalizarServiceAccount(
          {
            type: 'service_account',
            project_id: projectIds[i],
            client_email: clientEmails[i],
            private_key: privateKeys[i],
          },
          texto.length
        )
      );
    } catch {
      // Ignora entrada inválida
    }
  }

  if (validos.length === 0) {
    return null;
  }

  console.warn(
    `[ServiceAccount] FIREBASE_SERVICE_ACCOUNT_JSON recuperado por campos estruturais (tamanho=${texto.length}, entradas=${validos.length}). Recomendado limpar a variável na Vercel.`
  );
  return escolherMelhorServiceAccount(validos);
}

export function parseServiceAccountEnv(rawEnv) {
  let texto = String(rawEnv ?? '').replace(/^\uFEFF/, '').trim();
  if (!texto) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON vazio.');
  }

  // Remove cercas markdown (```json ... ```) caso coladas junto com o snippet
  if (/^```/i.test(texto)) {
    texto = texto.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Remove prefixo tipo NOME_VAR= quando seguido diretamente por JSON/aspas (sem afetar Base64)
  texto = texto.replace(/^([A-Z][A-Z0-9_]*)\s*=\s*(?=[{'"`])/, '').trim();

  // Remove aspas simples ou crases externas caso colado com delimitador de shell
  if (
    (texto.startsWith("'") && texto.endsWith("'") && texto.length > 2) ||
    (texto.startsWith('`') && texto.endsWith('`') && texto.length > 2)
  ) {
    texto = texto.slice(1, -1).trim();
  }

  // Suporta conteúdo codificado em Base64 quando não inicia como JSON ou string JSON
  if (!texto.startsWith('{') && !texto.startsWith('"') && /^[A-Za-z0-9+/=\s_-]+$/.test(texto)) {
    try {
      const decodificado = Buffer.from(texto.replace(/\s+/g, ''), 'base64')
        .toString('utf8')
        .replace(/^\uFEFF/, '')
        .trim();
      if (
        decodificado.startsWith('{') ||
        decodificado.startsWith('"') ||
        decodificado.includes('"project_id"')
      ) {
        texto = decodificado;
      }
    } catch {
      // Mantém texto original caso não seja Base64 válido
    }
  }

  try {
    const parsed = tentarParseCandidatosUnicos(texto);
    return validarENormalizarServiceAccount(parsed, texto.length);
  } catch (erroFase1) {
    try {
      const recuperadoBlocos = recuperarMultiplosBlocos(texto);
      if (recuperadoBlocos) {
        return recuperadoBlocos;
      }
    } catch {
      // Segue para recuperação por campos
    }

    try {
      const recuperadoRegex = recuperarPorCamposRegex(texto);
      if (recuperadoRegex) {
        return recuperadoRegex;
      }
    } catch {
      // Mantém diagnóstico da Fase 1
    }

    throw erroFase1;
  }
}
