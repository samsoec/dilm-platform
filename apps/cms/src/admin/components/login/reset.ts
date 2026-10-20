import { JAKARTA_TIME_ZONE } from "../application/application";

export function senderFor(
  email: string,
  domains: string[],
): string | undefined {
  const domain = email.trim().toLowerCase().split("@")[1];
  return domain && domains.includes(domain) ? `noreply@${domain}` : undefined;
}

const UNTIL = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: JAKARTA_TIME_ZONE,
});

export function validUntil(value: string): string {
  return `${UNTIL.format(new Date(value)).replace("Sept", "Sep")} WIB`;
}
