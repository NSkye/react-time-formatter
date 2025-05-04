import { DateTimeBreakdown } from '@entities/date-time';

import { timezoneOffsetToUTCRepresentation } from '@shared/date-math';
import { stringifyInteger } from '@shared/stringify-number';

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
export type DateTimeOutput = DateTimeBreakdown & Record<FormatAlias, string>;

/**
 * Adds formatting aliases to DateTimeBreakdown
 * @param breakdown
 * @returns
 */
export const breakdownToOutput = (breakdown: DateTimeBreakdown): DateTimeOutput => {
  const { timezoneOffset } = breakdown;

  const output: DateTimeBreakdown & Partial<Record<FormatAlias, string>> = {
    ...breakdown,
    Z: timezoneOffsetToUTCRepresentation(timezoneOffset, ':'),
    ZZ: timezoneOffsetToUTCRepresentation(timezoneOffset, ''),
  };

  const yearAbs = String(Math.abs(breakdown.year)).padStart(4, '0');
  const yearSign = breakdown.year < 0 ? '-' : '';

  output.YYYY = `${yearSign}${yearAbs}`;
  output.YY = output.YYYY.substring(output.YYYY.length - 2);

  [output.M, output.MM] = stringifyInteger(breakdown.month);
  [output.D, output.DD] = stringifyInteger(breakdown.date);
  [output.d] = stringifyInteger(breakdown.day);
  [output.H, output.HH] = stringifyInteger(breakdown.hours);

  const hour12 = breakdown.hours % 12 || 12;
  const isPM = breakdown.hours >= 12;

  [output.h, output.hh] = stringifyInteger(hour12);
  output.A = isPM ? 'PM' : 'AM';
  output.a = isPM ? 'pm' : 'am';

  [output.m, output.mm] = stringifyInteger(breakdown.minutes);
  [output.s, output.ss] = stringifyInteger(breakdown.seconds);
  [, , output.SSS] = stringifyInteger(breakdown.milliseconds);

  return output as DateTimeBreakdown & Record<FormatAlias, string>;
};
