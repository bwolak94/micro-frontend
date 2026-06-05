import { ApiRequestError } from './ApiClient.types';

import type { ApiClientConfig } from './ApiClient.types';
import type { ApiError } from '@portfolio/shared-types';

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, getToken } = config;
  let traceId: string | undefined;

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers as HeadersInit | undefined);

    if (init.method !== 'GET' && init.method !== undefined) {
      headers.set('Content-Type', 'application/json');
    }

    const token = getToken?.();
    if (token !== null && token !== undefined) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (traceId !== undefined) {
      headers.set('x-trace-id', traceId);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });

    // Propagate traceId from response headers
    const responseTraceId =
      response.headers.get('traceparent') ?? response.headers.get('x-trace-id');
    if (responseTraceId !== null) {
      traceId = responseTraceId;
    }

    if (!response.ok) {
      const body = (await response.json()) as ApiError;
      throw new ApiRequestError(body.message, body.statusCode, body.error);
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
    setTraceId: (id: string): void => {
      traceId = id;
    },
  } as const;
}

export type ApiClient = ReturnType<typeof createApiClient>;
