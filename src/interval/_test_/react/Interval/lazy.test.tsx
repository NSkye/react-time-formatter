import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Interval, IntervalOutput } from '@/interval/react';

describe('Interval | Lazy Token Evaluation', () => {
  const from = '1789-07-14T00:00:00Z';
  const to = '1799-11-09T00:00:00Z';

  test.each([
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.YY} years {t.MM} months {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS}{' '}
          milliseconds
        </span>
      ),
      '10 years 03 months 26 days 00 hours 00 minutes 00 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.MM} months {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
        </span>
      ),
      '123 months 26 days 00 hours 00 minutes 00 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.DD} days {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
        </span>
      ),
      '3770 days 00 hours 00 minutes 00 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.HH} hours {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
        </span>
      ),
      '90480 hours 00 minutes 00 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.mm} minutes {t.ss} seconds {t.SSS} milliseconds
        </span>
      ),
      '5428800 minutes 00 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => (
        <span data-testid="time">
          {t.ss} seconds {t.SSS} milliseconds
        </span>
      ),
      '325728000 seconds 000 milliseconds',
    ] as const,
    [
      (t: IntervalOutput) => <span data-testid="time">{t.SSS} milliseconds</span>,
      '325728000000 milliseconds',
    ] as const,
  ] as const)(
    'handles fallback to lesser units if bigger are not available',
    (childRender, expected) => {
      render(
        <Interval from={from} to={to} timezone={0}>
          {childRender}
        </Interval>
      );

      expect(screen.getByTestId('time').textContent).toBe(expected);
    }
  );
});
