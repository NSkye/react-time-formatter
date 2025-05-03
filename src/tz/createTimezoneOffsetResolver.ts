import { MINUTE } from "@shared/time-primitives";

type IANATimezone = `${string}/${string}` | "UTC";

type TimezoneOffsetResolverFactory = (
  timezone: IANATimezone,
) => (date: Date) => number;

export const createTimezoneOffsetResolver: TimezoneOffsetResolverFactory = (
  timezone,
) => {
  const timezoneOffsetResolver = (date: Date): number => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(date);

      const get = (type: string) =>
        parseInt(parts.find((p) => p.type === type)?.value || "0", 10);

      // Construct a UTC date that mimics the same wall time in the target time zone
      const localTimeAsUTC = Date.UTC(
        get("year"),
        get("month") - 1,
        get("day"),
        get("hour"),
        get("minute"),
        get("second"),
      );

      const offsetMs = localTimeAsUTC - date.getTime();

      return Math.round(offsetMs / MINUTE);
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[react-time-formatter] Invalid or unsupported timezone passed:",
          timezone,
          "\nDefaults to UTC.",
        );
      }

      return 0;
    }
  };

  Object.defineProperty(timezoneOffsetResolver, "name", {
    value: timezone.split("/")[1] ?? "UnknownTimezone",
  });

  return timezoneOffsetResolver;
};
