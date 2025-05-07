import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Duration } from '@/duration/react';

describe('Duration | Invalid inputs', () => {
  test('handles even correct dates as invalid input', () => {
    // dates are not suitable for representing duration and should
    // be manually converted to timestamps if really needed,
    // all explicit date passings should be denied to avoid confusion
    render(
      <Duration of={new Date('2025-01-01T00:00:00.000Z') as unknown as number}>
        {t => (
          <span data-testid="time">
            {t.H}h {t.m}m {t.s}s
          </span>
        )}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('#h #m #s');
  });

  test.each([
    1e20,
    null,
    undefined,
    Infinity,
    -Infinity,
    NaN,
    'random string',
    new Date('Invalid!'),
    {},
    () => {},
  ])('handles random junk input and invalidates the output: %s', junk => {
    render(
      <Duration
        of={junk as unknown as number}
        render={t => (
          <span data-testid="time">
            {t.H}h {t.m}m {t.s}s
          </span>
        )}
      />
    );

    expect(screen.getByTestId('time').textContent).toBe('#h #m #s');
  });
});
