import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Interval } from '@/interval/react/Interval';

describe('Interval | Invalid Inputs', () => {
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
