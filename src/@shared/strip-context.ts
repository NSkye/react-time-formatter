/**
 * Transforms a method that relies on `this` into a standalone function
 * by explicitly passing the context as the first argument.
 *
 * @param {Function} fn Function that uses `this` context.
 * @returns Function with context passed explicitly as the first parameter.
 */
export const stripContext =
  <T, A extends unknown[], R>(fn: (this: T, ...args: A) => R): ((context: T, ...args: A) => R) =>
  (context, ...args) =>
    fn.call(context, ...args);
