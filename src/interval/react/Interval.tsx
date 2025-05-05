import React, { ReactNode, memo, useRef } from 'react';

import { RelativeTimeConfig } from '@entities/relative-time';
import { createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownInterval } from '../core/breakdown';
import { IntervalOutput, accessedToConfig, breakdownToOutput } from '../core/extend';
import { satisfiesIntervalConfig } from '../core/satisfies-config';
import { IntervalProps, normalizeInputDate, propsAreEqual } from './input';

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

const Interval = memo(
  ({ from, to, timezoneOffset = 'Local', children }: IntervalProps): JSX.Element => {
    const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
    const lastConfig = lastConfigRef.current;

    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezoneOffset);

    const [fromDate, toDate] = [from, to].map(normalizeInputDate);

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
  },
  propsAreEqual
);

Interval.displayName = 'Interval';

export { Interval };
export type { IntervalOutput, IntervalProps };
