import { ReactNode } from 'react';

import {
  CalendarDateBreakdownInput,
  createSafeDate,
  inferSafeDateFromCalendarDateBreakdown,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { IntervalOutput } from '../core/extend';

export interface IntervalProps {
  from: Date | CalendarDateBreakdownInput | string | number;
  to: Date | CalendarDateBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | TimezoneOffsetResolver | number;
  children: (breakdown: IntervalOutput) => ReactNode;
}

export const normalizeInputDate = (date: unknown) => {
  if (date instanceof Date) return createSafeDate(date);
  if (typeof date === 'number') return createSafeDate(new Date(date));
  if (typeof date === 'string') return createSafeDate(new Date(date));
  return inferSafeDateFromCalendarDateBreakdown(date);
};

export const propsAreEqual = (oldProps: IntervalProps, newProps: IntervalProps): boolean => {
  if (oldProps.children !== newProps.children) return false;
  if (oldProps.timezoneOffset !== newProps.timezoneOffset) return false;

  for (const key of ['from', 'to'] as const) {
    if (normalizeInputDate(oldProps[key]) !== normalizeInputDate(newProps[key])) return false;
  }

  return true;
};
