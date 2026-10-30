import { ConfiguracaoDelivery } from '../types';

export interface StatusHorarioDelivery {
  aberta: boolean;
  motivo?: string;
  horarioFormatado: string;
}

/**
 * Verifica se a loja está aberta para delivery considerando:
 * 1. O botão manual ativo (Ligar/Desligar)
 * 2. O horário de início e término configurado (ex: 08:00 às 23:00 ou 18:00 às 02:00)
 */
export function verificarStatusFuncionamentoDelivery(
  config?: ConfiguracaoDelivery | null
): StatusHorarioDelivery {
  if (!config) {
    return {
      aberta: true,
      horarioFormatado: '08:00 às 23:00',
    };
  }

  const inicio = config.horarioAbertura || '08:00';
  const fim = config.horarioFechamento || '23:00';
  const horarioFormatado = `${inicio} às ${fim}`;

  // Se a loja foi desligada manualmente no botão Ligar/Desligar
  if (config.ativo === false) {
    return {
      aberta: false,
      motivo: 'A loja está temporariamente fechada para pedidos delivery no momento.',
      horarioFormatado,
    };
  }

  // Verifica horário atual local (HH:MM)
  const agora = new Date();
  const horaMinutoAtual = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  let dentroDoHorario = false;
  if (inicio <= fim) {
    // Horário normal no mesmo dia (ex: 08:00 às 23:00)
    dentroDoHorario = horaMinutoAtual >= inicio && horaMinutoAtual <= fim;
  } else {
    // Horário que cruza a meia-noite (ex: 18:00 às 02:00)
    dentroDoHorario = horaMinutoAtual >= inicio || horaMinutoAtual <= fim;
  }

  if (!dentroDoHorario) {
    return {
      aberta: false,
      motivo: `Nosso delivery funciona das ${inicio} às ${fim}. No momento estamos fora do horário de atendimento.`,
      horarioFormatado,
    };
  }

  return {
    aberta: true,
    horarioFormatado,
  };
}
