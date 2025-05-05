import { isNegative, isValidInteger, isValidNumber } from './numbers';

function* generateInvalidatedNumberString(limit = 4) {
  for (let i = 1; i <= limit; i++) {
    yield '#'.repeat(i);
  }
}

export function* stringifyInteger(
  value: number,
  explicitPositive = false,
  limit = 4
): Generator<string> {
  const safeLimit = isValidInteger(Math.trunc(limit)) ? limit : 4;

  if (!isValidNumber(value)) {
    yield* generateInvalidatedNumberString(safeLimit);
    return;
  }

  const integer = Math.trunc(value);

  if (!isValidInteger(integer)) {
    yield* generateInvalidatedNumberString(safeLimit);
    return;
  }

  const sign = isNegative(integer) ? '-' : explicitPositive ? '+' : '';
  const stringifiedAbsoluteNumber = String(Math.abs(integer));

  for (let i = 1; i <= safeLimit; i++) {
    yield `${sign}${stringifiedAbsoluteNumber.padStart(i, '0')}`;
  }
}
