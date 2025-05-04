import { MINUTE } from '@shared/time-primitives';

import { CALENDAR_TOKENS, CalendarToken } from './tokens';

// Base entities

interface DateTimeBreakdownBase extends Omit<Partial<Record<CalendarToken, number>>, 'day'> {
  year?: number;
  month?: number;
  date?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;

  timezoneOffset?: number | 'UTC' | 'Local';
}

interface DateTimeBreakdownYear extends DateTimeBreakdownBase {
  year: number;
}
interface DateTimeBreakdownMonth extends DateTimeBreakdownYear {
  month: number;
}
interface DateTimeBreakdownDate extends DateTimeBreakdownMonth {
  date: number;
}
interface DateTimeBreakdownHours extends DateTimeBreakdownDate {
  hours: number;
}
interface DateTimeBreakdownMinutes extends DateTimeBreakdownHours {
  minutes: number;
}
interface DateTimeBreakdownSeconds extends DateTimeBreakdownMinutes {
  seconds: number;
}
interface DateTimeBreakdownMilliseconds extends DateTimeBreakdownSeconds {
  milliseconds: number;
}

// Input subset

export type DateTimeBreakdownInput =
  | DateTimeBreakdownYear
  | DateTimeBreakdownMonth
  | DateTimeBreakdownDate
  | DateTimeBreakdownHours
  | DateTimeBreakdownMinutes
  | DateTimeBreakdownSeconds
  | DateTimeBreakdownMilliseconds;

// Full type

export interface DateTimeBreakdown extends DateTimeBreakdownMilliseconds {
  day: number;
  timezoneOffset: number;
}

export const isValidDateTimeBreakdown = (input: unknown): input is DateTimeBreakdownInput => {
  if (typeof input !== 'object') return false;
  if (input === null) return false;

  if (Object.prototype.hasOwnProperty.call(input, 'timezoneOffset')) {
    const offset = input['timezoneOffset' as keyof unknown] as unknown;
    if (typeof offset === 'number') {
      if (offset === -Infinity || offset === Infinity || isNaN(offset)) return false;
    } else if (offset !== 'Local' && offset !== 'UTC') return false;
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
        typeof tokenValue === 'number' &&
        !isNaN(tokenValue) &&
        tokenValue !== Infinity &&
        tokenValue !== -Infinity;

      if (!isValidValue) return false;
    }
  }

  return true;
};

export const inferDateFromDateTimeBreakdown = (input: DateTimeBreakdownInput): Date => {
  const {
    year,
    month = 1,
    date = 1,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    timezoneOffset = 'Local',
  } = input;

  if (timezoneOffset === 'Local')
    return new Date(year, month - 1, date, hours, minutes, seconds, milliseconds);

  const offsetInMinutes = timezoneOffset === 'UTC' ? 0 : timezoneOffset;

  const utcTimestamp = Date.UTC(year, month - 1, date, hours, minutes, seconds, milliseconds);

  return new Date(utcTimestamp + offsetInMinutes * MINUTE);
};
