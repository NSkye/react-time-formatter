import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Interval } from '@/interval/react/Interval';

describe('Interval | README.md Examples', () => {
  test('#1', () => {
    render(
      <Interval from="1789-07-14" to="1799-11-09">
        {t => (
          <span data-testid="time">
            {t.YY} years {t.MM} months {t.DD} days
          </span>
        )}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe('10 years 03 months 26 days');
  });

  test('#2', () => {
    render(
      <Interval from="1789-07-14" to="1799-11-09">
        {t => <span data-testid="time">{t.DD} days</span>}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe('3770 days');
  });

  test('#3', () => {
    render(
      <Interval from={new Date('1789-07-14')} to={new Date('1799-11-09')}>
        {t => (
          <span data-testid="time">
            {t.YY} years {t.MM} months {t.DD} days
          </span>
        )}
      </Interval>
    );

    expect(screen.getByTestId('time').textContent).toBe('10 years 03 months 26 days');
  });
});
