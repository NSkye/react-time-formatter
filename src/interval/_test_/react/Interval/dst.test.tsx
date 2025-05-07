import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Interval } from '@/interval/react/Interval';

/** Timezones */

/**
 * Testing timezone for Central European Time as in 2025
 * but without DST
 * (frankly as it always should be, because wtf look at the fn above and look at this)
 * @returns always -60
 */
const CET2025Test = () => -60;

/**
 * Testing timezone that always switches
 * to DST at the same time of year
 * @param date
 * @returns
 */
const TestDST = (date: Date): number => {
  const month = date.getUTCMonth(); // 0 = January

  if (month >= 2 && month <= 9) {
    return -120; // DST: UTC+2 (offset -120 mins)
  }

  return -60; // Standard Time: UTC+1 (offset -60 mins)
};

/**
 * Test timezone that copies behavior
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

describe('Interval | DST', () => {
  test.each([
    ['2024-03-31T01:00:00Z', '2024-03-31T03:00:00Z', '2h'],
    ['2024-10-27T01:00:00Z', '2024-10-27T02:00:00Z', '1h'],
  ])('handles DST forward and backward jump (1h gap) correctly', (from, to, expected) => {
    render(
      <Interval from={from} to={to} timezone={TestDST}>
        {({ hours }) => <span data-testid="time">{`${hours}h`}</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });

  test.each([
    ['2025-03-30T01:59:59Z', '2025-03-30T03:00:00Z', '60 minutes'],
    ['2025-10-26T02:59:59Z', '2025-10-26T02:00:00Z', '59 minutes'],
  ])('No-DST control group', (dateA, dateB, expected) => {
    render(
      <Interval from={dateA} to={dateB} timezone={CET2025Test}>
        {t => <span data-testid="time">{t.mm} minutes</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });

  test.each([
    // Wall clock time changes by an hour but in reality only second passes
    // Before DST start and After DST start
    ['2025-03-30T01:59:59+01:00', '2025-03-30T03:00:00+02:00', '00h 00m 01s'],
    // Before DST end and After DST end
    ['2025-10-26T02:59:59+02:00', '2025-10-26T02:00:00+01:00', '00h 00m 01s'],
  ])('handles DST jumps correctly, %s -> %s = %s', (dateA, dateB, expected) => {
    render(
      <Interval from={dateA} to={dateB} timezone={Berlin2025}>
        {t => (
          <span data-testid="time">
            {t.HH}h {t.mm}m {t.ss}s
          </span>
        )}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });
});
