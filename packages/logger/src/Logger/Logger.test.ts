import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLogger } from './Logger';

describe('Logger', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('buffers log entries without immediately posting to BFF', () => {
    const logger = createLogger('svc', '1.0.0');
    logger.info('Hello');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('flushes automatically after 2 seconds', async () => {
    const logger = createLogger('svc', '1.0.0');
    logger.info('Scheduled flush');
    expect(mockFetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/logs',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('flushes immediately after 10 buffered entries', async () => {
    const logger = createLogger('svc', '1.0.0');

    for (let i = 0; i < 10; i++) {
      logger.info(`message ${i}`);
    }

    // Flush is async — let microtasks settle
    await Promise.resolve();

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('sends correct JSON payload to /api/logs', async () => {
    const logger = createLogger('my-service', '2.0.0');
    logger.warn('Watch out', { code: 42 });
    await logger.flush();

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/logs');
    const body = JSON.parse(init.body as string) as {
      entries: { level: string; message: string; service: string }[];
    };
    expect(body.entries[0]).toMatchObject({
      service: 'my-service',
      version: '2.0.0',
      level: 'warn',
      message: 'Watch out',
      data: { code: 42 },
    });
  });

  it('propagates traceId in log entries when set', async () => {
    const logger = createLogger('svc', '1.0.0');
    logger.setTraceId('trace-abc-123');
    logger.error('Something failed');
    await logger.flush();

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { entries: { traceId?: string }[] };
    expect(body.entries[0]?.traceId).toBe('trace-abc-123');
  });

  it('does not include traceId when not set', async () => {
    const logger = createLogger('svc', '1.0.0');
    logger.info('No trace');
    await logger.flush();

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { entries: { traceId?: string }[] };
    expect(body.entries[0]?.traceId).toBeUndefined();
  });

  it('falls back gracefully when BFF is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const logger = createLogger('svc', '1.0.0');
    logger.info('Will fail to send');

    await expect(logger.flush()).resolves.toBeUndefined();
  });

  it('clears buffer after flush so entries are not re-sent', async () => {
    const logger = createLogger('svc', '1.0.0');
    logger.info('First message');
    await logger.flush();
    await logger.flush(); // second flush — buffer is empty

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('includes timestamp in ISO format', async () => {
    const logger = createLogger('svc', '1.0.0');
    logger.debug('ts test');
    await logger.flush();

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { entries: { timestamp: string }[] };
    expect(body.entries[0]?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
