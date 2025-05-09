import { describe, expect, test } from 'vitest';

import {
  normalizeRelativeTimeBreakdown,
  normalizeRelativeTimeConfig,
  relativeTimeBreakdownToMilliseconds,
  relativeTimeBreakdownsAreEqual,
} from '../breakdown';

describe('normalizeRelativeTimeBreakdown', () => {
  test('correctly normalizes breakdown', () => {
    const source = {
      years: 10,
      days: 9,
    };

    expect(normalizeRelativeTimeBreakdown(source)).toEqual({
      years: 10,
      months: 0,
      weeks: 0,
      days: 9,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });
});

describe('normalize relative time config', () => {
  test('enables lesser units', () => {
    const source = {
      years: true,
      months: false,
      weeks: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    };

    expect(normalizeRelativeTimeConfig(source)).toEqual({
      years: true,
      months: true,
      weeks: true,
      days: true,
      hours: true,
      minutes: true,
      seconds: true,
      milliseconds: true,
    });
  });

  test('enables only lesser units', () => {
    const source = {
      years: false,
      months: false,
      weeks: false,
      days: true,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    };

    expect(normalizeRelativeTimeConfig(source)).toEqual({
      years: false,
      months: false,
      weeks: false,
      days: true,
      hours: true,
      minutes: true,
      seconds: true,
      milliseconds: true,
    });
  });

  test('does not enable any units if only milliseconds are enabled', () => {
    const source = {
      years: false,
      months: false,
      weeks: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: true,
    };

    expect(normalizeRelativeTimeConfig(source)).toEqual({
      years: false,
      months: false,
      weeks: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: true,
    });
  });

  test('does not enable any units if none units are enabled', () => {
    const source = {
      years: false,
      months: false,
      weeks: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    };

    expect(normalizeRelativeTimeConfig(source)).toEqual({
      years: false,
      months: false,
      weeks: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    });
  });

  test('does not enable intermediate disabled units', () => {
    const source = {
      years: false,
      months: true,
      weeks: false,
      days: true,
      hours: false,
      minutes: true,
      seconds: false,
      milliseconds: false,
    };

    expect(normalizeRelativeTimeConfig(source)).toEqual({
      years: false,
      months: true,
      weeks: false,
      days: true,
      hours: false,
      minutes: true,
      seconds: true,
      milliseconds: true,
    });
  });
});

describe('relativeTimeBreakdownsAreEqual', () => {
  test('returns true for identical breakdowns', () => {
    const a = { hours: 2, minutes: 30 };
    const b = { hours: 2, minutes: 30 };
    expect(relativeTimeBreakdownsAreEqual(a, b)).toBe(true);
  });

  test('returns false for differing values', () => {
    const a = { hours: 2, minutes: 30 };
    const b = { hours: 2, minutes: 31 };
    expect(relativeTimeBreakdownsAreEqual(a, b)).toBe(false);
  });

  test('treats missing units as 0', () => {
    const a = { minutes: 30 };
    const b = { hours: 0, minutes: 30 };
    expect(relativeTimeBreakdownsAreEqual(a, b)).toBe(true);
  });
});

describe('relativeTimeBreakdownToMilliseconds', () => {
  test('computes timestamp from unit breakdown', () => {
    const breakdown = { minutes: 2, seconds: 30 }; // 150000 ms
    expect(relativeTimeBreakdownToMilliseconds(breakdown)).toBe(150000);
  });

  test('treats missing units as zero', () => {
    const partial = { hours: 1 }; // should equal 3600000
    expect(relativeTimeBreakdownToMilliseconds(partial)).toBe(3600000);
  });

  test('returns NaN if all units are missing', () => {
    expect(relativeTimeBreakdownToMilliseconds({})).toBeNaN();
  });
});
