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
