export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  readonly service: string;
  readonly version: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly traceId?: string;
  readonly data?: unknown;
}

export interface LogBatchPayload {
  readonly entries: readonly LogEntry[];
}

export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
  setTraceId(traceId: string): void;
  flush(): Promise<void>;
}
