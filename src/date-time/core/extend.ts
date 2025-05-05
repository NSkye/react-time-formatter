import { CalendarDateBreakdown } from '@entities/calendar-date';

import { timezoneOffsetToUTCRepresentation } from '@shared/date-math';
import { stringifyInteger } from '@shared/stringify-integer';

// Can be extended later to const array if needed
type FormatAliases = [
  'YY',
  'YYYY',
  'M',
  'MM',
  'D',
  'DD',
  'd',
  'H',
  'HH',
  'h',
  'hh',
  'm',
  'mm',
  's',
  'ss',
  'SSS',
  'Z',
  'ZZ',
  'A',
  'a',
];

export type FormatAlias = FormatAliases[number];
export type DateTimeOutput = CalendarDateBreakdown & Record<FormatAlias, string>;

/**
 * Adds formatting aliases to CalendarDateBreakdown
 * @param breakdown
 * @returns
 */
export const breakdownToOutput = (breakdown: CalendarDateBreakdown): DateTimeOutput => {
  const { timezoneOffset } = breakdown;

  const output: CalendarDateBreakdown & Partial<Record<FormatAlias, string>> = {
    ...breakdown,
    Z: timezoneOffsetToUTCRepresentation(timezoneOffset, ':'),
    ZZ: timezoneOffsetToUTCRepresentation(timezoneOffset, ''),
  };

  [, , , output.YYYY] = stringifyInteger(breakdown.year);

  // Negative years are not supported for now
  output.YY = output.YYYY.substring(output.YYYY.length - 2);

  [output.M, output.MM] = stringifyInteger(breakdown.month);
  [output.D, output.DD] = stringifyInteger(breakdown.date);
  [output.d] = stringifyInteger(breakdown.day);
  [output.H, output.HH] = stringifyInteger(breakdown.hours);

  const hour12 = breakdown.hours % 12 <= 0 ? 12 : breakdown.hours % 12;
  const isPM = breakdown.hours >= 12;

  [output.h, output.hh] = stringifyInteger(hour12);

  output.A = isPM ? 'PM' : 'AM';
  output.a = isPM ? 'pm' : 'am';

  if (isNaN(breakdown.hours)) {
    output.A = '--';
    output.a = '--';
  }

  [output.m, output.mm] = stringifyInteger(breakdown.minutes);
  [output.s, output.ss] = stringifyInteger(breakdown.seconds);
  [, , output.SSS] = stringifyInteger(breakdown.milliseconds);

  return output as CalendarDateBreakdown & Record<FormatAlias, string>;
};
