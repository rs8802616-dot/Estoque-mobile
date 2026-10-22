// Utilities for currency, date and number formatting

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatTime(isoString?: string | number): string {
  if (!isoString) return '--:--';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '--:--';
  }
}

export function formatDate(isoString?: string | number): string {
  if (!isoString) return '--/--/----';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '--/--/----';
  }
}

export function formatDateTime(isoString?: string | number): string {
  if (!isoString) return '--/--/---- --:--';
  try {
    const d = new Date(isoString);
    return `${formatDate(isoString)} às ${formatTime(isoString)}`;
  } catch {
    return '--/--/---- --:--';
  }
}

export function getElapsedMinutes(isoString?: string | number): number {
  if (!isoString) return 0;
  const start = new Date(isoString).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 60000));
}
