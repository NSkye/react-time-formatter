import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  relativeTimeUnitToMs,
} from '@entities/relative-time';

export const breakdownDuration = (
  ms: number,
  config: RelativeTimeConfig
): RelativeTimeBreakdown => {
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

  return result;
};
