import React, { ReactNode, memo, useRef } from 'react';

import {
  RelativeTimeBreakdownInput,
  RelativeTimeConfig,
  normalizeRelativeTimeConfig,
} from '@entities/relative-time';

import { spyOnPropertyAccess } from '@shared/access-tracker';

import { breakdownDuration } from '../core/breakdown';
import { DurationOutput, accessedToConfig, breakdownToOutput } from '../core/extend';
import { satisfiesDurationConfig } from '../core/satisfies-config';
import { useNormalizedDurationInput } from './input';

interface DurationProps {
  value: number | RelativeTimeBreakdownInput;
  children: (breakdown: DurationOutput) => ReactNode;
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

  const ms = useNormalizedDurationInput(value);

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
});

export type { DurationOutput, DurationProps };
