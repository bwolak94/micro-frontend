import { TypedEventBus } from './TypedEventBus/TypedEventBus';

import type { EventMap } from '@portfolio/shared-types';

export { TypedEventBus } from './TypedEventBus/TypedEventBus';
export type { UnsubscribeFn } from './TypedEventBus/TypedEventBus.types';

/** Singleton event bus instance typed with the application EventMap. */
export const eventBus = new TypedEventBus<EventMap>();
