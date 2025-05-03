import {
  normalizeRelativeTimeConfig,
  RELATIVE_TIME_UNITS,
  RelativeTimeConfig,
} from "@entities/relative-time";

export const satisfiesIntervalConfig = (
  referenceConfig: RelativeTimeConfig,
  lastConfig: RelativeTimeConfig,
) => {
  const newConfig = normalizeRelativeTimeConfig(referenceConfig);
  const oldConfig = normalizeRelativeTimeConfig(lastConfig);

  for (const unit of RELATIVE_TIME_UNITS) {
    const wasUsed = oldConfig[unit];
    const nowUsed = newConfig[unit];
    if (wasUsed !== nowUsed) return false;
  }

  return true;
};
