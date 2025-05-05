import React, { memo } from 'react';

import { createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { breakdownDateTime } from '../core/breakdown';
import { DateTimeOutput, breakdownToOutput } from '../core/extend';
import { DateTimeProps, normalizeDateInput, propsAreEqual } from './input';

const DateTime = memo(
  ({ date, timezoneOffset = 'Local', children }: DateTimeProps): JSX.Element => {
    const safeDate = normalizeDateInput(date);

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);
    const timezoneOffsetMinutes = timezoneOffsetResolver(safeDate);

    const breakdown = breakdownDateTime(safeDate, timezoneOffsetMinutes);
    const output = breakdownToOutput(breakdown);

    return <>{children(output)}</>;
  },
  propsAreEqual
);

DateTime.displayName = 'DateTime';

export { DateTime };
export type { DateTimeOutput, DateTimeProps };
