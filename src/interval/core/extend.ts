import { SafeDate } from '@entities/calendar-date';
import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  RelativeTimeUnit,
} from '@entities/relative-time';
import { TimezoneOffsetResolver } from '@entities/timezone';

import { stringifyInteger } from '@shared/stringify-integer';
import { DAY, HOUR, MILLISECOND, MINUTE, SECOND, WEEK } from '@shared/time-primitives';

import { breakdownInterval } from './breakdown';

export const TOTALS_ALIASES = [
  'totalYears',
  'totalMonths',
  'totalWeeks',
  'totalDays',
  'totalHours',
  'totalMinutes',
  'totalSeconds',
  'totalMilliseconds',
] as const;

export const FORMAT_ALIASES = [
  'Y',
  'YY',
  'M',
  'MM',
  'W',
  'WW',
  'D',
  'DD',
  'H',
  'HH',
  'm',
  'mm',
  's',
  'ss',
  'SSS',
] as const;

export type TotalsAlias = (typeof TOTALS_ALIASES)[number];
export type FormatAlias = (typeof FORMAT_ALIASES)[number];

export const ALIAS_TO_UNIT = {
  Y: 'years',
  YY: 'years',
  M: 'months',
  MM: 'months',
  W: 'weeks',
  WW: 'weeks',
  D: 'days',
  DD: 'days',
  H: 'hours',
  HH: 'hours',
  m: 'minutes',
  mm: 'minutes',
  s: 'seconds',
  ss: 'seconds',
  SSS: 'milliseconds',
} satisfies Record<FormatAlias, RelativeTimeUnit>;

export type IntervalOutput = RelativeTimeBreakdown &
  Record<TotalsAlias, number> &
  Record<FormatAlias, string>;
export type IntervalAccessed = Record<keyof IntervalOutput, boolean>;

export const breakdownToOutput = (
  fromTo: [SafeDate, SafeDate],
  breakdown: RelativeTimeBreakdown,
  timezoneOffsetResolver: TimezoneOffsetResolver
): IntervalOutput => {
  const [from, to] = fromTo;
  const output: Partial<IntervalOutput> = { ...breakdown };

  [output.Y, output.YY] = stringifyInteger(breakdown.years);
  [output.M, output.MM] = stringifyInteger(breakdown.months);
  [output.W, output.WW] = stringifyInteger(breakdown.weeks);
  [output.D, output.DD] = stringifyInteger(breakdown.days);
  [output.H, output.HH] = stringifyInteger(breakdown.hours);
  [output.m, output.mm] = stringifyInteger(breakdown.minutes);
  [output.s, output.ss] = stringifyInteger(breakdown.seconds);
  [, , output.SSS] = stringifyInteger(breakdown.milliseconds);

  // TODO: Fix messy call signature
  output.totalYears =
    breakdownInterval(
      fromTo,
      {
        years: true,
        months: false,
        weeks: false,
        days: false,
        hours: false,
        minutes: false,
        seconds: false,
        milliseconds: false,
      },
      timezoneOffsetResolver
    ).years * (to.valueOf() < from.valueOf() ? -1 : 1);

  // TODO: Fix messy call signatuee
  output.totalMonths =
    breakdownInterval(
      fromTo,
      {
        years: false,
        months: true,
        weeks: false,
        days: false,
        hours: false,
        minutes: false,
        seconds: false,
        milliseconds: false,
      },
      timezoneOffsetResolver
    ).months * (to.valueOf() < from.valueOf() ? -1 : 1);

  output.totalWeeks = Math.trunc((to.valueOf() - from.valueOf()) / WEEK);
  output.totalDays = Math.trunc((to.valueOf() - from.valueOf()) / DAY);
  output.totalHours = Math.trunc((to.valueOf() - from.valueOf()) / HOUR);
  output.totalMinutes = Math.trunc((to.valueOf() - from.valueOf()) / MINUTE);
  output.totalSeconds = Math.trunc((to.valueOf() - from.valueOf()) / SECOND);
  output.totalMilliseconds = Math.trunc((to.valueOf() - from.valueOf()) / MILLISECOND);

  return output as IntervalOutput;
};

export const accessedToConfig = (accessed: IntervalAccessed): RelativeTimeConfig => {
  const config: Partial<RelativeTimeConfig> = {};

  // units that were accessed directly
  for (const unit of RELATIVE_TIME_UNITS) config[unit] = accessed[unit];

  // units that were accessed with aliases
  for (const alias of FORMAT_ALIASES) {
    if (accessed[alias] === true) {
      config[ALIAS_TO_UNIT[alias]] = true;
    }
  }

  return config as RelativeTimeConfig;
};
