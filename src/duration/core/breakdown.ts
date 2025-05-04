import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  relativeTimeUnitToMs,
} from '@entities/relative-time';

import { DurationBreakdownOutput, FORMATTING_ALIASES, TOTALS, extendBreakdown } from './units';

export const breakdownDuration = (
  ms: number,
  config: RelativeTimeConfig
): DurationBreakdownOutput => {
  const result: RelativeTimeBreakdown = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  let remainder = ms;
  for (const unit of RELATIVE_TIME_UNITS) {
    if (config[unit]) {
      result[unit] = Math.floor(remainder / relativeTimeUnitToMs(unit));
      remainder = remainder % relativeTimeUnitToMs(unit);
    }
  }

  return extendBreakdown(ms, result);
};

export const generateInvalidatedBreakdown = () => {
  const numericals = [...RELATIVE_TIME_UNITS, ...TOTALS].map(key => [key, NaN]);
  const strings = FORMATTING_ALIASES.map(key => [key, `${key}-Invalid`]);

  return Object.fromEntries([...numericals, ...strings]) as DurationBreakdownOutput;
};
