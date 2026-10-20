"use client";

import { toast } from "@payloadcms/ui";
import { type ReactNode, useEffect, useRef, useState } from "react";

import type { IconName } from "../../icons";
import { ADMIN_TOAST } from "../../shell";
import { MaterialIcon } from "../MaterialIcon";

export const TOAST_DURATION_MS = ADMIN_TOAST.duration;

export type ToastTone = "success" | "error" | "undo" | "info";

const ICONS: Record<ToastTone, IconName> = {
  success: "check_circle",
  error: "error",
  undo: "undo",
  info: "info",
};

export type ToastAction = { label: string; onClick: () => void };

export type ToastContent = {
  tone: ToastTone;
  title: ReactNode;
  body?: ReactNode;
  action?: ToastAction;
  icon?: IconName;
};

export function KitToast({
  tone,
  title,
  body,
  icon,
  action,
  onDismiss,
  duration = TOAST_DURATION_MS,
}: ToastContent & { onDismiss: () => void; duration?: number }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(duration);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  const paused = hovered || focused;

  useEffect(() => {
    if (paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => dismiss.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused]);

  return (
    <div
      className={`dil-toast dil-toast--${tone}`}
      data-paused={paused || undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={tone === "error" ? "alert" : "status"}
    >
      <MaterialIcon className="dil-toast__icon" name={icon ?? ICONS[tone]} />
      <p className="dil-toast__text">
        <b>{title}</b> {body}
      </p>
      {action && (
        <button
          className="dil-toast__action"
          onClick={() => {
            action.onClick();
            dismiss.current();
          }}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function notify(content: ToastContent) {
  return toast.custom(
    (id) => <KitToast {...content} onDismiss={() => toast.dismiss(id)} />,
    { duration: Infinity },
  );
}
