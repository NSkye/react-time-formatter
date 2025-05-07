import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DateTime } from '@/date-time/react/DateTime';

/**
 * Testing timezone that copies behavior
 * of Berlin's timezone in 2025 (has DST)
 * @param date
 * @returns whichever offset Berlin has at the time
 */
const Berlin2025: (date: Date) => number = date => {
  const year = date.getUTCFullYear();

  // Find last Sunday in March
  const startDST = new Date(Date.UTC(year, 2, 31, 1)); // March 31, 01:00 UTC
  while (startDST.getUTCDay() !== 0) {
    startDST.setUTCDate(startDST.getUTCDate() - 1);
  }

  // Find last Sunday in October
  const endDST = new Date(Date.UTC(year, 9, 31, 1)); // October 31, 01:00 UTC
  while (endDST.getUTCDay() !== 0) {
    endDST.setUTCDate(endDST.getUTCDate() - 1);
  }

  // If date is within DST range, return UTC+2 = -120
  if (date >= startDST && date < endDST) {
    return -120;
  }

  // Otherwise, return UTC+1 = -60
  return -60;
};

/**
 * Testing timezone for Central European Time as in 2025
 * but without DST
 * (frankly as it always should be, because wtf look at the fn above and look at this)
 * @returns always -60
 */
const CET2025Test = () => -60;

describe('DateTime | Timezones', () => {
  test.each([
    // Before DST start
    ['2025-03-30T00:59:59Z', '01:59:59 UTC+0100'],
    // After DST start
    ['2025-03-30T01:00:00Z', '03:00:00 UTC+0200'],
    // Before DST end
    ['2025-10-26T00:59:59Z', '02:59:59 UTC+0200'],
    // After DST end
    ['2025-10-26T01:00:00Z', '02:00:00 UTC+0100'],
  ])('handles DST jumps correctly, UTC vs Zoned: %s vs %s', (input, expectedA) => {
    render(
      <DateTime at={input} timezone={Berlin2025}>
        {t => (
          <div>
            <span data-testid="A">
              {t.HH}:{t.mm}:{t.ss} UTC{t.ZZ}
            </span>
          </div>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('A').textContent).toBe(expectedA);
  });

  test.each([
    // Before "DST start"
    ['2025-03-30T00:59:59Z', '01:59:59 UTC+0100'],
    // After "DST start"
    ['2025-03-30T01:00:00Z', '02:00:00 UTC+0100'],
    // Before "DST end"
    ['2025-10-26T00:59:59Z', '01:59:59 UTC+0100'],
    // After "DST end"
    ['2025-10-26T01:00:00Z', '02:00:00 UTC+0100'],
  ])('handles static timezones correctly UTC vs Zoned: %s vs %s', (input, expectedA) => {
    render(
      <DateTime at={input} timezone={CET2025Test}>
        {t => (
          <div>
            <span data-testid="A">
              {t.HH}:{t.mm}:{t.ss} UTC{t.ZZ}
            </span>
          </div>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('A').textContent).toBe(expectedA);
  });

  test.each([
    // millisecond-based offset UTC+3 (minute-based expected)
    ['2025-12-02T12:30:45', -10800000],
    ['2025-12-02T12:30:45', () => -10800000],
    // millisecond-based offset UTC-3 (minute-based expected)
    ['2025-12-02T12:30:45', +10800000],
    ['2025-12-02T12:30:45', () => +10800000],
    // larger minute-based offset UTC+14:01
    ['2025-12-02T12:30:45', -841],
    ['2025-12-02T12:30:45', () => -841],
    // larger minute-based offset UTC-14:01
    ['2025-12-02T12:30:45', 841],
    ['2025-12-02T12:30:45', () => 841],
    // NaN timezone
    ['2025-12-02T12:30:45', NaN],
    ['2025-12-02T12:30:45', () => NaN],
    // Infinite timezone
    ['2025-12-02T12:30:45', Infinity],
    ['2025-12-02T12:30:45', () => Infinity],
    // Negative infinite timezone
    ['2025-12-02T12:30:45', -Infinity],
    ['2025-12-02T12:30:45', () => -Infinity],
    //Invalid type for timzone
    ['2025-12-02T12:30:45', {}],
    ['2025-12-02T12:30:45', () => ({})],
  ])('invalid timezone offset invalidates the whole input | %s | %d |', (input, timezoneOffset) => {
    const expectedA =
      'year: NaN, month: NaN, date: NaN, hours: NaN, minutes: NaN, seconds: NaN, milliseconds: NaN, timezone offset: NaN';
    const expectedB = "#/# '## ##:##:## -- UTC####";
    const expectedC = '##.##.#### ##:##:##.### ##:##';

    render(
      <DateTime at={input as unknown as Date} timezone={timezoneOffset as unknown as number}>
        {t => (
          <div>
            <span data-testid="A">
              year: {t.year}, month: {t.month}, date: {t.date}, hours: {t.hours}, minutes:{' '}
              {t.minutes}, seconds: {t.seconds}, milliseconds: {t.milliseconds}, timezone offset:{' '}
              {t.timezoneOffset}
            </span>
            <span data-testid="B">
              {t.M}/{t.D} '{t.YY} {t.hh}:{t.mm}:{t.ss} {t.A} UTC{t.ZZ}
            </span>
            <span data-testid="C">
              {t.DD}.{t.MM}.{t.YYYY} {t.HH}:{t.mm}:{t.ss}.{t.SSS} {t.Z}
            </span>
          </div>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('A').textContent).toBe(expectedA);
    expect(screen.getByTestId('B').textContent).toBe(expectedB);
    expect(screen.getByTestId('C').textContent).toBe(expectedC);
  });
});
