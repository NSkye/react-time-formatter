import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { HOUR, MINUTE, SECOND, WEEK } from '@shared/time-primitives';

import { Duration } from '@/duration/react';

describe('Duration | Basics', () => {
  test.each([[2 * HOUR + 30 * MINUTE], [{ hours: 2, minutes: 30 }]])(
    'renders duration for input type %s',
    input => {
      render(
        <Duration of={input}>
          {d => (
            <span data-testid="time">
              {d.HH}h {d.mm}m
            </span>
          )}
        </Duration>
      );
      expect(screen.getByTestId('time').textContent).toBe('02h 30m');
    }
  );

  test.each([[2 * HOUR + 30 * MINUTE], [{ hours: 2, minutes: 30 }]])(
    'falls back to displaying in smaller units when larger are not available',
    input => {
      render(
        <Duration of={input}>
          {({ minutes }) => <span data-testid="time">{minutes}m</span>}
        </Duration>
      );

      expect(screen.getByTestId('time').textContent).toBe('150m');
    }
  );

  test.each([[-(2 * HOUR + 30 * MINUTE)], [{ hours: -2, minutes: -30 }]])(
    'when negative duration is provided, only totals are showed as negative',
    input => {
      render(
        <Duration of={input}>
          {({ hours, minutes, seconds, totalMilliseconds }) => (
            <span data-testid="time">
              {hours}h {minutes}m {seconds}s | {totalMilliseconds}
            </span>
          )}
        </Duration>
      );

      expect(screen.getByTestId('time').textContent).toBe(
        `2h 30m 0s | ${-(2 * HOUR + 30 * MINUTE)}`
      );
    }
  );

  test.each([[{ weeks: 2, seconds: 19 }], [2 * WEEK + 19 * SECOND]])(
    'handles unusual time formats',
    () => {
      render(
        <Duration of={2 * WEEK + 19 * SECOND}>
          {({ weeks, seconds }) => (
            <span data-testid="time">
              I shall return in precisely {weeks} weeks and {seconds} seconds
            </span>
          )}
        </Duration>
      );

      expect(screen.getByTestId('time').textContent).toBe(
        'I shall return in precisely 2 weeks and 19 seconds'
      );
    }
  );
});
