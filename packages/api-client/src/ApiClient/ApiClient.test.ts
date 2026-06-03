import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from './ApiClient';
import { ApiRequestError } from './ApiClient.types';

const BASE_URL = 'http://localhost:4000';

describe('ApiClient', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  function makeOkResponse(data: unknown, headers?: Record<string, string>) {
    return {
      ok: true,
      headers: new Headers(headers),
      json: () => Promise.resolve(data),
    };
  }

  function makeErrorResponse(status: number, body: unknown) {
    return {
      ok: false,
      status,
      headers: new Headers(),
      json: () => Promise.resolve(body),
    };
  }

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('makes GET request to correct URL', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ id: '1' }));
    const client = createApiClient({ baseUrl: BASE_URL });

    await client.get('/products');

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/products`,
      expect.objectContaining({ method: 'GET', credentials: 'include' }),
    );
  });

  it('makes POST request with JSON body', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ id: '2' }));
    const client = createApiClient({ baseUrl: BASE_URL });

    await client.post('/products', { name: 'Widget' });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'Widget' });
  });

  it('attaches Authorization header when token provider returns a token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({}));
    const client = createApiClient({ baseUrl: BASE_URL, getToken: () => 'my-token' });

    await client.get('/protected');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers as HeadersInit);
    expect(headers.get('Authorization')).toBe('Bearer my-token');
  });

  it('does not attach Authorization header when token is null', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({}));
    const client = createApiClient({ baseUrl: BASE_URL, getToken: () => null });

    await client.get('/public');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers as HeadersInit);
    expect(headers.get('Authorization')).toBeNull();
  });

  it('injects x-trace-id header after setTraceId is called', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({}));
    const client = createApiClient({ baseUrl: BASE_URL });
    client.setTraceId('trace-xyz');

    await client.get('/items');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers as HeadersInit);
    expect(headers.get('x-trace-id')).toBe('trace-xyz');
  });

  it('captures traceId from response x-trace-id header', async () => {
    mockFetch
      .mockResolvedValueOnce(makeOkResponse({}, { 'x-trace-id': 'resp-trace-1' }))
      .mockResolvedValueOnce(makeOkResponse({}));

    const client = createApiClient({ baseUrl: BASE_URL });
    await client.get('/first');
    await client.get('/second');

    const [, secondInit] = mockFetch.mock.calls[1] as [string, RequestInit];
    const headers = new Headers(secondInit.headers as HeadersInit);
    expect(headers.get('x-trace-id')).toBe('resp-trace-1');
  });

  it('throws ApiRequestError with statusCode and message on non-ok response', async () => {
    mockFetch.mockResolvedValue(
      makeErrorResponse(404, { statusCode: 404, message: 'Not found', error: 'Not Found' }),
    );
    const client = createApiClient({ baseUrl: BASE_URL });

    await expect(client.get('/missing')).rejects.toSatisfy(
      (e: unknown) =>
        e instanceof ApiRequestError && e.statusCode === 404 && e.message === 'Not found',
    );
  });

  it('PUT, PATCH, DELETE methods make correct HTTP requests', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({}));
    const client = createApiClient({ baseUrl: BASE_URL });

    await client.put('/items/1', { name: 'Updated' });
    await client.patch('/items/2', { stock: 5 });
    await client.delete('/items/3');

    const methods = (mockFetch.mock.calls as [string, RequestInit][]).map(([, i]) => i.method);
    expect(methods).toEqual(['PUT', 'PATCH', 'DELETE']);
  });
});
