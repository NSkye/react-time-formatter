import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { YEAR } from '@shared/time-primitives';

import { DateTime } from '../react/DateTime';

describe('DateTime', () => {
  describe('Basic checks', () => {
    test('renders local date correctly, months are 1-indexed', () => {
      const expected = 'year is 2025, month is 4 and date is 2';

      render(
        <DateTime date={new Date('2025-04-02')}>
          {({ year, month, date }) => (
            <span data-testid="time">{`year is ${year}, month is ${month} and date is ${date}`}</span>
          )}
        </DateTime>
      );

      expect(screen.getByTestId('time').textContent).toBe(expected);
    });

    test('renders date from timestamp', () => {
      render(<DateTime date={0}>{({ year }) => <span data-testid="time">{year}</span>}</DateTime>);

      expect(screen.getByTestId('time').textContent).toBe('1970');
    });

    test('renders date from negative timestamp', () => {
      render(
        <DateTime date={-1 * YEAR}>{({ year }) => <span data-testid="time">{year}</span>}</DateTime>
      );

      expect(screen.getByTestId('time').textContent).toBe('1969');
    });

    test('renders all aliases correctly', () => {
      render(
        <DateTime
          date={{
            year: 1989,
            month: 2,
            date: 9,
            hours: 15,
            minutes: 45,
            seconds: 54,
            milliseconds: 898,
            timezoneOffset: 0,
          }}
          timezoneOffset="UTC"
        >
          {t => (
            <div>
              <span data-testid="timeA">
                year {t.year} month {t.month} date {t.date} day {t.day} hours {t.hours} minutes{' '}
                {t.minutes} seconds {t.seconds} milliseconds {t.milliseconds} {t.timezoneOffset}
              </span>
              <span data-testid="timeB">
                {t.YYYY}-{t.MM}-{t.DD} {t.HH}:{t.mm}:{t.ss}.{t.SSS} {t.Z}
              </span>
              <span data-testid="timeC">
                {t.M}/{t.D} '{t.YY} {t.hh}:{t.mm} {t.A} UTC{t.ZZ}
              </span>
              <span data-testid="timeD">
                {t.h}h {t.mm}m {t.a}
              </span>
              <span data-testid="timeE">
                {t.H}h {t.mm}m
              </span>
            </div>
          )}
        </DateTime>
      );

      expect(screen.getByTestId('timeA').textContent).toBe(
        'year 1989 month 2 date 9 day 4 hours 15 minutes 45 seconds 54 milliseconds 898 0'
      );
      expect(screen.getByTestId('timeB').textContent).toBe('1989-02-09 15:45:54.898 Z');
      expect(screen.getByTestId('timeC').textContent).toBe("2/9 '89 03:45 PM UTC+0000");
      expect(screen.getByTestId('timeD').textContent).toBe('3h 45m pm');
      expect(screen.getByTestId('timeE').textContent).toBe('15h 45m');
    });
  });

  describe('Supported dates are handled', () => {
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
          <DateTime date={dateString} timezoneOffset={0}>
            {t => (
              <div>
                <span data-testid="A">
                  year: {t.year}, month: {t.month}, date: {t.date}, hours: {t.hours}, minutes:{' '}
                  {t.minutes}, seconds: {t.seconds}, milliseconds: {t.milliseconds}, timezone
                  offset: {t.timezoneOffset}
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
          <DateTime date={dateString} timezoneOffset={0}>
            {t => (
              <div>
                <span data-testid="A">
                  year: {t.year}, month: {t.month}, date: {t.date}, hours: {t.hours}, minutes:{' '}
                  {t.minutes}, seconds: {t.seconds}, milliseconds: {t.milliseconds}, timezone
                  offset: {t.timezoneOffset}
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

  describe('Unsupported dates are handled', () => {
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
        <DateTime date={input as unknown as Date} timezoneOffset={0}>
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

  describe('Supported timezones are handled', () => {
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
        <DateTime date={input} timezoneOffset={Berlin2025}>
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
        <DateTime date={input} timezoneOffset={CET2025Test}>
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
  });

  describe('Invalid timezones are handled', () => {
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
    ])(
      'invalid timezone offset invalidates the whole input | %s | %d |',
      (input, timezoneOffset) => {
        const expectedA =
          'year: NaN, month: NaN, date: NaN, hours: NaN, minutes: NaN, seconds: NaN, milliseconds: NaN, timezone offset: NaN';
        const expectedB = "#/# '## ##:##:## -- UTC####";
        const expectedC = '##.##.#### ##:##:##.### ##:##';

        render(
          <DateTime
            date={input as unknown as Date}
            timezoneOffset={timezoneOffset as unknown as number}
          >
            {t => (
              <div>
                <span data-testid="A">
                  year: {t.year}, month: {t.month}, date: {t.date}, hours: {t.hours}, minutes:{' '}
                  {t.minutes}, seconds: {t.seconds}, milliseconds: {t.milliseconds}, timezone
                  offset: {t.timezoneOffset}
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
});
