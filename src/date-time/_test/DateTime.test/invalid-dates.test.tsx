import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DateTime } from '@/date-time/react/DateTime';

describe('DateTime | Invalid dates', () => {
  test.each([
    // unsupported date (too small)
    ['0001-01-01T00:00:00.000Z'],
    // technically supported but still unreliable date (too small)
    ['0999-12-31T23:59:59.999Z'],
    // technically supported but still unreliable date (too large)
    ['10000-12-31T23:59:59.999Z'],
    // not enough information to infer date
    [{ minutes: 20 }],
    // not enough information to infer date
    [{ seconds: 10 }],
    // not enough information to infer date
    [{ month: 1 }],
    // year is too small
    [{ year: 540 }],
    // year is too large
    [{ year: 41_000 }],
    // Infinite timestamp
    [Infinity],
    // Infinite timestamp
    [-Infinity],
    // Invalidated timestamp
    [NaN],
    // Absurdly huge timestamp
    [-1e20],
    // Absurdly small timestamp
    [1e20],
    // other nullish values
    [''],
    [null],
    [[]],
  ])('consistently invalidates on incorrect dates: %s', input => {
    const expectedA =
      'year: NaN, month: NaN, date: NaN, hours: NaN, minutes: NaN, seconds: NaN, milliseconds: NaN, timezone offset: 0';
    const expectedB = "#/# '## ##:##:## -- UTC+0000";
    const expectedC = '##.##.#### ##:##:##.### Z';

    render(
      <DateTime at={input as unknown as Date} timezone={0}>
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
