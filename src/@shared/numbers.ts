export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
};

export const isValidInteger = (value: unknown): value is number => {
  return isValidNumber(value) && Number.isSafeInteger(value);
};

const MAX_TIMESTAMP = Date.UTC(9999, 11, 31, 23, 59, 59, 999);
const MIN_TIMESTAMP = Date.UTC(1000, 0, 1, 0, 0, 0, 0);

export const isValidTimestamp = (value: unknown): value is number => {
  if (!isValidNumber(value)) return false;
  const integer = Math.trunc(value);

  if (!isValidInteger(integer)) return false;
  return integer <= MAX_TIMESTAMP && integer >= MIN_TIMESTAMP;
};

export const isNegative = (value: number): boolean => {
  // handle negative zeores
  if (value === 0) return false;
  return value < 0;
};
