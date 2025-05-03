import React, { ReactNode, memo, useRef } from 'react';

import { RelativeTimeBreakdown, RelativeTimeConfig } from '@entities/relative-time';
import { createDefaultTimezoneOffsetResolver } from '@entities/timezone';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownInterval } from '../core/breakdown';
import { satisfiesIntervalConfig } from '../core/satisfies-config';
import { IntervalProps, propsAreEqual } from './prop-types';

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

export const Interval = memo(
  ({ from, to, timezoneOffset = 'Local', children }: IntervalProps): JSX.Element => {
    const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
    const lastConfig = lastConfigRef.current;

    const render = (config: RelativeTimeConfig) => {
      const breakdown = breakdownInterval(
        [from, to],
        config,
        createDefaultTimezoneOffsetResolver(timezoneOffset)
      );

      const [result, newConfig] = spyOnPropertyAccess<
        ReactNode,
        RelativeTimeBreakdown,
        typeof children
      >(breakdown, children);

      return [result, newConfig] as const;
    };

    const [naiveResult, newConfig] = render(lastConfig);
    lastConfigRef.current = newConfig;

    if (satisfiesIntervalConfig(newConfig, lastConfig)) return <>{naiveResult}</>;

    const [result] = render(newConfig);

    return <>{result}</>;
  },
  propsAreEqual
);
