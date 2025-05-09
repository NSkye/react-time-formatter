import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { DateTime } from '@/date-time/react/DateTime';

describe('DateTime | README.md Examples', () => {
  test('#1', () => {
    render(
      <DateTime at={new Date(1e15)}>
        {dt => (
          <span data-testid="time">
            {dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY}
          </span>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('time').textContent).toBe('##:## -- ##/## ####');
  });

  test('#2', () => {
    render(
      <DateTime at={new Date('2025-02-05T15:08:09.998')}>
        {dt => (
          <span data-testid="time">
            {dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY}
          </span>
        )}
      </DateTime>
    );

    expect(screen.getByTestId('time').textContent).toBe('03:08 PM 02/05 2025');
  });
});
