import React, { ReactNode, memo } from 'react';

import { CalendarDateBreakdownInput } from '@entities/calendar-date';
import { TimezoneOffsetResolver, createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { breakdownDateTime } from '../core/breakdown';
import { DateTimeOutput, breakdownToOutput } from '../core/extend';
import { useNormalizedDateInput } from './input';

interface DateTimeProps {
  date: Date | CalendarDateBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | number | TimezoneOffsetResolver;
  children: (breakdown: DateTimeOutput) => ReactNode;
}

export const DateTime = memo(
  ({ date, timezoneOffset = 'Local', children }: DateTimeProps): JSX.Element => {
    const safeDate = useNormalizedDateInput(date);

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);
    const timezoneOffsetMinutes = timezoneOffsetResolver(safeDate);

    const breakdown = breakdownDateTime(safeDate, timezoneOffsetMinutes);
    const output = breakdownToOutput(breakdown);

    return <>{children(output)}</>;
  }
);
