import type { ReactNode } from "react";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";

export type TagTone = "neutral" | "tenant" | "warn";

export function Tag({
  tone = "neutral",
  icon,
  title,
  children,
}: {
  tone?: TagTone;
  icon?: IconName;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={["dil-tag", `dil-tag--${tone}`, icon && "dil-tag--with-icon"]
        .filter(Boolean)
        .join(" ")}
      title={title}
    >
      {icon && <MaterialIcon name={icon} />}
      {children}
    </span>
  );
}

export function LocaleTag({ locale }: { locale: string }) {
  return (
    <Tag tone={locale === "en" ? "neutral" : "tenant"}>
      <span lang={locale}>{locale.toUpperCase()}</span>
    </Tag>
  );
}

export function SameAsEn() {
  return (
    <Tag
      icon="translate"
      title="This Indonesian label still shows the English text."
      tone="warn"
    >
      Same as EN
    </Tag>
  );
}

export function SuperAdminTag() {
  return <Tag>SUPER ADMIN</Tag>;
}

export function CountTag({ count, max }: { count: number; max: number }) {
  return (
    <span className="dil-count-tag">
      {count} of {max}
    </span>
  );
}
