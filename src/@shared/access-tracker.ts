import { createSyncEffectTracker } from './effect-tracker';

const { createScope, dispatch } = createSyncEffectTracker<string>();

/**
 * Executes a function with a proxied options object and tracks which properties
 * were accessed during execution, in a memory-safe way.
 *
 * @param options The object whose property accesses will be tracked.
 * @param fn The function to execute, which receives the proxied options object.
 * @returns A tuple:
 *   1. The result of executing `fn`.
 *   2. A record mapping each key of `options` to a boolean indicating whether it was accessed.
 */
export const spyOnPropertyAccess = <
  T,
  O extends Record<string, unknown>,
  Fn extends (options: O) => T,
>(
  options: O,
  fn: Fn
): [T, Record<keyof O, boolean>] => {
  const optionsProxy = new Proxy(options, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop in target) {
        dispatch(prop);
        return Reflect.get(target, prop, receiver);
      }
      return undefined;
    },
  });

  const accessMap = Object.fromEntries(Object.keys(options).map(key => [key, false]));

  const trackAccess = createScope(prop => {
    if (Object.prototype.hasOwnProperty.call(accessMap, prop)) {
      accessMap[prop] = true;
    }
  });

  const result = trackAccess(() => fn(optionsProxy));
  return [result, accessMap as Record<keyof O, boolean>];
};
