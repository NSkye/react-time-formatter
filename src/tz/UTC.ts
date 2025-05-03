import { timezoneOffsetResolverUTC } from "@entities/timezone";

export default function UTC() {
  return timezoneOffsetResolverUTC(undefined as unknown as Date);
}
