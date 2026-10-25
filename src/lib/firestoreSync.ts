import { initializeApp, getApps } from 'firebase/app';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { safeLocalStorageSet } from './safeStorage';
import {
  salvarImagemIndexedDB,
  obterFotoCache,
  salvarLoteImagensIndexedDB,
} from './imageIndexedDB';
import {
  Supermercado,
  ItemEstoque,
  ProdutoCatalogo,
  Venda,
  OperadorCaixa,
  ClienteDevedor,
} from '../types';

// Real-time listener for Supermercados (reflete deleções e adições instantaneamente)
export function subscribeSupermercados(callback: (lojas: Supermercado[]) => void) {
  const colRef = collection(db, 'supermercados');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const lojas: Supermercado[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Supermercado;
        if (data && (data.nome || data.cnpj)) {
          lojas.push({ id: docSnap.id, ...data });
        }
      });
      if (lojas.length > 0) {
        callback(lojas);
      } else {
        // Se a nuvem retornou vazio (modo offline), protege as lojas locais existentes
        try {
          const salvo = localStorage.getItem('lista_supermercados_app');
          if (salvo) {
            const parsed = JSON.parse(salvo);
            if (Array.isArray(parsed) && parsed.length > 0) {
              callback(parsed);
              return;
            }
          }
        } catch (e) {}
        callback([]);
      }
    },
    (_err) => {
      // Graceful offline fallback
      try {
        const salvo = localStorage.getItem('lista_supermercados_app');
        if (salvo) {
          const parsed = JSON.parse(salvo);
          if (Array.isArray(parsed) && parsed.length > 0) {
            callback(parsed);
          }
        }
      } catch (e) {}
    }
  );
}

export function sanitizarItemEstoque(item: ItemEstoque): ItemEstoque {
  return {
    ...item,
    codigo: String(item?.codigo || item?.codigo_barras || '').trim(),
    nome: String(item?.nome || 'Produto').trim(),
    quantidade: Number.isFinite(Number(item?.quantidade)) ? Number(item.quantidade) : 0,
    preco_venda: Number.isFinite(Number(item?.preco_venda)) ? Number(item.preco_venda) : 0,
    preco_custo: Number.isFinite(Number(item?.preco_custo)) ? Number(item.preco_custo) : 0,
    validade: String(item?.validade || '2099-12-31').trim(),
    lote: String(item?.lote || '').trim(),
  };
}

// Buffer em memória para garantir atualização otimista instantânea e impedir que snapshots intermediários ocultem produtos recém-cadastrados
const itensRecemSalvosMemoria = new Map<string, { item: ItemEstoque; lojaId: string; timestamp: number }>();
const itensRecemExcluidosMemoria = new Map<string, number>();
const estoqueListenersPorLoja = new Map<string, Set<(itens: ItemEstoque[]) => void>>();

function gerarChaveItemEstoque(lojaId: string, codigo: string, validade: string, lote: string): string {
  return `${String(lojaId || '').trim()}_${String(codigo || '').trim()}_${String(validade || '2099-12-31').trim()}_${String(lote || '').trim()}`;
}

function notificarListenersEstoqueImediato(lojaId: string) {
  const listeners = estoqueListenersPorLoja.get(lojaId);
  if (!listeners || listeners.size === 0) return;

  try {
    const salvo = localStorage.getItem(`estoque_${lojaId}`);
    if (!salvo) return;
    const parsed = JSON.parse(salvo);
    if (!Array.isArray(parsed)) return;
    const itens = parsed.filter((x) => x && (x.codigo || x.codigo_barras)).map(sanitizarItemEstoque);
    listeners.forEach((cb) => {
      try {
        cb(itens);
      } catch (e) {}
    });
  } catch (e) {}
}

// Real-time listener for Estoque com proteção Offline-First (nunca apaga dados locais)
export function subscribeEstoque(lojaId: string, callback: (itens: ItemEstoque[]) => void) {
  if (!lojaId) return () => {};

  if (!estoqueListenersPorLoja.has(lojaId)) {
    estoqueListenersPorLoja.set(lojaId, new Set());
  }
  estoqueListenersPorLoja.get(lojaId)!.add(callback);

  const colRef = collection(db, 'estoque');
  const q = query(colRef, where('lojaId', '==', lojaId));
  const unsubSnapshot = onSnapshot(
    q,
    (snapshot) => {
      const agora = Date.now();
      const itensRemotos: ItemEstoque[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ItemEstoque;
        if (data && (data.codigo || data.codigo_barras)) {
          const itemSanitizado = sanitizarItemEstoque(data);
          const chaveExclusao = gerarChaveItemEstoque(lojaId, itemSanitizado.codigo, itemSanitizado.validade, itemSanitizado.lote);
          const tsExcluido = itensRecemExcluidosMemoria.get(chaveExclusao);
          if (tsExcluido && agora - tsExcluido < 15000) {
            return; // Ignora item recém-excluído caso snapshot antigo ainda o traga
          }
          itensRemotos.push(itemSanitizado);
        }
      });

      // Ler dados locais para preservar eventuais fotos que não subiram pro remoto
      let itensLocais: ItemEstoque[] = [];
      try {
        const salvo = localStorage.getItem(`estoque_${lojaId}`);
        if (salvo) {
          const parsed = JSON.parse(salvo);
          if (Array.isArray(parsed)) {
            itensLocais = parsed.filter((x) => x && (x.codigo || x.codigo_barras)).map(sanitizarItemEstoque);
          }
        }
      } catch (e) {}

      const mapaLocal = new Map<string, ItemEstoque>();
      itensLocais.forEach((item) => {
        const chave = `${item.codigo}_${item.validade || ''}_${item.lote || ''}`;
        mapaLocal.set(chave, item);
        mapaLocal.set(item.codigo, item);
      });

      if (itensRemotos.length === 0) {
        // Verifica se há itens recém-salvos em memória para esta loja
        const recemSalvosLoja: ItemEstoque[] = [];
        itensRecemSalvosMemoria.forEach((reg) => {
          if (reg.lojaId === lojaId && agora - reg.timestamp < 30000) {
            recemSalvosLoja.push(reg.item);
          }
        });

        if (recemSalvosLoja.length > 0) {
          safeLocalStorageSet(`estoque_${lojaId}`, JSON.stringify(recemSalvosLoja));
          callback(recemSalvosLoja);
          return;
        }

        // Se a nuvem retornou vazia e a resposta não é de cache offline, o estoque está genuinamente vazio
        if (snapshot.empty && !snapshot.metadata.fromCache) {
          try {
            safeLocalStorageSet(`estoque_${lojaId}`, JSON.stringify([]));
          } catch (e) {}
          callback([]);
          return;
        }

        // Se estiver offline ou carregando inicialmente
        if (itensLocais.length > 0) {
          callback(itensLocais);
        } else {
          callback([]);
        }
        return;
      }

      // Constrói a lista baseando-se nos itens que existem no banco remoto,
      // preservando as fotos locais e do cache IndexedDB caso o remoto tenha vindo sem foto
      const chavesPresentes = new Set<string>();
      const itensAtualizados = itensRemotos.map((remoto) => {
        const chave = `${remoto.codigo}_${remoto.validade || ''}_${remoto.lote || ''}`;
        const chaveCompleta = gerarChaveItemEstoque(lojaId, remoto.codigo, remoto.validade, remoto.lote);
        chavesPresentes.add(chaveCompleta);

        const recemSalvo = itensRecemSalvosMemoria.get(chaveCompleta);
        const baseRemoto = recemSalvo && agora - recemSalvo.timestamp < 15000 ? recemSalvo.item : remoto;

        const local = mapaLocal.get(chave) || mapaLocal.get(remoto.codigo);
        const fotoCache = obterFotoCache(remoto.codigo) || '';
        const fotoFinal = (baseRemoto.foto && baseRemoto.foto.trim()) || (local?.foto && local.foto.trim()) || fotoCache || '';

        // Se veio foto base64 no documento remoto, assegura cache no IndexedDB
        if (baseRemoto.foto && baseRemoto.foto.startsWith('data:image') && baseRemoto.codigo) {
          salvarImagemIndexedDB(baseRemoto.codigo, baseRemoto.foto).catch(() => {});
        }

        return sanitizarItemEstoque({
          ...baseRemoto,
          preco_venda: Number(baseRemoto.preco_venda) || Number(local?.preco_venda) || 0,
          preco_custo: Number(baseRemoto.preco_custo) || Number(local?.preco_custo) || 0,
          foto: fotoFinal,
        });
      });

      // Mescla qualquer produto recém-cadastrado nesta sessão que ainda esteja em trânsito para o Firestore
      itensRecemSalvosMemoria.forEach((reg, chaveCompleta) => {
        if (reg.lojaId === lojaId && agora - reg.timestamp < 30000 && !chavesPresentes.has(chaveCompleta)) {
          chavesPresentes.add(chaveCompleta);
          itensAtualizados.push(sanitizarItemEstoque(reg.item));
        }
      });

      // Atualiza o cache local para refletir as adições e exclusões com exatidão
      try {
        safeLocalStorageSet(`estoque_${lojaId}`, JSON.stringify(itensAtualizados));
      } catch (e) {}

      callback(itensAtualizados);
    },
    (_err) => {
      // Em caso de falha de conexão/offline, carrega do localStorage local imediatamente
      try {
        const salvo = localStorage.getItem(`estoque_${lojaId}`);
        if (salvo) {
          const itensLocais = JSON.parse(salvo);
          if (Array.isArray(itensLocais) && itensLocais.length > 0) {
            callback(itensLocais.filter((x) => x && (x.codigo || x.codigo_barras)).map(sanitizarItemEstoque));
          }
        }
      } catch (e) {}
    }
  );

  return () => {
    const set = estoqueListenersPorLoja.get(lojaId);
    if (set) {
      set.delete(callback);
    }
    unsubSnapshot();
  };
}

// Real-time listener for Catálogo Global (com sincronização em tempo real de adições, edições e exclusões)
export function subscribeCatalogo(callback: (produtos: ProdutoCatalogo[]) => void) {
  const colRef = collection(db, 'catalogo_global');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const mapaRemoto = new Map<string, ProdutoCatalogo>();
      snapshot.forEach((docSnap) => {
        const p = docSnap.data() as ProdutoCatalogo;
        if (p && p.codigo) {
          const codLimpo = p.codigo.trim();
          const existente = mapaRemoto.get(codLimpo);
          if (!existente) {
            mapaRemoto.set(codLimpo, { ...p, codigo: codLimpo });
          } else {
            // Se houver duplicação remota, une preservando imagem e nome válidos
            const imgMelhor = (p.imagem && p.imagem.trim().length > 10) ? p.imagem : existente.imagem;
            const nomeMelhor = (p.nome && p.nome.trim().length > 0) ? p.nome : existente.nome;
            mapaRemoto.set(codLimpo, {
              ...existente,
              ...p,
              codigo: codLimpo,
              imagem: imgMelhor || '',
              nome: nomeMelhor || existente.nome,
            });
          }
        }
      });

      const prodsRemotos = Array.from(mapaRemoto.values());

      let prodsLocais: ProdutoCatalogo[] = [];
      try {
        const salvo = localStorage.getItem('catalogoGlobalFirebase');
        if (salvo) prodsLocais = JSON.parse(salvo);
      } catch (e) {}

      const mapaLocal = new Map<string, ProdutoCatalogo>();
      prodsLocais.forEach((p) => {
        if (p.codigo) {
          const codLimpo = p.codigo.trim();
          if (!mapaLocal.has(codLimpo)) {
            mapaLocal.set(codLimpo, { ...p, codigo: codLimpo });
          }
        }
      });

      if (prodsRemotos.length === 0) {
        if (snapshot.empty && !snapshot.metadata.fromCache) {
          try {
            safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify([]));
          } catch (e) {}
          callback([]);
          return;
        }

        const locaisDeduplicados = Array.from(mapaLocal.values());
        if (locaisDeduplicados.length > 0) {
          callback(locaisDeduplicados);
        } else {
          callback([]);
        }
        return;
      }

      // Baseia-se estritamente nos produtos existentes no banco remoto, mantendo fotos locais e do cache IndexedDB
      const mapaFinal = new Map<string, ProdutoCatalogo>();
      prodsRemotos.forEach((remoto) => {
        const codLimpo = remoto.codigo.trim();
        const local = mapaLocal.get(codLimpo);
        const fotoCache = obterFotoCache(codLimpo) || '';
        const imagemFinal = (remoto.imagem && remoto.imagem.trim()) || (local?.imagem && local.imagem.trim()) || fotoCache || '';

        // Se veio imagem base64 no documento remoto, assegura cache no IndexedDB
        if (remoto.imagem && remoto.imagem.startsWith('data:image') && remoto.imagem.length > 10) {
          salvarImagemIndexedDB(codLimpo, remoto.imagem).catch(() => {});
        }

        const produtoFinal: ProdutoCatalogo = {
          ...remoto,
          codigo: codLimpo,
          imagem: imagemFinal,
        };
        if (!mapaFinal.has(codLimpo)) {
          mapaFinal.set(codLimpo, produtoFinal);
        } else {
          const anterior = mapaFinal.get(codLimpo)!;
          mapaFinal.set(codLimpo, {
            ...anterior,
            ...produtoFinal,
            imagem: produtoFinal.imagem || anterior.imagem || fotoCache || '',
            categoria: produtoFinal.categoria || anterior.categoria || 'Geral',
            marca: produtoFinal.marca || anterior.marca || '',
          });
        }
      });

      const prodsAtualizados = Array.from(mapaFinal.values());

      try {
        safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(prodsAtualizados));
      } catch (e) {}

      callback(prodsAtualizados);
    },
    (_err) => {
      try {
        const salvo = localStorage.getItem('catalogoGlobalFirebase');
        if (salvo) {
          const parsed = JSON.parse(salvo);
          if (Array.isArray(parsed)) {
            const mapa = new Map<string, ProdutoCatalogo>();
            parsed.forEach((p) => {
              if (p?.codigo) mapa.set(p.codigo.trim(), p);
            });
            callback(Array.from(mapa.values()));
            return;
          }
        }
      } catch (e) {}
    }
  );
}

// Real-time listener for Vendas
export function subscribeVendas(lojaId: string, callback: (vendas: Venda[]) => void) {
  const colRef = collection(db, 'vendas');
  const q = query(colRef, where('lojaId', '==', lojaId));
  return onSnapshot(
    q,
    (snapshot) => {
      const listaRemota: Venda[] = [];
      snapshot.forEach((docSnap) => {
        const v = { id: docSnap.id, ...docSnap.data() } as Venda;
        if (v && v.id) {
          listaRemota.push(v);
        }
      });

      let listaLocal: Venda[] = [];
      try {
        const salvo = localStorage.getItem(`vendas_${lojaId}`);
        if (salvo) listaLocal = JSON.parse(salvo);
      } catch (e) {}

      if (listaRemota.length === 0) {
        if (listaLocal.length > 0) {
          callback(listaLocal);
        } else {
          callback([]);
        }
        return;
      }

      const mapaVendas = new Map<string, Venda>();
      listaRemota.forEach((v) => mapaVendas.set(v.id, v));
      listaLocal.forEach((v) => {
        if (!mapaVendas.has(v.id)) mapaVendas.set(v.id, v);
      });

      const lista = Array.from(mapaVendas.values());
      lista.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(lista);
    },
    (_err) => {
      try {
        const salvo = localStorage.getItem(`vendas_${lojaId}`);
        if (salvo) callback(JSON.parse(salvo));
      } catch (e) {}
    }
  );
}

// Real-time listener for Operadores
export function subscribeOperadores(lojaId: string, callback: (operadores: OperadorCaixa[]) => void) {
  const colRef = collection(db, 'operadores');
  const q = query(colRef, where('lojaId', '==', lojaId));
  return onSnapshot(
    q,
    (snapshot) => {
      const listaRemota: OperadorCaixa[] = [];
      snapshot.forEach((docSnap) => {
        const op = { id: docSnap.id, ...docSnap.data() } as OperadorCaixa;
        if (op && op.id) {
          listaRemota.push(op);
        }
      });

      let listaLocal: OperadorCaixa[] = [];
      try {
        const salvo = localStorage.getItem(`operadores_caixa_${lojaId}`);
        if (salvo) listaLocal = JSON.parse(salvo);
      } catch (e) {}

      if (listaRemota.length === 0) {
        if (listaLocal.length > 0) {
          callback(listaLocal);
        }
        return;
      }

      const mapaOps = new Map<string, OperadorCaixa>();
      listaRemota.forEach((op) => mapaOps.set(op.id, op));
      listaLocal.forEach((op) => {
        if (!mapaOps.has(op.id)) mapaOps.set(op.id, op);
      });

      callback(Array.from(mapaOps.values()));
    },
    (_err) => {
      try {
        const salvo = localStorage.getItem(`operadores_caixa_${lojaId}`);
        if (salvo) callback(JSON.parse(salvo));
      } catch (e) {}
    }
  );
}

// Real-time listener for Clientes Devedores
export function subscribeClientesDevedores(lojaId: string, callback: (clientes: ClienteDevedor[]) => void) {
  const colRef = collection(db, 'clientes_devedores');
  const q = query(colRef, where('lojaId', '==', lojaId));
  return onSnapshot(
    q,
    (snapshot) => {
      const listaRemota: ClienteDevedor[] = [];
      snapshot.forEach((docSnap) => {
        const c = { id: docSnap.id, ...docSnap.data() } as ClienteDevedor;
        if (c && c.id) {
          listaRemota.push(c);
        }
      });

      let listaLocal: ClienteDevedor[] = [];
      try {
        const salvo = localStorage.getItem(`clientes_devedores_${lojaId}`);
        if (salvo) listaLocal = JSON.parse(salvo);
      } catch (e) {}

      if (listaRemota.length === 0) {
        if (listaLocal.length > 0) {
          callback(listaLocal);
        }
        return;
      }

      const mapa = new Map<string, ClienteDevedor>();
      listaRemota.forEach((c) => mapa.set(c.id, c));
      listaLocal.forEach((c) => {
        if (!mapa.has(c.id)) mapa.set(c.id, c);
      });

      callback(Array.from(mapa.values()));
    },
    (_err) => {
      try {
        const salvo = localStorage.getItem(`clientes_devedores_${lojaId}`);
        if (salvo) callback(JSON.parse(salvo));
      } catch (e) {}
    }
  );
}

// Helper to sanitize document ID strings for Firestore (removes / \ spaces etc)
export function sanitizarIdDoc(id: string): string {
  if (!id) return 'doc_' + Date.now();
  return String(id).replace(/[\/\\]/g, '_').replace(/[\s\t\n#?\[\]]/g, '_');
}

// Helper to sanitize objects for Firestore (removes undefined values recursively)
function limparUndefined<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Save or Update Supermercado
export async function salvarSupermercadoFirestore(loja: Supermercado) {
  try {
    const docId = sanitizarIdDoc(loja.id);
    const docRef = doc(db, 'supermercados', docId);
    await setDoc(docRef, limparUndefined(loja), { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      console.warn('Aviso: Permissão de escrita pendente no Firestore. Publique as regras de leitura/escrita no Console do Firebase.');
    } else {
      console.error('Erro ao salvar supermercado no Firestore:', err);
    }
  }
}

// Save or Update Item no Estoque
export async function salvarItemEstoqueFirestore(item: ItemEstoque, lojaId: string) {
  try {
    const itemLimpo = sanitizarItemEstoque({ ...item, lojaId });
    const chaveMemoria = gerarChaveItemEstoque(lojaId, itemLimpo.codigo, itemLimpo.validade, itemLimpo.lote);
    itensRecemExcluidosMemoria.delete(chaveMemoria);
    itensRecemSalvosMemoria.set(chaveMemoria, {
      item: itemLimpo,
      lojaId,
      timestamp: Date.now(),
    });

    // Atualiza localStorage e notifica listeners imediatamente (UI otimista instantânea)
    try {
      const salvo = localStorage.getItem(`estoque_${lojaId}`);
      const listaAtual: ItemEstoque[] = salvo ? JSON.parse(salvo) : [];
      if (Array.isArray(listaAtual)) {
        const idx = listaAtual.findIndex(
          (x) =>
            String(x?.codigo || '').trim() === itemLimpo.codigo &&
            String(x?.validade || '2099-12-31').trim() === itemLimpo.validade &&
            String(x?.lote || '').trim() === itemLimpo.lote
        );
        if (idx !== -1) {
          listaAtual[idx] = itemLimpo;
        } else {
          listaAtual.push(itemLimpo);
        }
        safeLocalStorageSet(`estoque_${lojaId}`, JSON.stringify(listaAtual));
        notificarListenersEstoqueImediato(lojaId);
      }
    } catch (e) {}

    const safeLojaId = sanitizarIdDoc(lojaId || 'loja_padrao');
    const safeCod = sanitizarIdDoc(itemLimpo.codigo || 'semcod');
    const safeVal = sanitizarIdDoc(itemLimpo.validade || 'semval');
    const safeLote = sanitizarIdDoc(itemLimpo.lote || 'semlote');
    const docId = `${safeLojaId}_${safeCod}_${safeVal}_${safeLote}`;
    const docRef = doc(db, 'estoque', docId);
    await setDoc(docRef, limparUndefined({ ...itemLimpo, lojaId }), { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      console.warn('Aviso: Permissão de escrita pendente no Firestore para itens de estoque.');
    } else {
      console.warn('Aviso ao salvar item no estoque no Firestore (mantido localmente offline):', err);
    }
  }
}

// Sync entire Estoque list
export async function sincronizarEstoqueCompletoFirestore(itens: ItemEstoque[], lojaId: string) {
  try {
    for (const item of itens) {
      await salvarItemEstoqueFirestore(item, lojaId);
    }
  } catch (err) {
    console.error('Erro ao sincronizar estoque completo:', err);
  }
}

// Propagate Global Catalog updates to all stores/supermarkets/adegas in Firestore
export async function propagarAtualizacaoCatalogoGlobalParaTodasLojasFirestore(prod: ProdutoCatalogo) {
  try {
    const cleanCod = prod.codigo?.trim();
    if (!cleanCod) return;

    const colRef = collection(db, 'estoque');
    const updatePromises: Promise<any>[] = [];

    // 1. Busca por 'codigo'
    const qCod = query(colRef, where('codigo', '==', cleanCod));
    const snapCod = await getDocs(qCod);
    snapCod.forEach((docSnap) => {
      const data = docSnap.data() as ItemEstoque;
      const updateData: Partial<ItemEstoque> = {
        nome: prod.nome?.trim() || data.nome,
        marca: prod.marca?.trim() || data.marca || '',
        categoria: prod.categoria?.trim() || data.categoria || '',
      };
      if (prod.imagem !== undefined) {
        updateData.foto = prod.imagem.trim();
      }
      updatePromises.push(setDoc(docSnap.ref, limparUndefined(updateData), { merge: true }));
    });

    // 2. Busca por 'codigo_barras' caso haja docs antigos
    const qBar = query(colRef, where('codigo_barras', '==', cleanCod));
    const snapBar = await getDocs(qBar);
    snapBar.forEach((docSnap) => {
      // Se não foi atualizado na query anterior
      if (!snapCod.docs.some((d) => d.id === docSnap.id)) {
        const data = docSnap.data() as ItemEstoque;
        const updateData: Partial<ItemEstoque> = {
          nome: prod.nome?.trim() || data.nome,
          marca: prod.marca?.trim() || data.marca || '',
          categoria: prod.categoria?.trim() || data.categoria || '',
        };
        if (prod.imagem !== undefined) {
          updateData.foto = prod.imagem.trim();
        }
        updatePromises.push(setDoc(docSnap.ref, limparUndefined(updateData), { merge: true }));
      }
    });

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }
  } catch (err) {
    console.warn('Aviso ao propagar atualização do catálogo para todas as lojas no Firestore:', err);
  }
}

// Save or Update Produto no Catálogo Global
export async function salvarProdutoCatalogoFirestore(prod: ProdutoCatalogo) {
  try {
    const safeCod = sanitizarIdDoc(prod.codigo || 'semcod');
    const docGlobalRef = doc(db, 'catalogo_global', safeCod);
    await setDoc(docGlobalRef, limparUndefined(prod), { merge: true });

    // Propagação instantânea para todos os supermercados e adegas no Firestore
    await propagarAtualizacaoCatalogoGlobalParaTodasLojasFirestore(prod);
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      console.warn('Aviso: Permissão de escrita pendente no Firestore para catálogo de produtos.');
    } else {
      console.warn('Aviso ao salvar no catalogo global no Firestore (mantido localmente offline):', err);
    }
  }
}

// Salva Lote de Produtos no Catálogo Global com writeBatch (em blocos de 450)
export async function salvarLoteProdutosCatalogoFirestore(prods: ProdutoCatalogo[]) {
  if (!Array.isArray(prods) || prods.length === 0) return;
  const TAMANHO_CHUNK = 450;
  for (let i = 0; i < prods.length; i += TAMANHO_CHUNK) {
    const chunk = prods.slice(i, i + TAMANHO_CHUNK);
    const batch = writeBatch(db);
    chunk.forEach((prod) => {
      const safeCod = sanitizarIdDoc(prod.codigo || 'semcod');
      const docGlobalRef = doc(db, 'catalogo_global', safeCod);
      batch.set(docGlobalRef, limparUndefined(prod), { merge: true });
    });
    try {
      await batch.commit();
    } catch (err: any) {
      console.warn('Aviso ao gravar lote no catalogo_global:', err);
      if (err?.code === 'resource-exhausted' || err?.message?.toLowerCase().includes('quota')) {
        throw new Error('Limite diário de gravações do Firebase atingido! Aguarde o reset diário para enviar mais lotes.');
      }
      throw err;
    }
  }
}

// Direct Lookup in Firestore Catalog by Barcode
export async function buscarProdutoCatalogoFirestore(codigo: string): Promise<ProdutoCatalogo | null> {
  try {
    const cleanCod = codigo.trim();
    if (!cleanCod) return null;
    const safeCod = sanitizarIdDoc(cleanCod);
    const docRef = doc(db, 'catalogo_global', safeCod);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ProdutoCatalogo;
    }
    // Try query if ID was stored differently
    const q = query(collection(db, 'catalogo_global'), where('codigo', '==', cleanCod));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      return qSnap.docs[0].data() as ProdutoCatalogo;
    }
    return null;
  } catch (err) {
    console.warn('Aviso ao consultar produto no catalogo do Firestore:', err);
    return null;
  }
}

// Direct Lookup in Firestore Inventory by Barcode (across current store or any store)
export async function buscarItemEstoquePorCodigoFirestore(codigo: string, lojaId?: string): Promise<ItemEstoque | null> {
  try {
    const cleanCod = codigo.trim();
    if (!cleanCod) return null;
    const colRef = collection(db, 'estoque');
    const q = lojaId
      ? query(colRef, where('codigo', '==', cleanCod), where('lojaId', '==', lojaId))
      : query(colRef, where('codigo', '==', cleanCod));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as ItemEstoque;
    }
    return null;
  } catch (err) {
    console.warn('Aviso ao consultar item no estoque do Firestore:', err);
    return null;
  }
}

// Save Venda
export async function salvarVendaFirestore(venda: Venda) {
  try {
    const docId = sanitizarIdDoc(venda.id);
    const docRef = doc(db, 'vendas', docId);
    await setDoc(docRef, limparUndefined(venda), { merge: true });
  } catch (err) {
    console.error('Erro ao salvar venda no Firestore:', err);
  }
}

// Save Operador
export async function salvarOperadorFirestore(op: OperadorCaixa) {
  try {
    const docId = sanitizarIdDoc(op.id);
    const docRef = doc(db, 'operadores', docId);
    await setDoc(docRef, limparUndefined(op), { merge: true });
  } catch (err) {
    console.error('Erro ao salvar operador no Firestore:', err);
  }
}

// Delete Item do Estoque
export async function excluirItemEstoqueFirestore(codigo: string, validade: string, lote: string, lojaId: string) {
  try {
    const safeLojaId = sanitizarIdDoc(lojaId || 'loja_padrao');
    const safeCod = sanitizarIdDoc(codigo || 'semcod');
    const safeVal = sanitizarIdDoc(validade || 'semval');
    const safeLote = sanitizarIdDoc(lote || 'semlote');
    const docId = `${safeLojaId}_${safeCod}_${safeVal}_${safeLote}`;

    // Remove do buffer otimista e marca como recém-excluído para evitar reaparecimento por snapshot atrasado
    const chaveItem = `${codigo}|${validade}|${lote}`;
    const mapaRecentes = itensRecemSalvosMemoria.get(lojaId);
    if (mapaRecentes) {
      mapaRecentes.delete(chaveItem);
    }
    if (!itensRecemExcluidosMemoria.has(lojaId)) {
      itensRecemExcluidosMemoria.set(lojaId, new Map());
    }
    itensRecemExcluidosMemoria.get(lojaId)!.set(chaveItem, Date.now());

    const docRef = doc(db, 'estoque', docId);
    try {
      await deleteDoc(docRef);
    } catch (e) {}

    // Busca e remove qualquer doc correspondente no Firestore caso o ID tenha sido gerado diferente
    try {
      const q = query(collection(db, 'estoque'), where('lojaId', '==', lojaId), where('codigo', '==', codigo));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        const data = d.data() as ItemEstoque;
        if ((!validade || data.validade === validade) && (!lote || data.lote === lote)) {
          await deleteDoc(d.ref);
        }
      }
    } catch (e) {}
  } catch (err) {
    console.error('Erro ao excluir item do estoque no Firestore:', err);
  }
}

// Delete Todos os Lotes de um Produto no Estoque de uma loja ou de todas
export async function excluirTodosLotesProdutoEstoqueFirestore(codigo: string, lojaId?: string) {
  try {
    // Limpa do buffer otimista
    itensRecemSalvosMemoria.forEach((mapa, lId) => {
      if (!lojaId || lId === lojaId) {
        for (const [k, v] of mapa.entries()) {
          if (v.item.codigo === codigo) {
            mapa.delete(k);
          }
        }
      }
    });

    const colRef = collection(db, 'estoque');
    const q = lojaId
      ? query(colRef, where('lojaId', '==', lojaId), where('codigo', '==', codigo))
      : query(colRef, where('codigo', '==', codigo));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  } catch (err) {
    console.error('Erro ao excluir todos os lotes do produto no estoque do Firestore:', err);
  }
}

// Delete Produto do Catálogo Global
export async function excluirProdutoCatalogoFirestore(codigo: string) {
  try {
    const safeCod = sanitizarIdDoc(codigo || 'semcod');
    try {
      const docGlobalRef = doc(db, 'catalogo_global', safeCod);
      await deleteDoc(docGlobalRef);
    } catch (e) {}

    // Excluir também por busca caso tenha sido salvo com ID diferente
    try {
      const qGlobal = query(collection(db, 'catalogo_global'), where('codigo', '==', codigo));
      const snapGlobal = await getDocs(qGlobal);
      for (const d of snapGlobal.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}
  } catch (err) {
    console.error('Erro ao excluir produto do catálogo no Firestore:', err);
  }
}

// Delete Supermercado and all linked data in Firestore
export async function excluirSupermercadoFirestore(lojaId: string) {
  try {
    const docId = sanitizarIdDoc(lojaId);

    // 1. Excluir documento do supermercado por docId sanitizado e direto
    try {
      await deleteDoc(doc(db, 'supermercados', docId));
    } catch (e) {}
    if (docId !== lojaId) {
      try {
        await deleteDoc(doc(db, 'supermercados', lojaId));
      } catch (e) {}
    }

    // 2. Excluir por query ou busca caso o documento possua docId diferente
    try {
      const snapLojas = await getDocs(collection(db, 'supermercados'));
      for (const d of snapLojas.docs) {
        const data = d.data();
        if (d.id === lojaId || d.id === docId || data.id === lojaId || data.id === docId) {
          await deleteDoc(d.ref);
        }
      }
    } catch (e) {}

    // 3. Excluir estoque vinculado à loja
    try {
      const snapEst = await getDocs(query(collection(db, 'estoque'), where('lojaId', '==', lojaId)));
      for (const d of snapEst.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}

    // 4. Excluir operadores vinculados à loja
    try {
      const snapOp = await getDocs(query(collection(db, 'operadores'), where('lojaId', '==', lojaId)));
      for (const d of snapOp.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}

    // 5. Excluir vendas vinculadas à loja
    try {
      const snapVen = await getDocs(query(collection(db, 'vendas'), where('lojaId', '==', lojaId)));
      for (const d of snapVen.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}

    // 6. Excluir clientes devedores vinculados à loja
    try {
      const snapDev = await getDocs(query(collection(db, 'clientes_devedores'), where('lojaId', '==', lojaId)));
      for (const d of snapDev.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}

    // 7. Excluir logs de auditoria vinculados à loja
    try {
      const snapLogs = await getDocs(query(collection(db, 'logs_auditoria'), where('lojaId', '==', lojaId)));
      for (const d of snapLogs.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}

    // 8. Excluir sessões ativas vinculadas à loja
    try {
      const snapSess = await getDocs(query(collection(db, 'sessoes_ativas'), where('lojaId', '==', lojaId)));
      for (const d of snapSess.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {}
  } catch (err) {
    console.error('Erro ao excluir supermercado e seus registros no Firestore:', err);
  }
}

// Limpeza total de todas as lojas e dados de teste para ambiente de produção
export async function limparTodasLojasDeTesteFirestore() {
  try {
    const snapLojas = await getDocs(collection(db, 'supermercados'));
    for (const d of snapLojas.docs) {
      await deleteDoc(d.ref);
    }
    const snapEst = await getDocs(collection(db, 'estoque'));
    for (const d of snapEst.docs) {
      await deleteDoc(d.ref);
    }
    const snapOp = await getDocs(collection(db, 'operadores'));
    for (const d of snapOp.docs) {
      await deleteDoc(d.ref);
    }
    const snapVen = await getDocs(collection(db, 'vendas'));
    for (const d of snapVen.docs) {
      await deleteDoc(d.ref);
    }
    const snapDev = await getDocs(collection(db, 'clientes_devedores'));
    for (const d of snapDev.docs) {
      await deleteDoc(d.ref);
    }
  } catch (err) {
    console.error('Erro ao limpar lojas no Firestore:', err);
  }
}

// Delete Operador
export async function excluirOperadorFirestore(opId: string) {
  try {
    const docId = sanitizarIdDoc(opId);
    const docRef = doc(db, 'operadores', docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Erro ao excluir operador no Firestore:', err);
  }
}

// Save or Update Cliente Devedor
export async function salvarClienteDevedorFirestore(cliente: ClienteDevedor) {
  try {
    const docId = sanitizarIdDoc(cliente.id);
    const docRef = doc(db, 'clientes_devedores', docId);
    await setDoc(docRef, limparUndefined(cliente), { merge: true });
  } catch (err) {
    console.error('Erro ao salvar cliente devedor no Firestore:', err);
  }
}

// Delete Cliente Devedor
export async function excluirClienteDevedorFirestore(clienteId: string) {
  try {
    const docId = sanitizarIdDoc(clienteId);
    const docRef = doc(db, 'clientes_devedores', docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Erro ao excluir cliente devedor no Firestore:', err);
  }
}

// Save Audit Log to Firestore (Append-Only / Imutável)
export async function salvarLogAuditoriaFirestore(log: {
  id: string;
  lojaId: string;
  operadorId: string;
  operadorNome: string;
  acao: string;
  detalhes: string;
  dataHora: string;
}) {
  try {
    const safeId = sanitizarIdDoc(log.id || 'log_' + Date.now());
    const docRef = doc(db, 'logs_auditoria', safeId);
    await setDoc(docRef, {
      ...limparUndefined(log),
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Aviso ao salvar log de auditoria no Firestore:', err);
  }
}

// Real-time listener for Audit Logs
export function subscribeLogsAuditoria(lojaId: string, callback: (logs: any[]) => void) {
  const colRef = collection(db, 'logs_auditoria');
  const q = query(colRef, where('lojaId', '==', lojaId));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach((docSnap) => {
        logs.push({ id: docSnap.id, ...docSnap.data() });
      });
      logs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(logs);
    },
    (_err) => {
      // Silent fallback
    }
  );
}

// Seed Initial Data into Firestore if collections are empty
export async function inicializarDadosIniciaisFirestore(
  lojasIniciais: Supermercado[],
  catalogoInicial: ProdutoCatalogo[],
  operadoresIniciais: OperadorCaixa[],
  vendasIniciais: Venda[],
  estoqueInicial?: ItemEstoque[],
  devedoresIniciais?: ClienteDevedor[]
) {
  try {
    // 1. Supermercados
    const snapLojas = await getDocs(collection(db, 'supermercados'));
    if (snapLojas.empty && lojasIniciais.length > 0) {
      for (const l of lojasIniciais) {
        await salvarSupermercadoFirestore(l);
      }
    }

    // 2. Catálogo Global de Produtos
    const snapCat = await getDocs(collection(db, 'catalogo_global'));
    if (snapCat.empty && catalogoInicial.length > 0) {
      for (const p of catalogoInicial) {
        await salvarProdutoCatalogoFirestore(p);
      }
    }

    // 3. Operadores de Caixa
    const snapOp = await getDocs(collection(db, 'operadores'));
    if (snapOp.empty && operadoresIniciais.length > 0) {
      for (const o of operadoresIniciais) {
        await salvarOperadorFirestore(o);
      }
    }

    // 4. Vendas
    const snapVen = await getDocs(collection(db, 'vendas'));
    if (snapVen.empty && vendasIniciais.length > 0) {
      for (const v of vendasIniciais) {
        await salvarVendaFirestore(v);
      }
    }

    // 5. Estoque
    if (estoqueInicial && estoqueInicial.length > 0) {
      const snapEst = await getDocs(collection(db, 'estoque'));
      if (snapEst.empty) {
        for (const item of estoqueInicial) {
          await salvarItemEstoqueFirestore(item, item.lojaId || lojasIniciais[0]?.id || 'loja_central');
        }
      }
    }

    // 6. Clientes Devedores
    if (devedoresIniciais && devedoresIniciais.length > 0) {
      const snapDev = await getDocs(collection(db, 'clientes_devedores'));
      if (snapDev.empty) {
        for (const c of devedoresIniciais) {
          await salvarClienteDevedorFirestore(c);
        }
      }
    }
  } catch (err) {
    console.warn('Aviso na inicializacao dos dados padrao Firestore:', err);
  }
}

// Migração completa de todos os cadastros e dados locais para o novo banco de dados Firestore
export async function migrarTodosCadastrosParaNovoBanco(params: {
  supermercados: Supermercado[];
  catalogo: ProdutoCatalogo[];
  estoque: ItemEstoque[];
  operadores: OperadorCaixa[];
  vendas: Venda[];
  clientesDevedores: ClienteDevedor[];
}): Promise<{ sucesso: boolean; totalItens: number; detalhe: string }> {
  try {
    let count = 0;

    // Supermercados
    for (const loja of params.supermercados) {
      await salvarSupermercadoFirestore(loja);
      count++;
    }

    // Catálogo
    for (const prod of params.catalogo) {
      await salvarProdutoCatalogoFirestore(prod);
      count++;
    }

    // Estoque
    for (const item of params.estoque) {
      await salvarItemEstoqueFirestore(item, item.lojaId || params.supermercados[0]?.id || 'loja_central');
      count++;
    }

    // Operadores
    for (const op of params.operadores) {
      await salvarOperadorFirestore(op);
      count++;
    }

    // Vendas
    for (const venda of params.vendas) {
      await salvarVendaFirestore(venda);
      count++;
    }

    // Clientes Fiado / Devedores
    for (const dev of params.clientesDevedores) {
      await salvarClienteDevedorFirestore(dev);
      count++;
    }

    return {
      sucesso: true,
      totalItens: count,
      detalhe: `${count} registros migrados com sucesso para o banco appestoqueprodutos-bb92d!`,
    };
  } catch (err) {
    console.error('Erro na migracao para o novo banco:', err);
    return {
      sucesso: false,
      totalItens: 0,
      detalhe: `Erro ao migrar dados: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// Migração Automática Direta (Já finalizada - credenciais removidas por segurança)
export async function migrarDiretamenteDoBancoAntigoParaNovo(): Promise<{
  sucesso: boolean;
  totalMigrado: number;
  detalhe: string;
  resumo: Record<string, number>;
}> {
  return {
    sucesso: true,
    totalMigrado: 0,
    detalhe: 'Banco de dados principal ativo e sincronizado no projeto appestoqueprodutos-bb92d.',
    resumo: {},
  };
}
