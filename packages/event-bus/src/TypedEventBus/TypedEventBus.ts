import type { UnsubscribeFn } from './TypedEventBus.types';

/**
 * Type-safe event bus backed by native EventTarget.
 * Generic over a map of event names to payload types.
 */
export class TypedEventBus<TMap extends Record<string, unknown>> {
  private readonly _target = new EventTarget();

  emit<K extends keyof TMap & string>(event: K, payload: TMap[K]): void {
    this._target.dispatchEvent(
      new CustomEvent(event, { detail: payload } as CustomEventInit<TMap[K]>),
    );
  }

  on<K extends keyof TMap & string>(event: K, handler: (payload: TMap[K]) => void): UnsubscribeFn {
    const listener = (e: Event): void => {
      handler((e as CustomEvent<TMap[K]>).detail);
    };
    this._target.addEventListener(event, listener);
    return () => this._target.removeEventListener(event, listener);
  }
}
