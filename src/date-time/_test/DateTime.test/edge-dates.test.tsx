import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DateTime } from '@/date-time/react/DateTime';

describe('DateTime | Edge dates', () => {
  test.each([
    // Max supported date
    [
      '9999-12-31T23:59:59.999Z',
      [
        'year: 9999, month: 12, date: 31, hours: 23, minutes: 59, seconds: 59, milliseconds: 999, timezone offset: 0',
        "12/31 '99 11:59:59 PM UTC+0000",
        '31.12.9999 23:59:59.999 Z',
      ],
    ],
    // Min supported date
    [
      '1000-01-01T00:00:00.000Z',
      [
        'year: 1000, month: 1, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, timezone offset: 0',
        "1/1 '00 12:00:00 AM UTC+0000",
        '01.01.1000 00:00:00.000 Z',
      ],
    ],
  ])(
    'min-max-dates are rendered %s is rendered',
    (dateString, [expectedA, expectedB, expectedC]) => {
      render(
        <DateTime at={dateString} timezone={0}>
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
    }
  );

  test.each([
    // Mid-range: leap year
    [
      '2024-02-29T08:15:30.123Z',
      [
        'year: 2024, month: 2, date: 29, hours: 8, minutes: 15, seconds: 30, milliseconds: 123, timezone offset: 0',
        "2/29 '24 08:15:30 AM UTC+0000",
        '29.02.2024 08:15:30.123 Z',
      ],
    ],
    // Mid-range: DST-ish boundary (but rendered as UTC)
    [
      '2023-03-12T02:00:00.000Z',
      [
        'year: 2023, month: 3, date: 12, hours: 2, minutes: 0, seconds: 0, milliseconds: 0, timezone offset: 0',
        "3/12 '23 02:00:00 AM UTC+0000",
        '12.03.2023 02:00:00.000 Z',
      ],
    ],
    // Mid-range: End of year
    [
      '2022-12-31T23:59:59.999Z',
      [
        'year: 2022, month: 12, date: 31, hours: 23, minutes: 59, seconds: 59, milliseconds: 999, timezone offset: 0',
        "12/31 '22 11:59:59 PM UTC+0000",
        '31.12.2022 23:59:59.999 Z',
      ],
    ],
  ])(
    'sane-midrange dates render correctly: %s',
    (dateString, [expectedA, expectedB, expectedC]) => {
      render(
        <DateTime at={dateString} timezone={0}>
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
    }
  );
});
