import { stringifyInteger } from './stringify-integer';

export const timezoneOffsetToUTCRepresentation = (offsetMinutes: number, delimiter = '') => {
  if (offsetMinutes === 0 && delimiter === ':') return 'Z'; // ISO 8601 Z shorthand

  // negative offset means positive UTC
  // offset -120 -> UTC+02:00
  const [, hours] = stringifyInteger(-offsetMinutes / 60, true);
  const [, minutes] = stringifyInteger(Math.abs(offsetMinutes % 60));

  return `${hours}${delimiter}${minutes}`;
};
