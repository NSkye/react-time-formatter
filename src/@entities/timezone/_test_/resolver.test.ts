import { describe, expect, test, vi } from 'vitest';

import {
  createDefaultTimezoneOffsetResolver,
  timezoneOffsetResolverLocal,
  timezoneOffsetResolverUTC,
  validateTimezoneOffset,
} from '@entities/timezone';

describe('timezoneOffsetResolverUTC', () => {
  test('always returns 0', () => {
    const now = new Date();
    expect(timezoneOffsetResolverUTC(now)).toBe(0);
  });
});

describe('timezoneOffsetResolverLocal', () => {
  test('returns Date.prototype.getTimezoneOffset()', () => {
    const d = new Date();
    expect(timezoneOffsetResolverLocal(d)).toBe(d.getTimezoneOffset());
  });
});

describe('createDefaultTimezoneOffsetResolver', () => {
  test('returns local resolver for "Local"', () => {
    const d = new Date();
    const resolver = createDefaultTimezoneOffsetResolver('Local');
    expect(resolver(d)).toBe(d.getTimezoneOffset());
  });

  test('returns UTC resolver for "UTC"', () => {
    const resolver = createDefaultTimezoneOffsetResolver('UTC');
    expect(resolver(new Date())).toBe(0);
  });

  test('returns literal resolver for number input', () => {
    const resolver = createDefaultTimezoneOffsetResolver(-180);
    expect(resolver(new Date())).toBe(-180);
  });

  test('returns function as-is when passed in', () => {
    const mock = vi.fn().mockReturnValue(42);
    const resolver = createDefaultTimezoneOffsetResolver(mock);
    expect(resolver(new Date())).toBe(42);
    expect(mock).toHaveBeenCalled();
  });
});

describe('validateTimezoneOffset', () => {
  test.each([[841], [-841], ['foo']])('invalidates incorrect timezone offset', offset => {
    expect(validateTimezoneOffset(offset)).toBeNaN();
  });
});
