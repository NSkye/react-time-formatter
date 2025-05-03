export const CALENDAR_TOKENS = [
  "year",
  "month",
  "day",
  "date",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
] as const;

export type CalendarToken = (typeof CALENDAR_TOKENS)[number];

export const isCalendarToken = (value: string): value is CalendarToken =>
  Array.prototype.includes.call(CALENDAR_TOKENS, value);
