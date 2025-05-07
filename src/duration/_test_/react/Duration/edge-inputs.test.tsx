import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Duration } from '@/duration/react';

describe('Duration | Edge Inputs', () => {
  test.each([
    // 1 normal hour for reference
    [{ hours: 1 }, 'T+01:00:00.000'],
    // ensure 0 and -0 are consistent
    [0, 'T+00:00:00.000'],
    [-0, 'T+00:00:00.000'],
    // still valid
    [{ seconds: 0 }, 'T+00:00:00.000'],
    // still within safe integer bounds so should pass
    [9e15, 'T+2500000000:00:00.000'],
    // same but negative
    [-9e15, 'T-2500000000:00:00.000'],
  ])('Handles input %s', (input, expected) => {
    render(
      <Duration
        of={input}
        render={t => (
          <span data-testid="time">
            T{t.totalMilliseconds < 0 ? '-' : '+'}
            {t.HH}:{t.mm}:{t.ss}.{t.SSS}
          </span>
        )}
      />
    );

    expect(screen.getByTestId('time').textContent).toBe(expected);
  });
});
