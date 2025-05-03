import { contextify } from '@shared/contextify';
import { MINUTE } from '@shared/time-primitives';

import { DateTimeBreakdownInput } from './breakdown';
import { CalendarToken } from './tokens';

const utcGetters = {
  year: contextify(Date.prototype.getUTCFullYear),
  month: (context: Date) => Date.prototype.getUTCMonth.call(context) + 1,
  date: contextify(Date.prototype.getUTCDate),
  day: contextify(Date.prototype.getUTCDay),
  hours: contextify(Date.prototype.getUTCHours),
  minutes: contextify(Date.prototype.getUTCMinutes),
  seconds: contextify(Date.prototype.getUTCSeconds),
  milliseconds: contextify(Date.prototype.getUTCMilliseconds),
} as const satisfies Record<CalendarToken, (date: Date) => number>;

const utcSetters = {
  year: contextify(Date.prototype.setUTCFullYear),
  month: (context: unknown, month: number, ...rest: number[]) =>
    Date.prototype.setUTCMonth.call(context, month - 1, ...rest),
  date: contextify(Date.prototype.setUTCDate),
  day: contextify(Date.prototype.getUTCDay),
  hours: contextify(Date.prototype.setUTCHours),
  minutes: contextify(Date.prototype.setUTCMinutes),
  seconds: contextify(Date.prototype.setUTCSeconds),
  milliseconds: contextify(Date.prototype.setUTCMilliseconds),
} as const satisfies Record<CalendarToken, (date: Date, value: number) => number>;

export const writeCalendarToken = (
  date: Date,
  token: CalendarToken,
  value: number,
  timezoneOffset: number = date.getTimezoneOffset()
): Date => {
  const tokenSetter = utcSetters[token];

  // Create reference date where UTC time matches with timezoneOffset (incorrect timestamp)
  const referenceDate = new Date(date.valueOf() - timezoneOffset * MINUTE);

  // Update token on reference date
  tokenSetter(referenceDate, value);

  // Shift timestamp of reference date back to correct one and construct new date from it
  const changingDate = new Date(referenceDate.valueOf() + timezoneOffset * MINUTE);

  // Return resulting date
  return changingDate;
};

export const readCalendarToken = (
  date: Date,
  token: CalendarToken,
  timezoneOffset: number = date.getTimezoneOffset()
): number => {
  const tokenGetter = utcGetters[token];

  // Create reference date where UTC time matches with timezoneOffset (incorrect timestamp)
  const referenceDate = new Date(date.valueOf() - timezoneOffset * MINUTE);

  // Read UTC time from reference date
  return tokenGetter(referenceDate);
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
