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

const Duration = memo((props: DurationProps): JSX.Element => {
  const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
  const lastConfig = lastConfigRef.current;

  const renderer = props.render ?? props.children;
  const ms = normalizeDurationInput(props.of);

  const runRender = (config: RelativeTimeConfig) => {
    const breakdown = breakdownDuration(ms, normalizeRelativeTimeConfig(config));
    const output = breakdownToOutput(ms, breakdown);

    const [result, accessed] = spyOnPropertyAccess<ReactNode, DurationOutput, typeof renderer>(
      output,
      renderer
    );

    return [result, breakdown, accessedToConfig(accessed)] as const;
  };

  const [naiveResult, naiveBreakdown, newConfig] = runRender(lastConfig);

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

  const [result] = runRender(newConfig);

  return <>{result}</>;
}, propsAreEqual);

Duration.displayName = 'Duration';

export { Duration };
export type { DurationOutput, DurationProps };
