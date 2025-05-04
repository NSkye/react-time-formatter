export const toTimestamp = (input: Date | string | number): number => {
  const timestamp = input instanceof Date ? input.getTime() : new Date(input).getTime();
  return isNaN(timestamp) ? NaN : timestamp;
};

export const datesAreEqual = (
  dateA: Date | string | number,
  dateB: Date | string | number
): boolean => {
  const timeA = toTimestamp(dateA);
  const timeB = toTimestamp(dateB);

  return !isNaN(timeA) && !isNaN(timeB) && timeA === timeB;
};

export const timezoneOffsetToUTCRepresentation = (offsetMinutes: number, delimiter = '') => {
  if (offsetMinutes === 0 && delimiter === ':') return 'Z'; // ISO 8601 Z shorthand

  const hours = String(Math.abs(Math.floor(offsetMinutes / 60))).padStart(2, '0');
  const minutes = String(Math.abs(offsetMinutes % 60)).padStart(2, '0');

  // negative offset means positive UTC
  // offset -120 -> UTC+02:00
  const sign = offsetMinutes <= 0 ? '+' : '-';

  return `${sign}${hours}${delimiter}${minutes}`;
};
