"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useConfig,
  useDocumentInfo,
  useField,
  useFormFields,
  useModal,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import type { SelectFieldClientComponent } from "payload";
import { formatAdminURL } from "payload/shared";
import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IR_LANGUAGE_LABELS } from "../../../irDocumentTypes";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { VERSIONS_DRAWER_SLUG } from "../document/VersionsDrawer";
import { ActionButton } from "../kit/ActionButton";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { SegmentedControl } from "../kit/SegmentedControl";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import {
  CHECKLIST_PATHS,
  companyInitials,
  DRAFT_NOTE,
  publishChecklist,
} from "./irEditor";

export function ListOnly({ children }: { children: ReactNode }) {
  const { collectionSlug } = useDocumentInfo();
  return collectionSlug ? null : <>{children}</>;
}

export function IrEditNote({ domain }: { domain?: string }) {
  const { collectionSlug, hasPublishedDoc } = useDocumentInfo();
  if (collectionSlug !== "ir-documents" || hasPublishedDoc) return null;
  return <p className="dil-ir-note">{DRAFT_NOTE(domain ?? "the website")}</p>;
}

export function IrStatusTag() {
  const { hasPublishedDoc } = useDocumentInfo();
  const [slot, setSlot] = useState<Element | null>(null);
  useEffect(() => {
    setSlot(document.querySelector(".doc-header__header"));
  }, []);
  if (!slot) return null;
  return createPortal(
    hasPublishedDoc ? (
      <span className="dil-status-chip dil-status-chip--ok dil-ir-status">
        <MaterialIcon name="public" />
        Published
      </span>
    ) : (
      <span className="dil-status-chip dil-status-chip--neutral dil-ir-status">
        <MaterialIcon name="edit_note" />
        Draft · not public
      </span>
    ),
    slot,
  );
}

export const LanguageField: SelectFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const { value, setValue, showError, disabled } = useField<string>({ path });
  const options = field.options.map((option) => {
    const code = typeof option === "string" ? option : option.value;
    return {
      value: code,
      label: IR_LANGUAGE_LABELS[code] ?? code.toUpperCase(),
    };
  });
  return (
    <div
      className={`field-type dil-ir-language${showError ? " error" : ""}`}
      id={`field-${path}`}
    >
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <SegmentedControl
        disabled={readOnly || disabled}
        label="Language"
        onChange={(next) => setValue(next)}
        options={options}
        value={value ?? ""}
      />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};

export function IrVersionsButton() {
  const { id } = useDocumentInfo();
  const { openModal } = useModal();
  if (id === undefined) return null;
  return (
    <ActionButton
      icon="history"
      onClick={() => openModal(VERSIONS_DRAWER_SLUG)}
      type="button"
      variant="secondary"
    >
      Versions
    </ActionButton>
  );
}

export function DetailsHeading() {
  return (
    <header className="dil-ir-panel__head dil-ir-details__head">
      <h2 className="dil-ir-panel__title">Details</h2>
      <span className="dil-ir-panel__aside">* Required to publish</span>
    </header>
  );
}

export function PublishChecklist() {
  const values = useFormFields(([fields]) =>
    CHECKLIST_PATHS.map((path) => fields[path]?.value),
  );
  const items = publishChecklist(
    Object.fromEntries(
      CHECKLIST_PATHS.map((path, index) => [path, values[index]]),
    ),
  );
  return (
    <section aria-labelledby="dil-ir-ready" className="dil-ir-ready">
      <h2 className="dil-ir-ready__title" id="dil-ir-ready">
        Ready to publish?
      </h2>
      <ul>
        {items.map(({ key, label, done }) => (
          <li
            className={done ? "dil-ir-ready__done" : "dil-ir-ready__missing"}
            key={key}
          >
            <MaterialIcon name={done ? "check_circle" : "cancel"} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DisclosureTiming() {
  return (
    <aside className="dil-ir-timing">
      <h2>
        <MaterialIcon name="schedule" />
        Disclosure timing
      </h2>
      <p>
        Published documents appear on the Investor page within minutes, inside
        the POJK 31/2015 two-business-day window.
      </p>
    </aside>
  );
}

const TRASH_SLUG = "dil-ir-trash";

export function IrTrashButton() {
  const { id, collectionSlug, hasPublishedDoc, hasSavePermission } =
    useDocumentInfo();
  const { openModal } = useModal();
  const { company } = useUnsavedChangesGuard();
  const router = useRouter();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const title = useFormFields(([fields]) => fields.title?.value);
  if (id === undefined || hasSavePermission === false) return null;
  const name = typeof title === "string" && title ? title : "this document";
  const api = (trash: boolean) =>
    formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: `/${collectionSlug}/${id}${trash ? "?trash=true" : ""}`,
    });
  const patch = (body: object, trash = false) =>
    fetch(api(trash), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);

  const trash = async () => {
    const response = await patch({ deletedAt: new Date().toISOString() });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't move "${name}" to trash.`,
        body: "Try again.",
      });
      return;
    }
    router.push(
      formatAdminURL({
        adminRoute: routes.admin,
        path: `/collections/${collectionSlug}`,
      }),
    );
    notify({
      tone: "undo",
      title: `Moved "${name}" to trash.`,
      body: "You can restore it from Trash.",
      action: {
        label: "Undo",
        onClick: () => {
          void patch({ deletedAt: null, _status: "draft" }, true).then(() =>
            router.refresh(),
          );
        },
      },
    });
  };

  return (
    <>
      <ActionButton
        className="dil-ir-trash"
        icon="delete"
        onClick={() => openModal(TRASH_SLUG)}
        type="button"
        variant="secondary"
      >
        Move to trash
      </ActionButton>
      <ConfirmDialog
        body={
          hasPublishedDoc ? (
            <>
              It&apos;s published, so it will be{" "}
              <b>
                removed from the {companyInitials(company?.name)} Investor page
              </b>
              . You can restore it from Trash.
            </>
          ) : (
            "It isn't on the website. You can restore it from Trash."
          )
        }
        confirmLabel="Move to trash"
        onConfirm={trash}
        slug={TRASH_SLUG}
        title={`Move "${name}" to trash?`}
        tone="delete"
      />
    </>
  );
}
