/**
 * Utilitários para manipulação de URLs
 */
const urlUtils = {
  /**
   * Adiciona parâmetros a uma URL
   */
  addParams: (url: string, params: Record<string, any>): string => {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.set(key, String(value));
      }
    });
    return urlObj.toString();
  },

  /**
   * Remove parâmetros de uma URL
   */
  removeParams: (url: string, params: string[]): string => {
    const urlObj = new URL(url);
    params.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  },

  /**
   * Obtém parâmetros de uma URL
   */
  getParams: (url: string): Record<string, string> => {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },

  /**
   * Verifica se uma URL é válida
   */
  isValid: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

export default urlUtils;
