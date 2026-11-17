import type { IconName } from "../../icons";
import { submittedText } from "../application/application";
import { formatJakarta } from "../cells/cv";

export type DeliveryMark = {
  who: "Team" | "Sender";
  sent: boolean;
  icon: IconName;
  text: string;
};

function mark(who: DeliveryMark["who"], icon: IconName, at: unknown) {
  const when = formatJakarta(at);
  return when
    ? { who, sent: true, icon, text: `${who} notified ${when}` }
    : {
        who,
        sent: false,
        icon: "remove" as const,
        text: `${who} not notified yet`,
      };
}

export function deliveryMarks(row: {
  teamNotifiedAt?: unknown;
  senderNotifiedAt?: unknown;
}): DeliveryMark[] {
  return [
    mark("Team", "person_check", row.teamNotifiedAt),
    mark("Sender", "mark_email_read", row.senderNotifiedAt),
  ];
}

export function deliveryDetail(at: unknown, sentText: string, waiting: string) {
  const when = submittedText(at);
  return when ? `${sentText} on ${when}.` : waiting;
}

export function eraseCopy(name: string, company: string) {
  return {
    title: `Permanently delete ${name}'s message?`,
    body: `The message from ${name} at ${company} is erased for good. There's no trash and it can't be undone. The consent record stays.`,
    done: `${name}'s message was permanently deleted.`,
    failed: `Couldn't delete ${name}'s message. Try again.`,
  };
}

export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  id: "Indonesian",
};
