import { describe, expect, test, vi } from 'vitest';

import { createSyncEffectTracker } from './effect-tracker';

describe('createSyncEffectTracker', () => {
  test('does nothing if dispatch is called without a scope', () => {
    const { dispatch } = createSyncEffectTracker<string>();
    expect(() => dispatch('test')).not.toThrow(); // silent no-op
  });

  test("calls the current scope's onDispatch when dispatch is called", () => {
    const { createScope, dispatch } = createSyncEffectTracker<string>();
    const handler = vi.fn();

    createScope(handler)(() => {
      dispatch('hello');
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('hello');
  });

  test('dispatch only reaches the innermost scope', () => {
    const { createScope, dispatch } = createSyncEffectTracker<string>();
    const outer = vi.fn();
    const inner = vi.fn();

    createScope(outer)(() => {
      createScope(inner)(() => {
        dispatch('nested');
      });
    });

    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner).toHaveBeenCalledWith('nested');
    expect(outer).not.toHaveBeenCalled();
  });

  test('restores the previous scope after nested scope exits', () => {
    const { createScope, dispatch } = createSyncEffectTracker<string>();
    const outer = vi.fn();
    const inner = vi.fn();

    createScope(outer)(() => {
      createScope(inner)(() => {
        dispatch('inside');
      });

      dispatch('outside');
    });

    expect(inner).toHaveBeenCalledWith('inside');
    expect(outer).toHaveBeenCalledWith('outside');
  });

  test('returns the result of the wrapped function in createScope', () => {
    const { createScope } = createSyncEffectTracker<number>();
    const result = createScope(() => {})(() => 42);
    expect(result).toBe(42);
  });

  test('supports deeply nested scopes with correct dispatch behavior', () => {
    const { createScope, dispatch } = createSyncEffectTracker<string>();
    const calls: string[] = [];

    createScope(msg => calls.push(`A: ${msg}`))(() => {
      dispatch('1'); // A

      createScope(msg => calls.push(`B: ${msg}`))(() => {
        dispatch('2'); // B

        createScope(msg => calls.push(`C: ${msg}`))(() => {
          dispatch('3'); // C
        });

        dispatch('4'); // B
      });

      dispatch('5'); // A
    });

    expect(calls).toEqual(['A: 1', 'B: 2', 'C: 3', 'B: 4', 'A: 5']);
  });
});
