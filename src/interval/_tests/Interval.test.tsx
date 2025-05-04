import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Interval } from '../react/Interval';

const TestDSTTimezone = (date: Date): number => {
  const month = date.getUTCMonth(); // 0 = January

  if (month >= 2 && month <= 9) {
    return -120; // DST: UTC+2 (offset -120 mins)
  }

  return -60; // Standard Time: UTC+1 (offset -60 mins)
};

const getDate = (iso: string) => new Date(iso);

describe('Interval', () => {
  test.each([
    ['2025-01-01T00:00:00Z', 90_000, '1m 30s'],
    ['2025-02-01T12:00:00Z', 90_000, '1m 30s'],
    ['2024-12-31T23:59:00Z', 90_000, '1m 30s'],
  ])(
    'computes same duration from different calendar bases %s %d %s',
    (fromIso, offsetMs, expected) => {
      const from = getDate(fromIso);
      const to = new Date(from.getTime() + offsetMs);

      render(
        <Interval from={from} to={to}>
          {({ minutes, seconds }) => <span data-testid="time">{`${minutes}m ${seconds}s`}</span>}
        </Interval>
      );

      expect(screen.getByTestId('time').textContent).toBe(expected);
    }
  );

  test('handles DST forward jump (1h gap) correctly', () => {
    const from = getDate('2024-03-31T01:00:00Z'); // UTC
    const to = getDate('2024-03-31T03:00:00Z'); // UTC

    render(
      <Interval from={from} to={to} timezoneOffset={TestDSTTimezone}>
        {({ hours }) => <span data-testid="time">{`${hours} hours`}</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe('2 hours');
  });

  test('handles DST backward jump (1h repeat) correctly', () => {
    const from = getDate('2024-10-27T01:00:00Z'); // UTC
    const to = getDate('2024-10-27T02:00:00Z'); // UTC

    render(
      <Interval from={from} to={to} timezoneOffset={TestDSTTimezone}>
        {({ hours }) => <span data-testid="time">{`${hours} hours`}</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe('1 hours');
  });
});
