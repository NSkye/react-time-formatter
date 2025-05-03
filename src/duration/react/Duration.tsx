import React, { memo, ReactNode, useRef } from "react";
import { satisfiesDurationConfig } from "../core/satisfies-config";
import { breakdownDuration } from "../core/breakdown";
import {
  normalizeRelativeTimeConfig,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
} from "@entities/relative-time";
import { spyOnPropertyAccess } from "@shared/access-tracker";

interface DurationProps {
  ms: number;
  children: (breakdown: RelativeTimeBreakdown) => ReactNode;
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

export const Duration = memo(({ ms, children }: DurationProps): JSX.Element => {
  const lastConfigRef = useRef<RelativeTimeConfig>(defaultConfig);
  const lastConfig = lastConfigRef.current;

  const render = (config: RelativeTimeConfig) => {
    const breakdown = breakdownDuration(
      ms,
      normalizeRelativeTimeConfig(config),
    );

    const [result, newConfig] = spyOnPropertyAccess<
      ReactNode,
      RelativeTimeBreakdown,
      typeof children
    >(breakdown, children);

    return [result, breakdown, newConfig] as const;
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
