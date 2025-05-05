import { MINUTE } from '@shared/time-primitives';

import { SafeDate, createInvalidatedSafeDate, createSafeDate } from './safe-date';
import { CALENDAR_TOKENS, CalendarToken } from './tokens';

// Base entities

interface CalendarDateBreakdownBase extends Omit<Partial<Record<CalendarToken, number>>, 'day'> {
  year?: number;
  month?: number;
  date?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;

  timezoneOffset?: number;
}

interface CalendarDateBreakdownYear extends CalendarDateBreakdownBase {
  year: number;
}
interface CalendarDateBreakdownMonth extends CalendarDateBreakdownYear {
  month: number;
}
interface CalendarDateBreakdownDate extends CalendarDateBreakdownMonth {
  date: number;
}
interface CalendarDateBreakdownHours extends CalendarDateBreakdownDate {
  hours: number;
}
interface CalendarDateBreakdownMinutes extends CalendarDateBreakdownHours {
  minutes: number;
}
interface CalendarDateBreakdownSeconds extends CalendarDateBreakdownMinutes {
  seconds: number;
}
interface CalendarDateBreakdownMilliseconds extends CalendarDateBreakdownSeconds {
  milliseconds: number;
}

// Input subset

export type CalendarDateBreakdownInput =
  | CalendarDateBreakdownYear
  | CalendarDateBreakdownMonth
  | CalendarDateBreakdownDate
  | CalendarDateBreakdownHours
  | CalendarDateBreakdownMinutes
  | CalendarDateBreakdownSeconds
  | CalendarDateBreakdownMilliseconds;

// Full type

export interface CalendarDateBreakdown extends CalendarDateBreakdownMilliseconds {
  day: number;
  timezoneOffset: number;
}

export const isValidCalendarDateBreakdown = (
  input: unknown
): input is CalendarDateBreakdownInput => {
  if (typeof input !== 'object') return false;
  if (input === null) return false;

  if (Object.prototype.hasOwnProperty.call(input, 'timezoneOffset')) {
    const offset = input['timezoneOffset' as keyof unknown] as unknown;
    if (typeof offset !== 'number') return false;
    if (Number.isNaN(offset)) return false;
    if (!Number.isSafeInteger(offset)) return false;
    if (offset > 840 || offset < -840) return false;
  }

  let skippable = true;
  for (let i = CALENDAR_TOKENS.length - 1; i >= 0; i--) {
    const token = CALENDAR_TOKENS[i];
    const hasToken = Object.prototype.hasOwnProperty.call(input, token);

    // if we found smaller token, bigger tokens should exist as well
    // expect for the day of the week that is expected to be omitted
    if (!hasToken && !skippable && token !== 'day') return false;

    if (hasToken) {
      skippable = token === 'day';

      const tokenValue = input[token as keyof unknown] as unknown;
      const isValidValue =
        typeof tokenValue === 'number' && !isNaN(tokenValue) && isFinite(tokenValue);

      if (!isValidValue) return false;
    }
  }

  return true;
};

export const inferSafeDateFromCalendarDateBreakdown = (input: unknown): SafeDate => {
  if (!isValidCalendarDateBreakdown(input)) return createInvalidatedSafeDate();

  const {
    year,
    month = 1,
    date = 1,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    timezoneOffset = 'ASSUME_LOCAL',
  } = input;

  if (timezoneOffset === 'ASSUME_LOCAL')
    return createSafeDate(new Date(year, month - 1, date, hours, minutes, seconds, milliseconds));

  const utcTimestamp = Date.UTC(year, month - 1, date, hours, minutes, seconds, milliseconds);
  return createSafeDate(new Date(utcTimestamp + timezoneOffset * MINUTE));
};
