import { ReactNode } from 'react';

import {
  CalendarDateBreakdownInput,
  SafeDate,
  createSafeDate,
  inferSafeDateFromCalendarDateBreakdown,
} from '@entities/calendar-date';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { DateTimeOutput } from '../core/extend';

export interface DateTimeProps {
  date: Date | CalendarDateBreakdownInput | string | number;
  timezoneOffset?: 'UTC' | 'Local' | number | TimezoneOffsetResolver;
  children: (breakdown: DateTimeOutput) => ReactNode;
}

export const normalizeDateInput = (input: DateTimeProps['date']): SafeDate => {
  if (input instanceof Date) return createSafeDate(input);
  if (typeof input === 'number') return createSafeDate(new Date(input));
  if (typeof input === 'string') return createSafeDate(new Date(input));
  return inferSafeDateFromCalendarDateBreakdown(input);
};

export const propsAreEqual = (oldProps: DateTimeProps, newProps: DateTimeProps): boolean => {
  if (oldProps.children !== newProps.children) return false;
  if (oldProps.timezoneOffset !== newProps.timezoneOffset) return false;

  const oldTimestamp = normalizeDateInput(oldProps.date).valueOf();
  const newTimestamp = normalizeDateInput(newProps.date).valueOf();

  // Checking Object.is since if it is NaN in both cases, we consider them equal here
  return oldTimestamp === newTimestamp || Object.is(oldTimestamp, newTimestamp);
};
