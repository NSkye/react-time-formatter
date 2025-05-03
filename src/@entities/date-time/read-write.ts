import { stripContext } from '@shared/strip-context';
import { MINUTE } from '@shared/time-primitives';

import { DateTimeBreakdownInput } from './breakdown';
import { CalendarToken } from './tokens';

const utcGetters = {
  year: stripContext(Date.prototype.getUTCFullYear),
  month: stripContext(Date.prototype.getUTCMonth),
  date: stripContext(Date.prototype.getUTCDate),
  day: stripContext(Date.prototype.getUTCDay),
  hours: stripContext(Date.prototype.getUTCHours),
  minutes: stripContext(Date.prototype.getUTCMinutes),
  seconds: stripContext(Date.prototype.getUTCSeconds),
  milliseconds: stripContext(Date.prototype.getUTCMilliseconds),
} as const satisfies Record<CalendarToken, unknown>;

const utcSetters = {
  year: stripContext(Date.prototype.setUTCFullYear),
  month: stripContext(Date.prototype.setUTCMonth),
  date: stripContext(Date.prototype.setUTCDate),
  day: stripContext(Date.prototype.getUTCDay),
  hours: stripContext(Date.prototype.setUTCHours),
  minutes: stripContext(Date.prototype.setUTCMinutes),
  seconds: stripContext(Date.prototype.setUTCSeconds),
  milliseconds: stripContext(Date.prototype.setUTCMilliseconds),
} as const satisfies Record<CalendarToken, unknown>;

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
