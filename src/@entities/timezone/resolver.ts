export type TimezoneOffsetResolver = (date: Date) => number;

export const timezoneOffsetResolverUTC = (() =>
  0) satisfies TimezoneOffsetResolver as TimezoneOffsetResolver;

export const timezoneOffsetResolverLocal: TimezoneOffsetResolver = (date) =>
  date.getTimezoneOffset();

export const createDefaultTimezoneOffsetResolver = (
  timezoneOffset: "UTC" | "Local" | TimezoneOffsetResolver | number,
): TimezoneOffsetResolver => {
  if (timezoneOffset === "Local")
    return (date) => timezoneOffsetResolverLocal(date);

  if (timezoneOffset === "UTC")
    return () => timezoneOffsetResolverUTC(undefined as unknown as Date);

  if (typeof timezoneOffset === "function") return timezoneOffset;

  return () => timezoneOffset;
};
