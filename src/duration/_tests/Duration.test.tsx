import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';

import { HOUR, MINUTE, SECOND, WEEK } from '@shared/time-primitives';

import { Duration } from '../react';

describe('Duration', () => {
  describe('Basics', () => {
    test.each([[2 * HOUR + 30 * MINUTE], [{ hours: 2, minutes: 30 }]])(
      'renders duration for each input type %s',
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

  describe('Incorrect inputs', () => {
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

  describe('Edge cases for correct inputs', () => {
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

  describe('Rendering behavior', () => {
    test('generic inputs do not trigger second render', () => {
      const spy = vi.fn(t => (
        <span data-testid="time">
          {t.HH}:{t.mm}:{t.ss}.{t.SSS}
        </span>
      ));

      render(
        <Duration of={{ hours: 6, minutes: 15, seconds: 3, milliseconds: 34 }} render={spy} />
      );

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

  describe('Units', () => {
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
                {t.YY} years {t.MM} months {t.WW} weeks {t.DD} days {t.HH} hours {t.mm} minutes{' '}
                {t.ss} seconds {t.SSS} milliseconds
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
                {t.YY} years {t.MM} months {t.WW} weeks {t.DD} days {t.HH} hours {t.mm} minutes{' '}
                {t.ss} seconds {t.SSS} milliseconds
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
});
