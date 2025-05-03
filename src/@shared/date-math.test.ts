import { describe, expect, test } from 'vitest';

import { datesAreEqual, toTimestamp } from './date-math';

describe('toTimestamp', () => {
  test('should convert a Date object to a timestamp', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(toTimestamp(date)).toBe(date.getTime());
  });

  test('should convert a valid ISO string to a timestamp', () => {
    const str = '2023-01-01T00:00:00Z';
    expect(toTimestamp(str)).toBe(new Date(str).getTime());
  });

  test('should convert a valid numeric timestamp input', () => {
    const timestamp = 1672531200000;
    expect(toTimestamp(timestamp)).toBe(timestamp);
  });

  test('should return NaN for an invalid date string', () => {
    expect(toTimestamp('invalid date')).toBeNaN();
  });

  test('should return NaN for a number that is not a valid date', () => {
    expect(toTimestamp(NaN)).toBeNaN();
  });
});

describe('datesAreEqual', () => {
  test('should return true for equivalent Date and string inputs', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(datesAreEqual(date, '2023-01-01T00:00:00Z')).toBe(true);
  });

  test('should return true for equivalent string and timestamp inputs', () => {
    const str = '2023-01-01T00:00:00Z';
    const timestamp = new Date(str).getTime();
    expect(datesAreEqual(str, timestamp)).toBe(true);
  });

  test('should return false for different valid dates', () => {
    expect(datesAreEqual('2023-01-01', '2023-01-02')).toBe(false);
  });

  test('should return false if one of the inputs is invalid', () => {
    expect(datesAreEqual('invalid', '2023-01-01')).toBe(false);
  });

  test('should return false if both inputs are invalid', () => {
    expect(datesAreEqual('foo', 'bar')).toBe(false);
  });
});
