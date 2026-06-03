import type { LogBatchPayload, LogEntry, LogLevel, Logger } from './Logger.types';

const FLUSH_INTERVAL_MS = 2000;
const FLUSH_BATCH_SIZE = 10;

export function createLogger(service: string, version: string): Logger {
  const buffer: LogEntry[] = [];
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let traceId: string | undefined;

  // import.meta.env.DEV is injected at build time (false in tests and production)
  const isDev = import.meta.env.DEV === true;

  function scheduleFlush(): void {
    if (flushTimer !== null) return;
    flushTimer = setTimeout(() => {
      void flush();
    }, FLUSH_INTERVAL_MS);
  }

  async function flush(): Promise<void> {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (buffer.length === 0) return;

    const batch = buffer.splice(0);
    const payload: LogBatchPayload = { entries: batch };

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
    } catch {
      // BFF unreachable — entries already logged to console in dev mode
    }
  }

  function log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      service,
      version,
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(traceId !== undefined && { traceId }),
      ...(data !== undefined && { data }),
    };

    if (isDev) {
      const prefix = `[${service}]`;
      switch (level) {
        case 'debug':
          console.log(prefix, message, data ?? '');
          break;
        case 'info':
          console.info(prefix, message, data ?? '');
          break;
        case 'warn':
          console.warn(prefix, message, data ?? '');
          break;
        case 'error':
          console.error(prefix, message, data ?? '');
          break;
      }
    }

    buffer.push(entry);

    if (buffer.length >= FLUSH_BATCH_SIZE) {
      void flush();
    } else {
      scheduleFlush();
    }
  }

  return {
    debug: (message, data) => log('debug', message, data),
    info: (message, data) => log('info', message, data),
    warn: (message, data) => log('warn', message, data),
    error: (message, data) => log('error', message, data),
    setTraceId: (id) => {
      traceId = id;
    },
    flush,
  };
}
