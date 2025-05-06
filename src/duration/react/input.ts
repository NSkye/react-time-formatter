import { ReactNode } from 'react';

import {
  RelativeTimeBreakdownInput,
  relativeTimeBreakdownToMilliseconds,
  validateRelativeTimstamp,
} from '@entities/relative-time';

import { ChildrenOrRender } from '@shared/type-helpers';

import { DurationOutput } from '../core/extend';

export type DurationProps = ChildrenOrRender<
  {
    of: number | RelativeTimeBreakdownInput;
  },
  (breakdown: DurationOutput) => ReactNode
>;

export const normalizeDurationInput = (value: unknown): number => {
  if (typeof value === 'number') return validateRelativeTimstamp(value);

  // All other entities attempt to safely parse
  return relativeTimeBreakdownToMilliseconds(value);
};

export const propsAreEqual = (oldProps: DurationProps, newProps: DurationProps): boolean => {
  if ((oldProps.render ?? oldProps.children) !== (oldProps.render ?? newProps.children))
    return false;

  const oldValue = normalizeDurationInput(oldProps.of);
  const newValue = normalizeDurationInput(newProps.of);

  return oldValue === newValue || Object.is(oldValue, newValue);
};
