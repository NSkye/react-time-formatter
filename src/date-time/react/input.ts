import { ReactNode } from 'react';

import {
  CalendarDateBreakdownInput,
  SafeDate,
  createSafeDate,
  inferSafeDateFromCalendarDateBreakdown,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { ChildrenOrRender } from '@shared/type-helpers';

import { DateTimeOutput } from '../core/extend';

export type DateTimeProps = ChildrenOrRender<
  {
    at: Date | CalendarDateBreakdownInput | string | number;
    timezone?: 'UTC' | 'Local' | number | TimezoneOffsetResolver;
  },
  (breakdown: DateTimeOutput) => ReactNode
>;

export const normalizeDateInput = (input: DateTimeProps['at']): SafeDate => {
  if (input instanceof Date) return createSafeDate(input);
  if (typeof input === 'number') return createSafeDate(new Date(input));
  if (typeof input === 'string') return createSafeDate(new Date(input));
  return inferSafeDateFromCalendarDateBreakdown(input);
};

export const propsAreEqual = (oldProps: DateTimeProps, newProps: DateTimeProps): boolean => {
  if ((oldProps.render ?? oldProps.children) !== (newProps.render ?? newProps.children))
    return false;

  if (oldProps.timezone !== newProps.timezone) return false;

  const oldTimestamp = normalizeDateInput(oldProps.at).valueOf();
  const newTimestamp = normalizeDateInput(newProps.at).valueOf();

  // Checking Object.is since if it is NaN in both cases, we consider them equal here
  return oldTimestamp === newTimestamp || Object.is(oldTimestamp, newTimestamp);
};
