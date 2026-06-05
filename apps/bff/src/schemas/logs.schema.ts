import { z } from 'zod';

export const logEntrySchema = z.object({
  service: z.string(),
  version: z.string(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  timestamp: z.string(),
  traceId: z.string().optional(),
  data: z.unknown().optional(),
});

export const logBatchBodySchema = z.object({
  entries: z.array(logEntrySchema).min(1).max(100),
});

export type LogEntry = z.infer<typeof logEntrySchema>;
export type LogBatchBody = z.infer<typeof logBatchBodySchema>;
