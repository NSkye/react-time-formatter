import { CalendarToken } from './tokens';

// Base entities

interface DateTimeBreakdownBase extends Omit<Partial<Record<CalendarToken, number>>, 'day'> {
  year?: number;
  month?: number;
  date?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;

  timezoneOffset?: number | 'UTC' | 'Local';
}

interface DateTimeBreakdownYear extends DateTimeBreakdownBase {
  year: number;
}
interface DateTimeBreakdownMonth extends DateTimeBreakdownYear {
  month: number;
}
interface DateTimeBreakdownDate extends DateTimeBreakdownMonth {
  date: number;
}
interface DateTimeBreakdownHours extends DateTimeBreakdownDate {
  hours: number;
}
interface DateTimeBreakdownMinutes extends DateTimeBreakdownHours {
  minutes: number;
}
interface DateTimeBreakdownSeconds extends DateTimeBreakdownMinutes {
  seconds: number;
}
interface DateTimeBreakdownMilliseconds extends DateTimeBreakdownSeconds {
  milliseconds: number;
}

// Output superset

export interface DateTimeBreakdownOutput extends DateTimeBreakdownMilliseconds {
  day: number;
  timezoneOffset: number;
}

// Input subset

export type DateTimeBreakdownInput =
  | DateTimeBreakdownYear
  | DateTimeBreakdownMonth
  | DateTimeBreakdownDate
  | DateTimeBreakdownHours
  | DateTimeBreakdownMinutes
  | DateTimeBreakdownSeconds
  | DateTimeBreakdownMilliseconds;
