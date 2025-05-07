import { describe, expect } from 'vitest';

import { createInvalidatedSafeDate, createSafeDate } from '../safe-date';

describe('SafeDate', () => {
  test('creates safe date', () => {
    const safeDate = createSafeDate(new Date('2005-05-05T05:05:05.000Z'));
    expect(safeDate.safeDate).toBe(true);
    expect(safeDate.valid).toBe(true);
    expect(safeDate.getUTCHours()).toBe(5);
  });

  test('creates explicitly invalid safe date', () => {
    const safeDate = createInvalidatedSafeDate();
    expect(safeDate.safeDate).toBe(true);
    expect(safeDate.valid).toBe(false);
    expect(safeDate.getUTCHours()).toBe(NaN);
  });

  test.each([
    // unsafe (too big)
    [new Date('10000-01-01T00:00:00.000Z')],
    // unsafe (too small)
    [new Date('0999-12-31T23:59:59.999Z')],
  ])('creates invalid safe date from valid unsafe date', date => {
    const safeDate = createSafeDate(date);
    expect(safeDate.safeDate).toBe(true);
    expect(safeDate.valid).toBe(false);
    expect(safeDate.getUTCHours()).toBe(NaN);
  });
});
