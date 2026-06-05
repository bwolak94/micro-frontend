import { eventBus } from '@portfolio/event-bus';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useEventBus } from './useEventBus';

function withSetup<T>(setup: () => T) {
  let result!: T;
  const Wrapper = defineComponent({
    setup() {
      result = setup();
      return {};
    },
    template: '<div />',
  });
  const wrapper = mount(Wrapper);
  return { result, wrapper };
}

describe('useEventBus', () => {
  it('calls handler when matching event is emitted', () => {
    const handler = vi.fn();
    const { result } = withSetup(() => useEventBus());
    result.on('product:updated', handler);

    eventBus.emit('product:updated', { id: 'p1' });

    expect(handler).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('does not call handler after manual unsubscribe', () => {
    const handler = vi.fn();
    const { result } = withSetup(() => useEventBus());
    const unsubscribe = result.on('product:updated', handler);

    unsubscribe();
    eventBus.emit('product:updated', { id: 'p1' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('unsubscribes all handlers on component unmount', () => {
    const handler = vi.fn();
    const { result, wrapper } = withSetup(() => useEventBus());
    result.on('product:updated', handler);

    wrapper.unmount();
    eventBus.emit('product:updated', { id: 'p1' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('emits an event via the shared event bus', () => {
    const externalHandler = vi.fn();
    const unsub = eventBus.on('product:created', externalHandler);

    const { result } = withSetup(() => useEventBus());
    result.emit('product:created', { id: 'p2' });

    expect(externalHandler).toHaveBeenCalledWith({ id: 'p2' });
    unsub();
  });
});
