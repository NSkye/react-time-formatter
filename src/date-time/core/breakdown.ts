import { CALENDAR_TOKENS, DateTimeBreakdown, readCalendarToken } from '@entities/date-time';

// Output superset with formatting aliases
export interface DateTimeBreakdownOutput extends DateTimeBreakdown {
  YY: string;
  YYYY: string;
  M: string;
  MM: string;
  D: string;
  DD: string;
  d: string;
  H: string;
  HH: string;
  h: string;
  hh: string;
  m: string;
  mm: string;
  s: string;
  ss: string;
  SSS: string;
  Z: string;
  ZZ: string;
  A: string;
  a: string;
}

const timezoneOffsetToUTCRepresentation = (offsetMin: number, delimiter = '') => {
  if (offsetMin === 0 && delimiter === ':') return 'Z'; // ISO 8601 Z shorthand

  const hours = String(Math.abs(Math.floor(offsetMin / 60))).padStart(2, '0');
  const minutes = String(Math.abs(offsetMin % 60)).padStart(2, '0');

  // negative offset means positive UTC
  // offset -120 -> UTC+02:00
  const sign = offsetMin <= 0 ? '+' : '-';

  return `${sign}${hours}${delimiter}${minutes}`;
};

const stringifyTokenValue = (value: number, pad: number[] = [1, 2]) =>
  pad.map(padSize => String(value).padStart(padSize, '0'));

export const breakdownDateTime = (date: Date, timezoneOffset: number) => {
  const breakdownResult: Partial<DateTimeBreakdownOutput> = {
    timezoneOffset,
    Z: timezoneOffsetToUTCRepresentation(timezoneOffset, ':'),
    ZZ: timezoneOffsetToUTCRepresentation(timezoneOffset, ''),
  };

  for (const token of CALENDAR_TOKENS) {
    const tokenValue = readCalendarToken(date, token, timezoneOffset);
    breakdownResult[token] = tokenValue;

    if (token === 'year') {
      const tokenValueStr = String(tokenValue);
      breakdownResult.YY = tokenValueStr.substring(tokenValueStr.length - 2);
      breakdownResult.YYYY = tokenValueStr;
    }

    if (token === 'month') {
      [breakdownResult.M, breakdownResult.MM] = stringifyTokenValue(tokenValue);
    }

    if (token === 'date') {
      [breakdownResult.D, breakdownResult.DD] = stringifyTokenValue(tokenValue);
    }

    if (token === 'day') {
      [breakdownResult.d] = stringifyTokenValue(tokenValue);
    }

    if (token === 'hours') {
      [breakdownResult.H, breakdownResult.HH] = stringifyTokenValue(tokenValue);

      const hour12 = tokenValue % 12 || 12;
      const isPM = tokenValue >= 12;

      [breakdownResult.h, breakdownResult.hh] = stringifyTokenValue(hour12);
      [breakdownResult.h, breakdownResult.hh] = stringifyTokenValue(hour12);
      breakdownResult.A = isPM ? 'PM' : 'AM';
      breakdownResult.a = isPM ? 'pm' : 'am';
    }

    if (token === 'minutes') {
      [breakdownResult.m, breakdownResult.mm] = stringifyTokenValue(tokenValue);
    }

    if (token === 'seconds') {
      [breakdownResult.s, breakdownResult.ss] = stringifyTokenValue(tokenValue);
    }

    if (token === 'milliseconds') {
      [breakdownResult.SSS] = stringifyTokenValue(tokenValue, [3]);
    }
  }

  return breakdownResult as DateTimeBreakdownOutput;
};
