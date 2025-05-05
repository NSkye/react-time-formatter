import {
  RELATIVE_TIME_UNITS,
  RelativeTimeBreakdown,
  RelativeTimeConfig,
  normalizeRelativeTimeConfig,
} from '@entities/relative-time';

import { breakdownDuration } from './breakdown';

export const satisfiesDurationConfig = (
  referenceConfig: RelativeTimeConfig,
  details: {
    lastConfig: RelativeTimeConfig;
    lastBreakdown: RelativeTimeBreakdown;
    ms: number;
  }
) => {
  // normalize both configs
  const newConfig = normalizeRelativeTimeConfig(referenceConfig);
  const oldConfig = normalizeRelativeTimeConfig(details.lastConfig);
  const oldBreakdown = details.lastBreakdown;
  const ms = details.ms;

  const newBreakdown = breakdownDuration(ms, newConfig);

  // Will satisfy when both:
  // ALL removed units were 0 in lastBreakdown
  // ALL added units are 0 in newly generated breakdown
  for (const unit of RELATIVE_TIME_UNITS) {
    const wasUsed = oldConfig[unit];
    const nowUsed = newConfig[unit];
    const added = !wasUsed && nowUsed;
    const removed = wasUsed && !nowUsed;

    if (removed && Math.floor(oldBreakdown[unit]) !== 0) return false;
    if (added && Math.floor(newBreakdown[unit]) !== 0) return false;
  }

  return true;
};
