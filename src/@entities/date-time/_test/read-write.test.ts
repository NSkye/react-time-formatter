import { describe, expect, test } from 'vitest';

import {
  inferDateFromDateTimeBreakdown,
  readCalendarToken,
  writeCalendarToken,
} from '@entities/date-time';

describe('readCalendarToken', () => {
  const berlinOffsetBeforeDST = -60; // UTC+1
  const berlinOffsetAfterDST = -120; // UTC+2

  const beforeDST = new Date(Date.UTC(2024, 2, 31, 0, 59)); // 01:59 local
  const afterDST = new Date(Date.UTC(2024, 2, 31, 1, 1)); // 03:01 local

  test('reads correct hour before DST jump', () => {
    const hours = readCalendarToken(beforeDST, 'hours', berlinOffsetBeforeDST);
    expect(hours).toBe(1);
  });

  test('reads correct hour after DST jump', () => {
    const hours = readCalendarToken(afterDST, 'hours', berlinOffsetAfterDST);
    expect(hours).toBe(3);
  });

  test('reads correct day of week', () => {
    const date = new Date('2024-04-01T00:00:00Z');
    const day = readCalendarToken(date, 'day', 0);
    expect(day).toBe(1); // Monday
  });
});

describe('writeCalendarToken', () => {
  const date = new Date(Date.UTC(2024, 0, 1, 0, 0)); // Jan 1

  test('correctly writes UTC hour', () => {
    const updated = writeCalendarToken(date, 'hours', 15, 0);
    expect(readCalendarToken(updated, 'hours', 0)).toBe(15);
  });

  test('respects timezone offset', () => {
    const updated = writeCalendarToken(date, 'hours', 3, 180); // UTC+3
    expect(readCalendarToken(updated, 'hours', 180)).toBe(3);
  });

  test('writing to month does not affect other fields', () => {
    const updated = writeCalendarToken(date, 'month', 5, 0); // June
    expect(readCalendarToken(updated, 'month', 0)).toBe(5);
    expect(readCalendarToken(updated, 'date', 0)).toBe(1); // still Jan 1st
  });
});

describe('inferDateFromDateTimeBreakdown', () => {
  test('constructs correct local date', () => {
    const d = inferDateFromDateTimeBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 30,
    });

    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(3); // April is 3
    expect(d.getDate()).toBe(20);
  });

  test('constructs correct UTC date', () => {
    const d = inferDateFromDateTimeBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 30,
      timezoneOffset: 'UTC',
    });

    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(3);
    expect(d.getUTCDate()).toBe(20);
    expect(d.getUTCHours()).toBe(10);
  });

  test('applies custom numeric timezone offset', () => {
    const d = inferDateFromDateTimeBreakdown({
      year: 2025,
      month: 4,
      date: 20,
      hours: 10,
      minutes: 0,
      timezoneOffset: -60,
    });

    expect(d.getUTCHours()).toBe(9);
  });

  test('custom numeric timezone offset is consistent with Date.prototype.getTimezoneOffset', () => {
    /**
     * Not bulletproof against running test in timezone matching UTC.
     * But we can't gaslight computer into thinking of a different timezone from here, sadly.
     */
    const localDate = new Date();

    const d = inferDateFromDateTimeBreakdown({
      year: localDate.getFullYear(),

      // note 1-indexed month
      month: localDate.getMonth() + 1,
      date: localDate.getDate(),
      hours: localDate.getHours(),
      minutes: localDate.getMinutes(),
      seconds: localDate.getSeconds(),
      milliseconds: localDate.getMilliseconds(),
      timezoneOffset: localDate.getTimezoneOffset(),
    });

    expect(d.valueOf()).toBe(localDate.valueOf());
  });
});
