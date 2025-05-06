import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DAY } from '@shared/time-primitives';

import { IntervalOutput } from '../core/extend';
import { Interval } from '../react/Interval';

/** Timezones */

/**
 * Regular UTC timezone
 * @returns always 0
 */
const UTC = () => 0;

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

describe('Interval', () => {
  describe('Basics', () => {
    test.each([
      // Same offset, different result
      // January, 31 day, will not be full month
      ['2025-01-01T00:00:00Z', 30 * DAY, '0 months, 30 days'],
      // April, 30 days, will be exactly 1 month
      ['2025-04-01T00:00:00Z', 30 * DAY, '1 months, 0 days'],
      // February 2025, 28 days, will be 1 month and 2 days
      ['2025-02-01T00:00:00Z', 30 * DAY, '1 months, 2 days'],
      // February 2024, leap year, 29 days, will be 1 month and 1 day
      ['2024-02-01T00:00:00Z', 30 * DAY, '1 months, 1 days'],
    ])('computes calendar distance correctly %s %d %s', (fromIso, offset, expected) => {
      const from = new Date(fromIso);
      const to = new Date(from.getTime() + offset);

      render(
        <Interval from={from} to={to} timezone={UTC}>
          {({ months, days }) => <span data-testid="time">{`${months} months, ${days} days`}</span>}
        </Interval>
      );

      expect(screen.getByTestId('time').textContent).toBe(expected);
    });

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

  describe('Invalid inputs', () => {
    const CORRECT_DATE = '2025-01-01T00:00:00Z';
    const plusReversed = (array: Array<unknown>) => [array, ...array.reverse()];

    test.each([
      // unsupported date (too small)
      ...plusReversed([CORRECT_DATE, '0001-01-01T00:00:00.000Z']),
      // technically supported but still unreliable date (too small)
      ...plusReversed([CORRECT_DATE, '0999-12-31T23:59:59.999Z']),
      // unsupported date (too large)
      ...plusReversed([CORRECT_DATE, '10000-12-31T23:59:59.999Z']),
      // not enough information to infer date
      ...plusReversed([CORRECT_DATE, { minutes: 20 }]),
      // not enough information to infer date
      ...plusReversed([CORRECT_DATE, { seconds: 10 }]),
      // not enough information to infer date
      ...plusReversed([CORRECT_DATE, { month: 1 }]),
      // year is too small
      ...plusReversed([CORRECT_DATE, { year: 540 }]),
      // year is too large
      ...plusReversed([CORRECT_DATE, { year: 41_000 }]),
      // Infinite timestamp
      ...plusReversed([CORRECT_DATE, Infinity]),
      // Infinite timestamp
      ...plusReversed([CORRECT_DATE, -Infinity]),
      // Invalidated timestamp
      ...plusReversed([CORRECT_DATE, NaN]),
      // Absurdly huge timestamp
      ...plusReversed([CORRECT_DATE, -1e20]),
      // Absurdly small timestamp
      ...plusReversed([CORRECT_DATE, 1e20]),
      // other nullish values
      ...plusReversed([CORRECT_DATE, '']),
      ...plusReversed([CORRECT_DATE, null]),
      ...plusReversed([CORRECT_DATE, []]),
    ])('consistently invalidates on incorrect dates: %s', (from, to) => {
      const expectedA =
        'years: NaN, months: NaN, days: NaN, hours: NaN, minutes: NaN, seconds: NaN, milliseconds: NaN';
      const expectedB = '##d ##m ##y ##:##:##.###';

      render(
        <Interval from={from as Date} to={to as Date}>
          {t => (
            <div>
              <span data-testid="A">
                years: {t.years}, months: {t.months}, days: {t.days}, hours: {t.hours}, minutes:{' '}
                {t.minutes}, seconds: {t.seconds}, milliseconds: {t.milliseconds}
              </span>
              <span data-testid="B">
                {t.DD}d {t.MM}m {t.YY}y {t.HH}:{t.mm}:{t.ss}.{t.SSS}
              </span>
            </div>
          )}
        </Interval>
      );

      expect(screen.getByTestId('A').textContent).toBe(expectedA);
      expect(screen.getByTestId('B').textContent).toBe(expectedB);
    });
  });

  describe('Lazy token evaluation', () => {
    const from = '1789-07-14T00:00:00Z';
    const to = '1799-11-09T00:00:00Z';

    test.each([
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.YY} years {t.MM} months {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds{' '}
            {t.SSS} milliseconds
          </span>
        ),
        '10 years 03 months 26 days 00 hours 00 minutes 00 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.MM} months {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS}{' '}
            milliseconds
          </span>
        ),
        '123 months 26 days 00 hours 00 minutes 00 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
          </span>
        ),
        '3770 days 00 hours 00 minutes 00 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
          </span>
        ),
        '90480 hours 00 minutes 00 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
          </span>
        ),
        '5428800 minutes 00 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => (
          <span data-testid="time">
            {t.ss} seconds {t.SSS} milliseconds
          </span>
        ),
        '325728000 seconds 000 milliseconds',
      ] as const,
      [
        (t: IntervalOutput) => <span data-testid="time">{t.SSS} milliseconds</span>,
        '325728000000 milliseconds',
      ] as const,
    ] as const)(
      'handles fallback to lesser units if bigger are not available',
      (childRender, expected) => {
        render(
          <Interval from={from} to={to} timezone={UTC}>
            {childRender}
          </Interval>
        );

        expect(screen.getByTestId('time').textContent).toBe(expected);
      }
    );

    test('reversed dates are positive with totals allowd to be negative', () => {
      render(
        <Interval from={to} to={from}>
          {(t: IntervalOutput) => (
            <span data-testid="time">
              {t.YY} years {t.MM} months {t.DD} days, total: {t.totalDays} days
            </span>
          )}
        </Interval>
      );

      expect(screen.getByTestId('time').textContent).toBe(
        '10 years 03 months 26 days, total: -3770 days'
      );
    });
  });
});
