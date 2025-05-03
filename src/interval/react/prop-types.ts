import { ReactNode } from 'react';

import { RelativeTimeBreakdown } from '@entities/relative-time';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { datesAreEqual } from '@shared/date-math';

export interface IntervalProps {
  from: Date | number;
  to: Date | number;
  timezoneOffset: 'UTC' | 'Local' | TimezoneOffsetResolver | number;
  children: (breakdown: RelativeTimeBreakdown) => ReactNode;
}

export const propsAreEqual = (prevProps: IntervalProps, nextProps: IntervalProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of nextKeys as (keyof IntervalProps)[]) {
    if (key === 'to' || key === 'from') {
      if (!datesAreEqual(prevProps[key], nextProps[key])) return false;
      continue;
    }

    if (nextProps[key] !== prevProps[key]) return false;
  }

  return true;
};
