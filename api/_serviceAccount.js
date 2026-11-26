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

  adicionarCandidatos(texto);
  if (/[\u201C\u201D\u2018\u2019]/.test(texto)) {
    const normalizadoAspas = texto
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    adicionarCandidatos(normalizadoAspas);
  }

  let parsed = null;
  let primeiroErro = null;
  for (const candidato of candidatos) {
    try {
      parsed = tentarParseObjeto(candidato);
      break;
    } catch (err) {
      if (!primeiroErro) primeiroErro = err;
    }
  }

  if (!parsed) {
    const diag = `${primeiroErro?.message || 'JSON inválido'} [inicio=${JSON.stringify(texto.slice(0, 1))}, fim=${JSON.stringify(texto.slice(-1))}, tamanho=${texto.length}, campos: project_id=${texto.includes('project_id') ? 'ok' : 'nao'}, client_email=${texto.includes('client_email') ? 'ok' : 'nao'}, private_key=${texto.includes('PRIVATE KEY') || texto.includes('private_key') ? 'ok' : 'nao'}]`;
    throw new Error(diag);
  }

  const projectId = String(parsed.project_id || '').trim();
  const clientEmail = String(parsed.client_email || '').trim();
  let privateKey = String(parsed.private_key || '').trim();

  const faltando = [];
  if (!projectId) faltando.push('project_id');
  if (!clientEmail || !clientEmail.includes('@')) faltando.push('client_email');
  if (!privateKey) faltando.push('private_key');

  if (faltando.length > 0) {
    throw new Error(
      `Campos obrigatórios ausentes (${faltando.join(', ')}) [tamanho=${texto.length}]. Cole o JSON completo da Service Account do Firebase na Vercel.`
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
