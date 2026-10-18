"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";

export function Popover({
  label,
  icon,
  trailingIcon = "expand_more",
  align = "start",
  active = false,
  floating = false,
  className,
  children,
}: {
  floating?: boolean;
  label: ReactNode;
  icon?: IconName;
  trailingIcon?: IconName | null;
  align?: "start" | "end";
  active?: boolean;
  className?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("input, button, a")?.focus();
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div
      className={["dil-popover", className].filter(Boolean).join(" ")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
      ref={rootRef}
    >
      <button
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        className={`dil-popover__button${active ? " dil-popover__button--active" : ""}`}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          if (floating && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
              position: "fixed",
              top: rect.bottom + 6,
              ...(align === "end"
                ? { right: window.innerWidth - rect.right }
                : { left: rect.left }),
            });
          }
          setOpen(true);
        }}
        ref={buttonRef}
        type="button"
      >
        {icon && <MaterialIcon name={icon} />}
        {label}
        {trailingIcon && <MaterialIcon name={trailingIcon} />}
      </button>
      {open &&
        (floating ? (
          createPortal(
            <div
              className="dil-popover__panel dil-popover__panel--floating"
              id={panelId}
              onKeyDown={(event) => {
                if (event.key === "Escape") close();
              }}
              ref={panelRef}
              style={position}
            >
              {children(close)}
            </div>,
            document.body,
          )
        ) : (
          <div
            className={`dil-popover__panel dil-popover__panel--${align}`}
            id={panelId}
            ref={panelRef}
          >
            {children(close)}
          </div>
        ))}
    </div>
  );
}
