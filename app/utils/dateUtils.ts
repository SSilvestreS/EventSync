import { format, formatDistance, parseISO } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

/**
 * Utilitários para manipulação de datas
 */
const dateUtils = {
  /**
   * Formata uma data para o formato especificado
   */
  format: (date: Date | string, formatStr: string, locale: string = 'pt-BR'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const localeObj = getDateLocale(locale);
    return format(dateObj, formatStr, { locale: localeObj });
  },

  /**
   * Formata uma data para o formato relativo (ex: "há 2 horas")
   */
  formatRelative: (date: Date | string, locale: string = 'pt-BR'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const localeObj = getDateLocale(locale);
    return formatDistance(dateObj, new Date(), { locale: localeObj, addSuffix: true });
  },

  /**
   * Verifica se uma data é válida
   */
  isValid: (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Adiciona dias a uma data
   */
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Calcula a diferença em dias entre duas datas
   */
  diffInDays: (date1: Date, date2: Date): number => {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
};

// Função auxiliar para obter locale de data
function getDateLocale(locale: string) {
  switch (locale) {
    case 'pt-BR':
      return ptBR;
    case 'en-US':
      return enUS;
    case 'es-ES':
      return es;
    default:
      return ptBR;
  }
}

export default dateUtils;
