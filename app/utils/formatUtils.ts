/**
 * Utilitários para formatação de dados
 */
const formatUtils = {
  /**
   * Formata um valor monetário
   */
  formatCurrency: (value: number, currency: string = 'BRL', locale: string = 'pt-BR'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  },

  /**
   * Formata um número
   */
  formatNumber: (value: number, locale: string = 'pt-BR'): string => {
    return new Intl.NumberFormat(locale).format(value);
  },

  /**
   * Formata um percentual
   */
  formatPercentage: (value: number, locale: string = 'pt-BR'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  },

  /**
   * Formata um tamanho de arquivo
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Formata um número de telefone
   */
  formatPhone: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  },

  /**
   * Formata um CPF
   */
  formatCPF: (cpf: string): string => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  /**
   * Formata um CNPJ
   */
  formatCNPJ: (cnpj: string): string => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
};

export default formatUtils;
