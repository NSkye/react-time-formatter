import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { YEAR } from '@shared/time-primitives';

import { DateTime } from '../react/DateTime';

describe('DateTime', () => {
  test('renders local time correctly', () => {
    const localDate = '2025-04-02T12:58:01';
    const expected = '12h 58m 1s';

    render(
      <DateTime date={localDate}>
        {({ hours, minutes, seconds }) => (
          <span data-testid="time">{`${hours}h ${minutes}m ${seconds}s`}</span>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });

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

  test('renders date with timezone offset correctly', () => {
    const expected = '2025.04.02 12:00 UTC+02:00';
    const UTCPlus2 = -120; // UTC+2;

    render(
      <DateTime
        date={{
          year: 2025,
          month: 4,
          date: 2,
          hours: 10,
          timezoneOffset: 'UTC',
        }}
        timezoneOffset={UTCPlus2}
      >
        {t => (
          <span data-testid="time">{`${t.YYYY}.${t.MM}.${t.DD} ${t.HH}:${t.mm} UTC${t.Z}`}</span>
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
          timezoneOffset: 'UTC',
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
