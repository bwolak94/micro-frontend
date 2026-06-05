import type { EventMap } from '@portfolio/shared-types';

export type EventHandler<K extends keyof EventMap> = (data: EventMap[K]) => void;

export interface UseEventBusReturn {
  readonly on: <K extends keyof EventMap>(event: K, handler: EventHandler<K>) => () => void;
  readonly emit: <K extends keyof EventMap>(event: K, data: EventMap[K]) => void;
}
