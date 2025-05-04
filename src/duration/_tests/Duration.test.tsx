import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { HOUR, MINUTE, SECOND, WEEK } from '@shared/time-primitives';

import { Duration } from '../react';

describe('Duration', () => {
  test('renders duration correctly', () => {
    render(
      <Duration value={2 * HOUR + 30 * MINUTE}>
        {({ HH, mm }) => (
          <span data-testid="time">
            {HH}h {mm}m
          </span>
        )}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('02h 30m');
  });

  test('falls back to displaying in smaller units when larger are not specified', () => {
    render(
      <Duration value={2 * HOUR + 30 * MINUTE}>
        {({ minutes }) => <span data-testid="time">{minutes}m</span>}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('150m');
  });

  test('handles unusual time formats', () => {
    render(
      <Duration value={2 * WEEK + 10 * SECOND}>
        {({ weeks, seconds }) => (
          <span data-testid="time">
            Last tea party was exactly {weeks} weeks and {seconds} seconds ago
          </span>
        )}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe(
      'Last tea party was exactly 2 weeks and 10 seconds ago'
    );
  });

  test.todo(
    'handles invalid input: functions, null, undefined, invalid dates, etc. - returns invalidated state'
  );
  test.todo(
    'handles invalid input: dates - typescript forbids but if passed will resolve to timestamp with console warning'
  );
  test.todo('handles -Inifnity and +Infinity');
  test.todo('handles 0 and -0');
  test.todo('handles NaN');
  test.todo('handles huge numbers like 1e20');
  test.todo('single render on sane inputs');
  test.todo('follow-up renders even for unusual formats do not double-render');
  test.todo('handles all units and aliases correctly');
});
