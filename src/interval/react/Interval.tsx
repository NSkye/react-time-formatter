import React, { ReactNode, memo, useRef } from 'react';

import {
  CalendarDateBreakdownInput,
  inferDateFromCalendarDateBreakdown,
  isValidCalendarDateBreakdown,
} from '@entities/calendar-date';
import { RelativeTimeConfig } from '@entities/relative-time';
import { TimezoneOffsetResolver, createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownInterval } from '../core/breakdown';
import {
  IntervalOutput,
  accessedToConfig,
  breakdownToOutput,
  generateInvalidatedOutput,
} from '../core/extend';
import { satisfiesIntervalConfig } from '../core/satisfies-config';

/**
 * Should satisfy most of calls
 */
const defaultConfig = {
  years: true,
  months: true,
  weeks: false,
  days: true,
  hours: true,
  minutes: true,
  seconds: true,
  milliseconds: true,
} satisfies RelativeTimeConfig;

export interface IntervalProps {
  from: Date | CalendarDateBreakdownInput | string | number;
  to: Date | CalendarDateBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | TimezoneOffsetResolver | number;
  children: (breakdown: IntervalOutput) => ReactNode;
}

export const Interval = memo(
  ({ from, to, timezoneOffset = 'Local', children }: IntervalProps): JSX.Element => {
    const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
    const lastConfig = lastConfigRef.current;

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);

    const [fromDate, toDate] = [from, to]
      .map(date => {
        if (date instanceof Date) return date;
        if (typeof date === 'string') return new Date(date);
        if (typeof date === 'number') return new Date(date);
        if (isValidCalendarDateBreakdown(date)) return inferDateFromCalendarDateBreakdown(date);
        return new Date(NaN);
      })
      .sort((dateA, dateB) => dateA.valueOf() - dateB.valueOf());

    if (isNaN(fromDate.valueOf()) || isNaN(toDate.valueOf()))
      return <>{children(generateInvalidatedOutput())}</>;

    const render = (config: RelativeTimeConfig) => {
      const breakdown = breakdownInterval([fromDate, toDate], config, timezoneOffsetResolver);

      const output = breakdownToOutput([fromDate, toDate], breakdown, timezoneOffsetResolver);

      const [result, accessed] = spyOnPropertyAccess<ReactNode, IntervalOutput, typeof children>(
        output,
        children
      );

      return [result, accessedToConfig(accessed)] as const;
    };

    const [naiveResult, newConfig] = render(lastConfig);
    lastConfigRef.current = newConfig;

    if (satisfiesIntervalConfig(newConfig, lastConfig)) return <>{naiveResult}</>;

    const [result] = render(newConfig);

    return <>{result}</>;
  }
);
