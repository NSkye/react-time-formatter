import { ReactNode } from 'react';

import {
  CalendarDateBreakdownInput,
  createSafeDate,
  inferSafeDateFromCalendarDateBreakdown,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { ChildrenOrRender } from '@shared/type-helpers';

import { IntervalOutput } from '../core/extend';

export type IntervalProps = ChildrenOrRender<
  {
    from: Date | CalendarDateBreakdownInput | string | number;
    to: Date | CalendarDateBreakdownInput | string | number;
    timezone?: 'UTC' | 'Local' | TimezoneOffsetResolver | number;
  },
  (breakdown: IntervalOutput) => ReactNode
>;

export const normalizeInputDate = (date: unknown) => {
  if (date instanceof Date) return createSafeDate(date);
  if (typeof date === 'number') return createSafeDate(new Date(date));
  if (typeof date === 'string') return createSafeDate(new Date(date));
  return inferSafeDateFromCalendarDateBreakdown(date);
};

export const propsAreEqual = (oldProps: IntervalProps, newProps: IntervalProps): boolean => {
  if ((oldProps.render ?? oldProps.children) !== (newProps.render ?? newProps.children))
    return false;
  if (oldProps.timezone !== newProps.timezone) return false;

  for (const key of ['from', 'to'] as const) {
    if (normalizeInputDate(oldProps[key]) !== normalizeInputDate(newProps[key])) return false;
  }

  return true;
};
