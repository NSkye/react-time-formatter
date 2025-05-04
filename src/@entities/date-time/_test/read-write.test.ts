import { describe, expect, test } from 'vitest';

import { readCalendarToken, writeCalendarToken } from '@entities/date-time';

describe('readCalendarToken', () => {
  const berlinOffsetBeforeDST = -60; // UTC+1
  const berlinOffsetAfterDST = -120; // UTC+2

  const beforeDST = new Date(Date.UTC(2024, 2, 31, 0, 59)); // 01:59 Berlin
  const afterDST = new Date(Date.UTC(2024, 2, 31, 1, 1)); // 03:01 Berlin (DST)

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

  test('reads months as 1-indexed', () => {
    const date = new Date('2024-04-01T00:00:00Z');
    const month = readCalendarToken(date, 'month', 0);
    expect(month).toBe(4);
  });
});

describe('writeCalendarToken', () => {
  test('correctly writes UTC hour', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 0, 0));
    const updated = writeCalendarToken(date, 'hours', 15, 0);
    expect(readCalendarToken(updated, 'hours', 0)).toBe(15);
  });

  test('respects timezone offset', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 0, 0));
    const updated = writeCalendarToken(date, 'hours', 3, 180); // UTC+3
    expect(readCalendarToken(updated, 'hours', 180)).toBe(3);
  });

  test('writes month as 1-indexed', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 0, 0));
    const updated = writeCalendarToken(date, 'month', 3, 0);
    expect(updated.getUTCMonth()).toBe(2);
  });

  test('writing to month does not affect other fields', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 0, 0));
    const updated = writeCalendarToken(date, 'month', 5, 0); // June
    expect(readCalendarToken(updated, 'month', 0)).toBe(5);
    expect(readCalendarToken(updated, 'date', 0)).toBe(1); // still Jan 1st
  });
});
