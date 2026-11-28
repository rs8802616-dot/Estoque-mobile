// Utilities for currency, date and number formatting

function parseDateSafe(isoString?: string | number): Date | null {
  if (isoString === undefined || isoString === null || isoString === '' || isoString === 0) {
    return null;
  }

  if (typeof isoString === 'number') {
    if (!Number.isFinite(isoString) || isoString <= 0) return null;
    const d = new Date(isoString);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const texto = String(isoString).trim();
  if (!texto) return null;

  const matchIsoPuro = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (matchIsoPuro) {
    const ano = Number(matchIsoPuro[1]);
    const mes = Number(matchIsoPuro[2]);
    const dia = Number(matchIsoPuro[3]);
    const d = new Date(ano, mes - 1, dia, 12, 0, 0);
    if (d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia) {
      return d;
    }
    return null;
  }

  const matchBrPuro = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (matchBrPuro) {
    const dia = Number(matchBrPuro[1]);
    const mes = Number(matchBrPuro[2]);
    const ano = Number(matchBrPuro[3]);
    const d = new Date(ano, mes - 1, dia, 12, 0, 0);
    if (d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia) {
      return d;
    }
    return null;
  }

  const d = new Date(texto);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatTime(isoString?: string | number): string {
  const d = parseDateSafe(isoString);
  if (!d) return '--:--';
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString?: string | number): string {
  const d = parseDateSafe(isoString);
  if (!d) return '--/--/----';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(isoString?: string | number): string {
  const d = parseDateSafe(isoString);
  if (!d) return '--/--/---- --:--';
  return `${formatDate(isoString)} às ${formatTime(isoString)}`;
}

export function getElapsedMinutes(isoString?: string | number): number {
  const d = parseDateSafe(isoString);
  if (!d) return 0;
  const now = Date.now();
  return Math.max(0, Math.floor((now - d.getTime()) / 60000));
}
