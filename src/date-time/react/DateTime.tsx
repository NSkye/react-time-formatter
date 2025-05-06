import React, { memo } from 'react';

import { createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { breakdownDateTime } from '../core/breakdown';
import { DateTimeOutput, breakdownToOutput } from '../core/extend';
import { DateTimeProps, normalizeDateInput, propsAreEqual } from './input';

const DateTime = memo(
  ({ at, timezone = 'Local', children, render }: DateTimeProps): JSX.Element => {
    const safeDate = normalizeDateInput(at);
    const renderer = render ?? children;

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezone);
    const timezoneOffsetMinutes = timezoneOffsetResolver(safeDate);

    const breakdown = breakdownDateTime(safeDate, timezoneOffsetMinutes);
    const output = breakdownToOutput(breakdown);

    return <>{renderer(output)}</>;
  },
  propsAreEqual
);

DateTime.displayName = 'DateTime';

export { DateTime };
export type { DateTimeOutput, DateTimeProps };
