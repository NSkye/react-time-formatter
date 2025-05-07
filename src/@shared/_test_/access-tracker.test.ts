import { describe, expect, test } from 'vitest';

import { spyOnPropertyAccess } from '@shared/access-tracker';

describe('spyOnPropertyAccess', () => {
  test('returns the result of the function', () => {
    const [result] = spyOnPropertyAccess({ x: 10 }, opts => opts.x * 2);
    expect(result).toBe(20);
  });

  test('tracks accessed properties correctly', () => {
    const [, access] = spyOnPropertyAccess({ a: 1, b: 2, c: 3 }, opts => opts.a + opts.c);

    expect(access).toEqual({ a: true, b: false, c: true });
  });

  test('does not mark properties that were not accessed', () => {
    const [, access] = spyOnPropertyAccess({ foo: 'x', bar: 'y' }, opts => opts.foo);

    expect(access).toEqual({ foo: true, bar: false });
  });

  test('does not mark unknown property accesses', () => {
    const [, access] = spyOnPropertyAccess(
      { known: 1 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      opts => (opts as any).unknown ?? opts.known
    );

    expect(access).toEqual({ known: true });
  });

  test('handles empty objects correctly', () => {
    const [, access] = spyOnPropertyAccess({}, () => 42);
    expect(access).toEqual({});
  });

  test('does not throw when accessing symbols or prototype properties', () => {
    const obj = Object.create({ inherited: 123 });
    obj.own = 456;

    const [, access] = spyOnPropertyAccess(obj, opts => {
      Object.prototype.toString.call(opts);
      return opts.own;
    });

    expect(access).toEqual({ own: true });
  });
});
