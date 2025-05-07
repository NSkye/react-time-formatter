import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DAY } from '@shared/time-primitives';

import { Interval, IntervalOutput } from '@/interval/react/Interval';

describe('Interval | Basics', () => {
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
      <Interval from={from} to={to} timezone={0}>
        {({ months, days }) => <span data-testid="time">{`${months} months, ${days} days`}</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });

  test.each([
    [0, '1 months, 0 days'],
    [1, '0 months, 30 days'],
  ])('is timezone-aware', (timezone, expected) => {
    render(
      <Interval from="2025-04-01T00:00:00Z" to="2025-05-01T00:00:00Z" timezone={timezone}>
        {({ months, days }) => <span data-testid="time">{`${months} months, ${days} days`}</span>}
      </Interval>
    );

    const dateA = new Date('2025-04-01T00:00:00Z');
    const dateB = new Date('2025-05-01T00:00:00Z');

    expect(dateB.getTime() - dateA.getTime()).toBe(30 * DAY);
    expect(screen.getByTestId('time').textContent).toBe(expected);
  });

  test('reversed dates are positive with totals allowed to be negative', () => {
    const from = '1789-07-14T00:00:00Z';
    const to = '1799-11-09T00:00:00Z';

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
