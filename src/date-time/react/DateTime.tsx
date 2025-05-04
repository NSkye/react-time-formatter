import React, { ReactNode, memo } from 'react';

import {
  CalendarDateBreakdownInput,
  inferDateFromCalendarDateBreakdown,
  isValidCalendarDateBreakdown,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver, createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { breakdownDateTime } from '../core/breakdown';
import { DateTimeOutput, breakdownToOutput } from '../core/extend';

interface DateTimeProps {
  date: Date | CalendarDateBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | number | TimezoneOffsetResolver;
  children: (breakdown: DateTimeOutput) => ReactNode;
}

export const DateTime = memo(
  ({ date, timezoneOffset = 'Local', children }: DateTimeProps): JSX.Element => {
    const dateObject = (() => {
      if (date instanceof Date) return date;
      if (typeof date === 'string') return new Date(date);
      if (typeof date === 'number') return new Date(date);
      if (isValidCalendarDateBreakdown(date)) return inferDateFromCalendarDateBreakdown(date);

      // Invalidate manually
      return new Date(NaN);
    })();

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);
    const timezoneOffsetMinutes = timezoneOffsetResolver(dateObject);

    const breakdown = breakdownDateTime(dateObject, timezoneOffsetMinutes);
    const output = breakdownToOutput(breakdown);

    return <>{children(output)}</>;
  }
);
