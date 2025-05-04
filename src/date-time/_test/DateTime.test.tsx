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
});
