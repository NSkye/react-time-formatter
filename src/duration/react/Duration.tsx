import React, { ReactNode, memo, useRef } from 'react';

import { RelativeTimeConfig, normalizeRelativeTimeConfig } from '@entities/relative-time';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownDuration } from '../core/breakdown';
import { DurationOutput, accessedToConfig, breakdownToOutput } from '../core/extend';
import { satisfiesDurationConfig } from '../core/satisfies-config';
import { DurationProps, normalizeDurationInput, propsAreEqual } from './input';

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

const Duration = memo(({ value, children }: DurationProps): JSX.Element => {
  const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
  const lastConfig = lastConfigRef.current;

  const ms = normalizeDurationInput(value);

  const render = (config: RelativeTimeConfig) => {
    const breakdown = breakdownDuration(ms, normalizeRelativeTimeConfig(config));
    const output = breakdownToOutput(ms, breakdown);

    const [result, accessed] = spyOnPropertyAccess<ReactNode, DurationOutput, typeof children>(
      output,
      children
    );

    return [result, breakdown, accessedToConfig(accessed)] as const;
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
}, propsAreEqual);

Duration.displayName = 'Duration';

export { Duration };
export type { DurationOutput, DurationProps };
