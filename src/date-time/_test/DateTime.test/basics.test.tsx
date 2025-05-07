import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { YEAR } from '@shared/time-primitives';

import { DateTime } from '@/date-time/react/DateTime';

describe('DateTime | Basics', () => {
  test.each([
    ['2525-01-02', 'year: 2525, month: 1, date: 2'],
    ['3535-03-04', 'year: 3535, month: 3, date: 4'],
    ['4545-05-06', 'year: 4545, month: 5, date: 6'],
    ['5555-07-08', 'year: 5555, month: 7, date: 8'],
    ['6565-09-10', 'year: 6565, month: 9, date: 10'],
    ['7510-11-12', 'year: 7510, month: 11, date: 12'],
    ['8510-12-14', 'year: 8510, month: 12, date: 14'],
    ['9595-12-15', 'year: 9595, month: 12, date: 15'],
    ['9999-12-30', 'year: 9999, month: 12, date: 30'],
    ['1000-01-02', 'year: 1000, month: 1, date: 2'],
  ])('renders local date %s correctly, months are 0-indexed', (date, expected) => {
    render(
      <DateTime
        at={new Date(date)}
        render={({ year, month, date }) => (
          <span data-testid="OUTPUT">{`year: ${year}, month: ${month}, date: ${date}`}</span>
        )}
      />
    );

    expect(screen.getByTestId('OUTPUT').textContent).toBe(expected);
  });

  test('renders date from timestamp', () => {
    render(<DateTime at={0}>{({ year }) => <span data-testid="time">{year}</span>}</DateTime>);

    expect(screen.getByTestId('time').textContent).toBe('1970');
  });

  test('renders date from negative timestamp', () => {
    render(
      <DateTime at={-1 * YEAR}>{({ year }) => <span data-testid="time">{year}</span>}</DateTime>
    );

    expect(screen.getByTestId('time').textContent).toBe('1969');
  });

  test('renders all aliases correctly', () => {
    render(
      <DateTime
        at={{
          year: 1989,
          month: 2,
          date: 9,
          hours: 15,
          minutes: 45,
          seconds: 54,
          milliseconds: 898,
          timezoneOffset: 0,
        }}
        timezone="UTC"
        render={t => (
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
      />
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
