import type { ReactNode } from "react";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";

export type BannerTone = "info" | "success" | "warning" | "error" | "readonly";

const ICONS: Record<BannerTone, IconName> = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  error: "error",
  readonly: "lock",
};

export function Banner({
  tone,
  icon,
  title,
  children,
  action,
  className,
}: {
  tone: BannerTone;
  icon?: IconName;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["dil-banner", `dil-banner--${tone}`, className]
        .filter(Boolean)
        .join(" ")}
      role={tone === "error" ? "alert" : "note"}
    >
      <MaterialIcon className="dil-banner__icon" name={icon ?? ICONS[tone]} />
      <div className="dil-banner__body">
        <p className="dil-banner__text">
          {title && <b>{title}</b>} {children}
        </p>
        {action && <div className="dil-banner__action">{action}</div>}
      </div>
    </div>
  );
}
