import React, { ReactNode, memo, useRef } from 'react';

import {
  RelativeTimeBreakdownInput,
  RelativeTimeConfig,
  normalizeRelativeTimeConfig,
  relativeTimeBreakdownToMilliseconds,
} from '@entities/relative-time';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownDuration } from '../core/breakdown';
import { satisfiesDurationConfig } from '../core/satisfies-config';
import { DurationBreakdownOutput, configFromAccessed } from '../core/units';

interface DurationProps {
  value: number | RelativeTimeBreakdownInput;
  children: (breakdown: DurationBreakdownOutput) => ReactNode;
}

const defaultConfig = {
  years: true,
  months: true,
  weeks: false,
  days: true,
  hours: true,
  minutes: true,
  seconds: true,
  milliseconds: true,
};

export const Duration = memo(({ value, children }: DurationProps): JSX.Element => {
  const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
  const lastConfig = lastConfigRef.current;

  const ms = typeof value === 'object' ? relativeTimeBreakdownToMilliseconds(value) : value;

  const render = (config: RelativeTimeConfig) => {
    const breakdown = breakdownDuration(ms, normalizeRelativeTimeConfig(config));

    const [result, accessed] = spyOnPropertyAccess<
      ReactNode,
      DurationBreakdownOutput,
      typeof children
    >(breakdown, children);

    return [result, breakdown, configFromAccessed(accessed)] as const;
  };

  const [naiveResult, naiveBreakdown, newConfig] = render(lastConfig);

  // update config regardless of render results
  lastConfigRef.current = newConfig;

  if (
    satisfiesDurationConfig(newConfig, {
      ms,
      lastConfig,
      lastBreakdown: naiveBreakdown,
    })
  )
    return <>{naiveResult}</>;

  const [result] = render(newConfig);

  return <>{result}</>;
});
