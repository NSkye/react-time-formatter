import React, { ReactNode, memo } from 'react';

import { DateTimeBreakdownInput } from '@entities/date-time';
import { inferDateFromDateTimeBreakdown } from '@entities/date-time/read-write';
import { TimezoneOffsetResolver, createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { DateTimeBreakdownOutput, breakdownDateTime } from '../core/breakdown';

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

    const breakdown = breakdownDateTime(dateObj, timezoneOffsetMinutes);

    return <>{children(breakdown)}</>;
  }
);
