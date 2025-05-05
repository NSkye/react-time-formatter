import { timezoneOffsetResolverUTC } from '@entities/timezone';

export default function UTC() {
  return timezoneOffsetResolverUTC();
}
