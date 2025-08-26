/**
 * Utilitários para manipulação de objetos
 */
const objectUtils = {
  /**
   * Remove propriedades undefined/null de um objeto
   */
  clean: <T extends Record<string, any>>(obj: T): Partial<T> => {
    const cleaned: Partial<T> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleaned[key as keyof T] = value;
      }
    });
    return cleaned;
  },

  /**
   * Faz merge de objetos
   */
  merge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    return sources.reduce((result, source) => {
      Object.entries(source).forEach(([key, value]) => {
        if (value !== undefined) {
          result[key as keyof T] = value;
        }
      });
      return result;
    }, { ...target });
  },

  /**
   * Verifica se um objeto está vazio
   */
  isEmpty: (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  },

  /**
   * Obtém um valor aninhado de um objeto
   */
  get: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  },

  /**
   * Define um valor aninhado em um objeto
   */
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
};

export default objectUtils;
