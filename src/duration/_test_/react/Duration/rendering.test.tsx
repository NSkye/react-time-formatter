import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Duration } from '@/duration/react';

describe('Duration | Rendering', () => {
  test('trivial inputs do not trigger second render', () => {
    const spy = vi.fn(t => (
      <span data-testid="time">
        {t.HH}:{t.mm}:{t.ss}.{t.SSS}
      </span>
    ));

    render(<Duration of={{ hours: 6, minutes: 15, seconds: 3, milliseconds: 34 }} render={spy} />);

    expect(screen.getByTestId('time').textContent).toBe('06:15:03.034');
    expect(spy).toHaveBeenCalledOnce();
  });

  test('unusual formats trigger 2 renders but on subsequent re-render only 1 render is triggered', () => {
    const spy = vi.fn(t => (
      <span data-testid="time">
        {t.HH}:[WHAT IS MINUTE?]:{t.ss}.{t.SSS}
      </span>
    ));

    const { rerender } = render(
      <Duration of={{ hours: 6, minutes: 15, seconds: 3, milliseconds: 34 }}>{spy}</Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('06:[WHAT IS MINUTE?]:903.034');

    // Has to re-render because of unexpected format not containing minutes
    expect(spy).toHaveBeenCalledTimes(2);

    rerender(
      <Duration of={{ hours: 6, minutes: 1, seconds: 3, milliseconds: 34 }}>{spy}</Duration>
    );

    expect(screen.getByTestId('time').textContent).toBe('06:[WHAT IS MINUTE?]:63.034');

    // Already expects previous format, so can render only once
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
