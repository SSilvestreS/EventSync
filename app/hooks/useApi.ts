'use client';

import { useState, useCallback, useRef } from 'react';
import { ApiResponse, UseApiOptions, UseApiReturn } from '../types';

/**
 * Hook personalizado para gerenciar chamadas de API
 */
export function useApi<T = any>(
  baseUrl: string = '/api',
  defaultOptions: Partial<UseApiOptions> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (options: UseApiOptions = {}) => {
    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cria novo controller para esta requisição
    abortControllerRef.current = new AbortController();
    
    const {
      method = 'GET',
      headers = {},
      body,
      onSuccess,
      onError
    } = { ...defaultOptions, ...options };

    try {
      setLoading(true);
      setError(null);

      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: abortControllerRef.current.signal,
      };

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(`${baseUrl}${options.url || ''}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();

      if (result.success) {
        setData(result.data);
        onSuccess?.(result.data);
      } else {
        throw new Error(result.error || 'Erro na requisição');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Requisição foi cancelada, não faz nada
        return;
      }

      const errorMessage = err.message || 'Erro desconhecido';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, defaultOptions]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook para requisições GET
 */
export function useGet<T = any>(url: string, options?: Partial<UseApiOptions>) {
  const api = useApi<T>();
  
  const fetchData = useCallback(async () => {
    await api.execute({ method: 'GET', url, ...options });
  }, [api, url, options]);

  return {
    ...api,
    fetchData,
  };
}

/**
 * Hook para requisições POST
 */
export function usePost<T = any>(url: string, options?: Partial<UseApiOptions>) {
  const api = useApi<T>();
  
  const postData = useCallback(async (body: any) => {
    await api.execute({ method: 'POST', url, body, ...options });
  }, [api, url, options]);

  return {
    ...api,
    postData,
  };
}

/**
 * Hook para requisições PUT
 */
export function usePut<T = any>(url: string, options?: Partial<UseApiOptions>) {
  const api = useApi<T>();
  
  const putData = useCallback(async (body: any) => {
    await api.execute({ method: 'PUT', url, body, ...options });
  }, [api, url, options]);

  return {
    ...api,
    putData,
  };
}

/**
 * Hook para requisições DELETE
 */
export function useDelete<T = any>(url: string, options?: Partial<UseApiOptions>) {
  const api = useApi<T>();
  
  const deleteData = useCallback(async () => {
    await api.execute({ method: 'DELETE', url, ...options });
  }, [api, url, options]);

  return {
    ...api,
    deleteData,
  };
}

/**
 * Hook para requisições com cache
 */
export function useApiWithCache<T = any>(
  url: string,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000 // 5 minutos
) {
  const [cachedData, setCachedData] = useState<T | null>(null);
  const api = useApi<T>();

  const fetchWithCache = useCallback(async () => {
    // Verifica cache primeiro
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        setCachedData(data);
        return;
      }
    }

    // Se não há cache válido, faz a requisição
    await api.execute({ method: 'GET', url });
    
    // Salva no cache
    if (api.data) {
      const cacheData = {
        data: api.data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      setCachedData(api.data);
    }
  }, [api, url, cacheKey, ttl]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
    setCachedData(null);
  }, [cacheKey]);

  return {
    ...api,
    data: cachedData || api.data,
    fetchWithCache,
    clearCache,
  };
}
