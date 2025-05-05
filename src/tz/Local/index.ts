import { timezoneOffsetResolverLocal } from '@entities/timezone';

export default function Local(date: Date) {
  return timezoneOffsetResolverLocal(date);
}
