import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Duration } from '@/duration/react';

describe('Duration | README.md Examples', () => {
  test('#1', () => {
    render(
      <Duration of={{ minutes: 80 }}>
        {t => (
          <span data-testid="time">
            {t.HH} hours {t.mm} minutes
          </span>
        )}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('01 hours 20 minutes');
  });

  test('#2', () => {
    render(
      <Duration of={4800000}>
        {t => (
          <span data-testid="time">
            {t.HH} hours {t.mm} minutes
          </span>
        )}
      </Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('01 hours 20 minutes');
  });
});
