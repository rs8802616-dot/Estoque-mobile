/**
 * Retorna a data no fuso horário LOCAL do aparelho no formato YYYY-MM-DD.
 * Evita o bug de `new Date().toISOString().slice(0, 10)` que no Brasil (UTC-3)
 * avança para o dia seguinte a partir das 21:00.
 */
export function obterDataLocalISO(data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Converte data ISO (YYYY-MM-DD) para DD/MM/YYYY sem deslocamento de fuso.
 */
export function formatarDataIsoParaBr(dataIso?: string): string {
  if (!dataIso) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) {
    return dataIso.split('-').reverse().join('/');
  }
  return dataIso;
}
