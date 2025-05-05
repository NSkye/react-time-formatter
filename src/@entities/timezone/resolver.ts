const MAX_SAFE_OFFSET = 840; // UTC-14
const MIN_SAFE_OFFSET = -840; // UTC+14

export type TimezoneOffsetResolver = (date: Date) => number;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const timezoneOffsetResolverUTC = ((_date?: Date) => 0) satisfies TimezoneOffsetResolver;
export const timezoneOffsetResolverLocal: TimezoneOffsetResolver = date => date.getTimezoneOffset();

export const isValidTimezoneOffset = (offset: unknown): offset is number => {
  return (
    typeof offset === 'number' &&
    // Allow fractional numbers just because how likely it is
    // for some junk to get accidentally mixed up in fractional part
    Number.isInteger(Math.trunc(offset)) &&
    offset >= MIN_SAFE_OFFSET &&
    offset <= MAX_SAFE_OFFSET
  );
};

/**
 * Returns offset if offset is correct, returns
 * NaN if offset is incorrect
 * @param offset
 */
export const validateTimezoneOffset = (offset: unknown) => {
  if (isValidTimezoneOffset(offset)) return Math.trunc(offset);
  return NaN;
};

export const createDefaultTimezoneOffsetResolver = (
  timezoneOffset: 'UTC' | 'Local' | TimezoneOffsetResolver | number
): TimezoneOffsetResolver => {
  if (timezoneOffset === 'Local') return date => timezoneOffsetResolverLocal(date);
  if (timezoneOffset === 'UTC') return () => timezoneOffsetResolverUTC();

  if (typeof timezoneOffset === 'function')
    return (date: Date) => validateTimezoneOffset(timezoneOffset(date));

  const validatedOffset = validateTimezoneOffset(timezoneOffset);
  return () => validatedOffset;
};
