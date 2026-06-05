import { eventBus } from '@portfolio/event-bus';
import { onUnmounted } from 'vue';

import type { EventHandler, UseEventBusReturn } from './useEventBus.types';
import type { EventMap } from '@portfolio/shared-types';

export function useEventBus(): UseEventBusReturn {
  const subscriptions: Array<() => void> = [];

  function on<K extends keyof EventMap>(event: K, handler: EventHandler<K>): () => void {
    const unsubscribe = eventBus.on(event, handler);
    subscriptions.push(unsubscribe);
    return unsubscribe;
  }

  function emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    eventBus.emit(event, data);
  }

  onUnmounted(() => {
    subscriptions.forEach((unsub) => unsub());
    subscriptions.length = 0;
  });

  return { on, emit };
}
