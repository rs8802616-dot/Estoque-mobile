/**
 * Utilitários de Máscara e Validação de Formato para Campos Numéricos:
 * - Telefone / Celular / WhatsApp: (00) 0000-0000 ou (00) 90000-0000
 * - CPF: 000.000.000-00
 * - CNPJ: 00.000.000/0000-00
 * - CPF/CNPJ Dinâmico: formata como CPF até 11 dígitos e como CNPJ acima de 11 dígitos
 */

/**
 * Remove tudo que não for dígito numérico (0-9).
 */
export function apenasNumeros(valor: string): string {
  return (valor || '').replace(/\D/g, '');
}

/**
 * Máscara para Telefone, Celular e WhatsApp:
 * Aceita SOMENTE números e formata dinamicamente:
 * - Até 10 dígitos: (XX) XXXX-XXXX
 * - Com 11 dígitos: (XX) XXXXX-XXXX
 */
export function mascaraTelefone(valor: string): string {
  const d = apenasNumeros(valor).slice(0, 11);
  if (!d) return '';
  if (d.length <= 2) {
    return `(${d}`;
  }
  if (d.length <= 6) {
    return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  }
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

/**
 * Máscara para CPF:
 * Aceita SOMENTE números e formata como 000.000.000-00 (máximo 11 dígitos).
 */
export function mascaraCpf(valor: string): string {
  const d = apenasNumeros(valor).slice(0, 11);
  if (!d) return '';
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

/**
 * Máscara para CNPJ:
 * Aceita SOMENTE números e formata como 00.000.000/0000-00 (máximo 14 dígitos).
 */
export function mascaraCnpj(valor: string): string {
  const d = apenasNumeros(valor).slice(0, 14);
  if (!d) return '';
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

/**
 * Máscara Dinâmica CPF ou CNPJ:
 * Aceita SOMENTE números:
 * - Até 11 dígitos: formata automaticamente como CPF (000.000.000-00)
 * - De 12 a 14 dígitos: converte automaticamente para CNPJ (00.000.000/0000-00)
 */
export function mascaraCpfCnpj(valor: string): string {
  const d = apenasNumeros(valor).slice(0, 14);
  if (!d) return '';
  if (d.length <= 11) {
    return mascaraCpf(d);
  }
  return mascaraCnpj(d);
}
