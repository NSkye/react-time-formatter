import { timezoneOffsetResolverUTC } from "@entities/timezone";

export default function GMT() {
  return timezoneOffsetResolverUTC(undefined as unknown as Date);
}
