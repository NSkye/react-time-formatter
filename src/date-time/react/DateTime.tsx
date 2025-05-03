import React, { ReactNode, memo, useMemo } from 'react';

import {
  CALENDAR_TOKENS,
  DateTimeBreakdownInput,
  DateTimeBreakdownOutput,
} from '@entities/date-time';
import { inferDateFromDateTimeBreakdown, readCalendarToken } from '@entities/date-time/read-write';
import { TimezoneOffsetResolver, createDefaultTimezoneOffsetResolver } from '@entities/timezone';

interface DateTimeProps {
  date: Date | DateTimeBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | number | TimezoneOffsetResolver;
  children: (breakdown: DateTimeBreakdownOutput) => ReactNode;
}

export const DateTime = memo(
  ({ date, timezoneOffset = 'Local', children }: DateTimeProps): JSX.Element => {
    const dateObj = (() => {
      if (date instanceof Date) return date;
      if (typeof date === 'string') return new Date(date);
      if (typeof date === 'number') return new Date(date);

      return inferDateFromDateTimeBreakdown(date);
    })();

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);
    const timezoneOffsetMinutes = timezoneOffsetResolver(dateObj);

    const breakdown = useMemo(() => {
      const breakdownResult: Partial<DateTimeBreakdownOutput> = {
        timezoneOffset: timezoneOffsetMinutes,
      };

      for (const token of CALENDAR_TOKENS) {
        breakdownResult[token] = readCalendarToken(dateObj, token, timezoneOffsetMinutes);
      }

      return breakdownResult as DateTimeBreakdownOutput;
    }, [dateObj, timezoneOffsetMinutes]);

    return <>{children(breakdown)}</>;
  }
);
