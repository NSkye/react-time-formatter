import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { createSafeDate } from '@entities/calendar-date';
import { RelativeTimeBreakdown } from '@entities/relative-time';

import { IntervalOutput } from '@/interval/core/extend';
import { Interval } from '@/interval/react';

import { DEOPTIMIZED_breakdownInterval } from './deoptimized-breakdown';

const inputs = [
  ['Regular leap year jump', '2020-02-29T00:00:00Z', '2021-02-28T00:00:00Z'],
  ['Fake leap year (1900 is not leap)', '1896-02-29T00:00:00Z', '1900-02-28T00:00:00Z'],
  ['Real century leap year (2000 is leap)', '1996-02-29T00:00:00Z', '2000-02-29T00:00:00Z'],
  ['Crossing leap cycle', '1999-01-01T00:00:00Z', '2004-01-01T00:00:00Z'],
  ['Exact 400-year jump', '1600-01-01T00:00:00Z', '2000-01-01T00:00:00Z'],
  ['Pre-leap full year', '2022-03-01T00:00:00Z', '2023-03-01T00:00:00Z'],
  ['Reverse chronological order', '2023-01-01T00:00:00Z', '2000-01-01T00:00:00Z'],
  ['High-end precision edge', '9998-12-31T00:00:00Z', '9999-12-31T00:00:00Z'],
  ['Earliest supported range test', '1000-01-01T00:00:00Z', '1004-01-01T00:00:00Z'],
  ['Same date zero-diff', '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z'],
  ['Leap second-ish range', '2000-01-01T23:59:59Z', '2000-01-02T00:00:01Z'],
];

const testCases = inputs.map(([title, from, to]) => {
  const fromDate = createSafeDate(new Date(from));
  const toDate = createSafeDate(new Date(to));

  const yearsMonthsDaysBreakdown = DEOPTIMIZED_breakdownInterval(
    [fromDate, toDate],
    {
      years: true,
      months: true,
      weeks: false,
      days: true,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    },
    () => 0
  );

  const daysBreakdown = DEOPTIMIZED_breakdownInterval(
    [fromDate, toDate],
    {
      years: false,
      months: false,
      weeks: false,
      days: true,
      hours: false,
      minutes: false,
      seconds: false,
      milliseconds: false,
    },
    () => 0
  );

  return { title, from, to, yearsMonthsDaysBreakdown, daysBreakdown };
});

describe('Leap years testing', () => {
  const yearMonthDayBreakdownTests = testCases.map(
    ({ title, from, to, yearsMonthsDaysBreakdown }) => [title, from, to, yearsMonthsDaysBreakdown]
  ) as [string, string, string, RelativeTimeBreakdown][];
  test.each(yearMonthDayBreakdownTests)(
    'year, month, day breakdown | %s | from: %s to: %s',
    (_title, from, to, { years, months, days }) => {
      const expected = `years: ${years}, months: ${months}, days: ${days}`;

      render(
        <Interval from={to} to={from} timezone={0}>
          {(t: IntervalOutput) => (
            <span data-testid="BREAKDOWN">
              years: {t.years}, months: {t.months}, days: {t.days}
            </span>
          )}
        </Interval>
      );

      expect(screen.getByTestId('BREAKDOWN').textContent).toBe(expected);
    }
  );

  const dayBreakdownTests = testCases.map(({ title, from, to, daysBreakdown }) => [
    title,
    from,
    to,
    daysBreakdown,
  ]) as [string, string, string, RelativeTimeBreakdown][];
  test.each(dayBreakdownTests)(
    'day breakdown | %s | from: %s to: %s',
    (_title, from, to, { days }) => {
      const expected = `days: ${days}`;

      render(
        <Interval from={to} to={from} timezone={0}>
          {(t: IntervalOutput) => <span data-testid="BREAKDOWN">days: {t.days}</span>}
        </Interval>
      );

      expect(screen.getByTestId('BREAKDOWN').textContent).toBe(expected);
    }
  );
});
