"use client";

import { Modal, useModal } from "@payloadcms/ui";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import type { IconName } from "../../icons";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "./ActionButton";

export type ConfirmTone = "go-live" | "discard" | "delete";

const TONE_ICONS: Record<ConfirmTone, IconName> = {
  "go-live": "help",
  discard: "warning",
  delete: "delete",
};

type Action = () => Promise<void> | void;

export type ConfirmDialogProps = {
  slug: string;
  tone: ConfirmTone;
  icon?: IconName;
  title: ReactNode;
  body: ReactNode;
  confirmLabel: string;
  busyLabel?: string;
  cancelLabel?: string;
  onConfirm: Action;
  onCancel?: () => void;
  secondary?: { label: string; onClick: Action };
  typeToConfirm?: string;
};

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { isModalOpen } = useModal();
  if (!isModalOpen(props.slug)) return null;
  return <OpenConfirmDialog {...props} />;
}

function OpenConfirmDialog({
  slug,
  tone,
  icon,
  title,
  body,
  confirmLabel,
  busyLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  secondary,
  typeToConfirm,
}: ConfirmDialogProps) {
  const { closeModal } = useModal();
  const [busy, setBusy] = useState<"confirm" | "secondary">();
  const [typed, setTyped] = useState("");
  const cancelRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const typedId = useId();
  const typedLabelId = useId();
  const [focusTrapOptions] = useState(() => ({
    initialFocus: () => cancelRef.current ?? false,
    returnFocusOnDeactivate: false,
  }));

  useEffect(() => {
    const trigger = document.activeElement;
    cancelRef.current?.focus();
    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, []);

  const run = (which: "confirm" | "secondary", action: Action) => async () => {
    if (busy) return;
    setBusy(which);
    try {
      await action();
      closeModal(slug);
    } finally {
      setBusy(undefined);
    }
  };

  const cancel = () => {
    if (busy) return;
    closeModal(slug);
    onCancel?.();
  };

  const confirmBlocked =
    typeToConfirm !== undefined && typed.trim() !== typeToConfirm;

  return (
    <Modal
      className="dil-confirm"
      closeOnBlur={false}
      focusTrapOptions={focusTrapOptions}
      slug={slug}
    >
      <div
        aria-describedby={bodyId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`dil-confirm__dialog dil-confirm--${tone}`}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.stopPropagation();
          cancel();
        }}
        role="alertdialog"
      >
        <div className="dil-confirm__content">
          <span className="dil-confirm__tile">
            <MaterialIcon name={icon ?? TONE_ICONS[tone]} />
          </span>
          <div className="dil-confirm__text">
            <h2 className="dil-confirm__title" id={titleId}>
              {title}
            </h2>
            <div className="dil-confirm__body" id={bodyId}>
              {body}
            </div>
            {typeToConfirm !== undefined && (
              <div className="dil-confirm__typed">
                <label htmlFor={typedId} id={typedLabelId}>
                  Type {typeToConfirm} to confirm
                </label>
                <input
                  autoCapitalize="characters"
                  autoComplete="off"
                  disabled={Boolean(busy)}
                  id={typedId}
                  onChange={(event) => setTyped(event.target.value)}
                  spellCheck={false}
                  value={typed}
                />
              </div>
            )}
          </div>
        </div>
        <div className="dil-confirm__controls">
          <ActionButton
            onClick={cancel}
            ref={cancelRef}
            type="button"
            variant="secondary"
          >
            {cancelLabel}
          </ActionButton>
          {secondary && (
            <ActionButton
              busy={busy === "secondary"}
              className="dil-confirm__secondary"
              onClick={run("secondary", secondary.onClick)}
              type="button"
              variant="secondary"
            >
              {secondary.label}
            </ActionButton>
          )}
          <ActionButton
            busy={busy === "confirm"}
            onClick={run("confirm", onConfirm)}
            type="button"
            unavailableReasonId={confirmBlocked ? typedLabelId : undefined}
            variant={tone === "delete" ? "destructive" : "primary"}
          >
            {busy === "confirm" && busyLabel ? busyLabel : confirmLabel}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
