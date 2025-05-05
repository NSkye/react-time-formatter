import { ReactNode } from 'react';

import {
  RelativeTimeBreakdownInput,
  relativeTimeBreakdownToMilliseconds,
  validateRelativeTimstamp,
} from '@entities/relative-time';

import { DurationOutput } from '../core/extend';

export interface DurationProps {
  value: number | RelativeTimeBreakdownInput;
  children: (breakdown: DurationOutput) => ReactNode;
}

export const normalizeDurationInput = (value: unknown): number => {
  if (typeof value === 'number') return validateRelativeTimstamp(value);

  // All other entities attempt to safely parse
  return relativeTimeBreakdownToMilliseconds(value);
};

export const propsAreEqual = (oldProps: DurationProps, newProps: DurationProps): boolean => {
  if (oldProps.children !== newProps.children) return false;

  const oldValue = normalizeDurationInput(oldProps.value);
  const newValue = normalizeDurationInput(newProps.value);

  return oldValue === newValue || Object.is(oldValue, newValue);
};
