import { timezoneOffsetResolverUTC } from '@entities/timezone';

export default function GMT() {
  return timezoneOffsetResolverUTC();
}
