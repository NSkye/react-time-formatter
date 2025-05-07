import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Duration } from '@/duration/react';

describe('Duratione | Units', () => {
  test('with correct value', () => {
    render(
      <Duration
        of={{
          years: 4,
          months: 6,
          weeks: 2,
          days: 4,
          hours: 15,
          minutes: 58,
          seconds: 32,
          milliseconds: 24,
        }}
      >
        {t => (
          <div>
            <span data-testid="AliasesA">
              {t.YY} years {t.MM} months {t.WW} weeks {t.DD} days {t.HH} hours {t.mm} minutes {t.ss}{' '}
              seconds {t.SSS} milliseconds
            </span>
            <span data-testid="AliasesB">
              {t.Y} years {t.M} months {t.W} weeks {t.D} days {t.H} hours {t.m} minutes {t.s}{' '}
              seconds {t.milliseconds} milliseconds
            </span>
            <span data-testid="RawValues">
              {t.years} years {t.months} months {t.weeks} weeks {t.days} days {t.hours} hours{' '}
              {t.minutes} minutes {t.seconds} seconds {t.milliseconds} milliseconds
            </span>
            <span data-testid="Totals">
              {t.totalYears} years {t.totalMonths} months {t.totalWeeks} weeks {t.totalDays} days{' '}
              {t.totalHours} hours {t.totalMinutes} minutes {t.totalSeconds} seconds{' '}
              {t.totalMilliseconds} milliseconds
            </span>
          </div>
        )}
      </Duration>
    );

    expect(screen.getByTestId('AliasesA').textContent).toBe(
      '04 years 06 months 02 weeks 04 days 15 hours 58 minutes 32 seconds 024 milliseconds'
    );
    expect(screen.getByTestId('AliasesB').textContent).toBe(
      '4 years 6 months 2 weeks 4 days 15 hours 58 minutes 32 seconds 24 milliseconds'
    );
    expect(screen.getByTestId('RawValues').textContent).toBe(
      '4 years 6 months 2 weeks 4 days 15 hours 58 minutes 32 seconds 24 milliseconds'
    );
    expect(screen.getByTestId('Totals').textContent).toBe(
      '4 years 55 months 236 weeks 1658 days 39807 hours 2388478 minutes 143308712 seconds 143308712024 milliseconds'
    );
  });

  test('with invalid value', () => {
    render(
      <Duration
        of={Infinity}
        render={t => (
          <div>
            <span data-testid="AliasesA">
              {t.YY} years {t.MM} months {t.WW} weeks {t.DD} days {t.HH} hours {t.mm} minutes {t.ss}{' '}
              seconds {t.SSS} milliseconds
            </span>
            <span data-testid="AliasesB">
              {t.Y} years {t.M} months {t.W} weeks {t.D} days {t.H} hours {t.m} minutes {t.s}{' '}
              seconds {t.SSS} milliseconds
            </span>
            <span data-testid="RawValues">
              {t.years} years {t.months} months {t.weeks} weeks {t.days} days {t.hours} hours{' '}
              {t.minutes} minutes {t.seconds} seconds {t.milliseconds} milliseconds
            </span>
            <span data-testid="Totals">
              {t.totalYears} years {t.totalMonths} months {t.totalWeeks} weeks {t.totalDays} days{' '}
              {t.totalHours} hours {t.totalMinutes} minutes {t.totalSeconds} seconds{' '}
              {t.totalMilliseconds} milliseconds
            </span>
          </div>
        )}
      />
    );

    expect(screen.getByTestId('AliasesA').textContent).toBe(
      '## years ## months ## weeks ## days ## hours ## minutes ## seconds ### milliseconds'
    );
    expect(screen.getByTestId('AliasesB').textContent).toBe(
      '# years # months # weeks # days # hours # minutes # seconds ### milliseconds'
    );
    expect(screen.getByTestId('RawValues').textContent).toBe(
      'NaN years NaN months NaN weeks NaN days NaN hours NaN minutes NaN seconds NaN milliseconds'
    );
    expect(screen.getByTestId('Totals').textContent).toBe(
      'NaN years NaN months NaN weeks NaN days NaN hours NaN minutes NaN seconds NaN milliseconds'
    );
  });
});
