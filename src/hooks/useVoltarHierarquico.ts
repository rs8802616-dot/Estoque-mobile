import { useEffect, useRef } from 'react';

interface EntradaVoltar {
  id: number;
  handler: () => void;
}

const pilhaVoltar: EntradaVoltar[] = [];
let proximoId = 1;
let listenersInstalados = false;
let rearmarTimerId: number | null = null;
let limpandoSentinela = false;

function cancelarRearmePendente() {
  if (rearmarTimerId !== null && typeof window !== 'undefined') {
    window.clearTimeout(rearmarTimerId);
    rearmarTimerId = null;
  }
}

function garantirSentinelaHistorico() {
  if (typeof window === 'undefined' || !window.history) return;
  if (pilhaVoltar.length === 0) return;
  try {
    if (!window.history.state?.__emBackSentinel) {
      const estadoBase =
        window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {};
      window.history.pushState(
        { ...estadoBase, __emBackSentinel: true },
        '',
        window.location.href
      );
    }
  } catch {
    // Ignora caso o ambiente bloqueie pushState
  }
}

function removerSentinelaHistoricoSeVazia() {
  if (typeof window === 'undefined' || !window.history) return;
  if (pilhaVoltar.length > 0) return;
  cancelarRearmePendente();
  try {
    if (window.history.state?.__emBackSentinel) {
      limpandoSentinela = true;
      window.history.back();
      window.setTimeout(() => {
        limpandoSentinela = false;
      }, 150);
    }
  } catch {
    limpandoSentinela = false;
  }
}

function instalarListenersGlobais() {
  if (listenersInstalados || typeof window === 'undefined') return;
  listenersInstalados = true;

  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || pilhaVoltar.length === 0) return;
      const topo = pilhaVoltar[pilhaVoltar.length - 1];
      if (!topo) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      topo.handler();
    },
    true
  );

  window.addEventListener('popstate', () => {
    if (limpandoSentinela) {
      limpandoSentinela = false;
      return;
    }
    if (pilhaVoltar.length === 0) return;
    const topo = pilhaVoltar[pilhaVoltar.length - 1];
    if (!topo) return;
    topo.handler();
    cancelarRearmePendente();
    rearmarTimerId = window.setTimeout(() => {
      rearmarTimerId = null;
      if (pilhaVoltar.length > 0) {
        garantirSentinelaHistorico();
      }
    }, 0);
  });
}

/**
 * Gerencia o retorno hierárquico em 1 nível via tecla ESC e botão Voltar do navegador/celular.
 * Deve ser sempre invocado no topo do componente (antes de qualquer `return null`).
 */
export function useVoltarHierarquico(ativo: boolean, onVoltar: () => void): void {
  const handlerRef = useRef(onVoltar);
  handlerRef.current = onVoltar;

  useEffect(() => {
    if (!ativo) return;
    instalarListenersGlobais();

    cancelarRearmePendente();
    const id = proximoId++;
    const entrada: EntradaVoltar = {
      id,
      handler: () => handlerRef.current(),
    };

    pilhaVoltar.push(entrada);
    garantirSentinelaHistorico();

    return () => {
      const idx = pilhaVoltar.findIndex((item) => item.id === id);
      if (idx !== -1) {
        pilhaVoltar.splice(idx, 1);
      }
      if (pilhaVoltar.length === 0) {
        removerSentinelaHistoricoSeVazia();
      }
    };
  }, [ativo]);
}
