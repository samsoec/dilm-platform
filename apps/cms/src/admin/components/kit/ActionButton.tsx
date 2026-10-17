"use client";

import { Button } from "@payloadcms/ui";
import { type ComponentProps, type ReactNode, useId } from "react";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";
import { Spinner } from "./Spinner";

export type ActionVariant = "primary" | "secondary" | "destructive" | "text";

const NATIVE_STYLE = {
  primary: "primary",
  secondary: "secondary",
  destructive: "error",
  text: "transparent",
} as const;

type NativeProps = ComponentProps<typeof Button>;

export type ActionButtonProps = {
  variant?: ActionVariant;
  busy?: boolean;
  unavailableReason?: ReactNode;
  unavailableReasonId?: string;
  icon?: IconName;
  children: ReactNode;
} & Pick<
  NativeProps,
  | "className"
  | "el"
  | "id"
  | "newTab"
  | "onClick"
  | "ref"
  | "to"
  | "type"
  | "url"
>;

export function ActionButton({
  variant = "primary",
  busy = false,
  unavailableReason,
  unavailableReasonId,
  icon,
  children,
  className,
  ...native
}: ActionButtonProps) {
  const ownReasonId = useId();
  const reasonId = unavailableReasonId ?? ownReasonId;
  const unavailable =
    !busy && Boolean(unavailableReason ?? unavailableReasonId);

  const button = (
    <Button
      {...native}
      buttonStyle={NATIVE_STYLE[variant]}
      className={[
        "dil-btn",
        `dil-btn--${variant}`,
        busy && "dil-btn--busy",
        unavailable && "dil-btn--unavailable",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={busy || unavailable}
      extraButtonProps={{
        "aria-busy": busy || undefined,
        "aria-describedby": unavailable ? reasonId : undefined,
      }}
      margin={false}
    >
      {busy ? <Spinner /> : icon && <MaterialIcon name={icon} />}
      {children}
    </Button>
  );

  if (!unavailable || unavailableReasonId) return button;
  return (
    <span className="dil-btn-with-reason">
      {button}
      <span className="dil-btn-reason" id={reasonId}>
        {unavailableReason}
      </span>
    </span>
  );
}
