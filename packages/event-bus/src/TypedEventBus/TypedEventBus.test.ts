import { describe, expect, it, vi } from 'vitest';

import { TypedEventBus } from './TypedEventBus';

interface TestEventMap {
  'user:created': { id: string; name: string };
  'session:ended': undefined;
  'counter:incremented': { value: number };
}

describe('TypedEventBus', () => {
  it('delivers payload to registered handler', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handler = vi.fn();

    bus.on('user:created', handler);
    bus.emit('user:created', { id: '1', name: 'Alice' });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ id: '1', name: 'Alice' });
  });

  it('delivers undefined payload for events typed as undefined', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handler = vi.fn();

    bus.on('session:ended', handler);
    bus.emit('session:ended', undefined);

    expect(handler).toHaveBeenCalledOnce();
  });

  it('notifies multiple handlers registered on the same event', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    bus.on('counter:incremented', handlerA);
    bus.on('counter:incremented', handlerB);
    bus.emit('counter:incremented', { value: 42 });

    expect(handlerA).toHaveBeenCalledWith({ value: 42 });
    expect(handlerB).toHaveBeenCalledWith({ value: 42 });
  });

  it('does not call handler after unsubscribe', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handler = vi.fn();

    const unsubscribe = bus.on('user:created', handler);
    unsubscribe();
    bus.emit('user:created', { id: '2', name: 'Bob' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('only removes the specific handler on unsubscribe', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    const unsubscribeA = bus.on('user:created', handlerA);
    bus.on('user:created', handlerB);

    unsubscribeA();
    bus.emit('user:created', { id: '3', name: 'Carol' });

    expect(handlerA).not.toHaveBeenCalled();
    expect(handlerB).toHaveBeenCalledOnce();
  });

  it('handlers on different events are independent', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const userHandler = vi.fn();
    const sessionHandler = vi.fn();

    bus.on('user:created', userHandler);
    bus.on('session:ended', sessionHandler);
    bus.emit('user:created', { id: '1', name: 'Alice' });

    expect(userHandler).toHaveBeenCalledOnce();
    expect(sessionHandler).not.toHaveBeenCalled();
  });

  it('supports emitting the same event multiple times', () => {
    const bus = new TypedEventBus<TestEventMap>();
    const handler = vi.fn();

    bus.on('counter:incremented', handler);
    bus.emit('counter:incremented', { value: 1 });
    bus.emit('counter:incremented', { value: 2 });
    bus.emit('counter:incremented', { value: 3 });

    expect(handler).toHaveBeenCalledTimes(3);
    expect(handler).toHaveBeenLastCalledWith({ value: 3 });
  });
});
