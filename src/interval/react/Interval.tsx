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
  ({ from, to, timezone = 'Local', children, render }: IntervalProps): JSX.Element => {
    const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
    const lastConfig = lastConfigRef.current;

    const renderer = render ?? children;
    const timezoneOffsetResolver = createDefaultTimezoneOffsetResolver(timezone);

    const [fromDate, toDate] = [from, to].map(normalizeInputDate);

    const runRender = (config: RelativeTimeConfig) => {
      const breakdown = breakdownInterval([fromDate, toDate], config, timezoneOffsetResolver);
      const output = breakdownToOutput([fromDate, toDate], breakdown, timezoneOffsetResolver);

      const [result, accessed] = spyOnPropertyAccess<ReactNode, IntervalOutput, typeof renderer>(
        output,
        renderer
      );

      return [result, accessedToConfig(accessed)] as const;
    };

    const [naiveResult, newConfig] = runRender(lastConfig);
    lastConfigRef.current = newConfig;

    if (satisfiesIntervalConfig(newConfig, lastConfig)) return <>{naiveResult}</>;

    const [result] = runRender(newConfig);

    return <>{result}</>;
  },
  propsAreEqual
);

Interval.displayName = 'Interval';

export { Interval };
export type { IntervalOutput, IntervalProps };
