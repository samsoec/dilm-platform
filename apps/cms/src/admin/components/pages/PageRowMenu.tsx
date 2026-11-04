"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import type { KeyboardEvent } from "react";

import { ALL_SITES_COUNT } from "../kit/reach";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { Popover } from "../kit/Popover";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import { addChildPath, type PageRow, type RowActions } from "./pagesModel";

async function failure(response: Response | undefined): Promise<string> {
  if (!response) return "The CMS can't be reached.";
  try {
    const body = (await response.json()) as {
      errors?: { message?: string }[];
    };
    return body.errors?.[0]?.message || "Try again.";
  } catch {
    return "Try again.";
  }
}

function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    ),
  ];
  if (items.length === 0) return;
  event.preventDefault();
  const at = items.indexOf(document.activeElement as HTMLElement);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (at + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
          items.length;
  items[next]?.focus();
}

export function PageRowMenu({
  row,
  actions,
  childCount,
  tabIndex,
}: {
  row: PageRow;
  actions: RowActions;
  childCount: number;
  tabIndex: 0 | -1;
}) {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const trashSlug = `trash-page-${row.key}`;
  const unpublishSlug = `unpublish-page-${row.key}`;
  const url = formatAdminURL({
    apiRoute: routes.api,
    serverURL,
    path: `/${row.collection}/${row.id}`,
  });

  const patch = (body: object, trashed = false) =>
    fetch(trashed ? `${url}?trash=true` : url, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);

  const unpublish = async () => {
    const response = await patch({ _status: "draft" });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't unpublish "${row.title}".`,
        body: await failure(response),
      });
      return;
    }
    router.refresh();
    notify({
      tone: "success",
      title: `Unpublished "${row.title}".`,
      body: "It's a Draft again and leaves the website within minutes.",
    });
  };

  const trash = async () => {
    const response = await patch({ deletedAt: new Date().toISOString() });
    if (!response?.ok) {
      notify({
        tone: "error",
        title: `Couldn't move "${row.title}" to trash.`,
        body: await failure(response),
      });
      return;
    }
    router.refresh();
    notify({
      tone: "undo",
      title: `Moved "${row.title}" to trash.`,
      body: "You can restore it from Trash.",
      action: {
        label: "Undo",
        onClick: async () => {
          const undone = await patch(row.restore, true);
          if (!undone?.ok) {
            notify({
              tone: "error",
              title: `Couldn't restore "${row.title}".`,
              body: await failure(undone),
            });
            return;
          }
          router.refresh();
          notify({
            tone: "success",
            title: `Restored "${row.title}".`,
            body: "It's back as a Draft.",
          });
        },
      },
    });
  };

  const live = row.status === "published" || row.status === "changed";
  const where = row.shared ? `all ${ALL_SITES_COUNT} websites` : "the website";

  return (
    <>
      <Popover
        align="end"
        buttonTabIndex={tabIndex}
        className="dil-page-menu"
        floating
        icon="more_horiz"
        label={<span className="dil-sr-only">Actions for {row.title}</span>}
        trailingIcon={null}
      >
        {(close) => (
          <div
            aria-label={`Actions for ${row.title}`}
            className="dil-menu dil-page-menu__list"
            onKeyDown={moveFocus}
            role="menu"
          >
            {actions.addChild && (
              <Link
                className="dil-page-menu__item"
                href={formatAdminURL({
                  adminRoute: routes.admin,
                  path: addChildPath(row),
                })}
                onClick={close}
                prefetch={false}
                role="menuitem"
              >
                <MaterialIcon name="add" />
                Add child page
              </Link>
            )}
            <button
              aria-disabled="true"
              className="dil-page-menu__item"
              role="menuitem"
              title="Preview isn't available yet."
              type="button"
            >
              <MaterialIcon name="visibility" />
              Preview
              <span className="dil-page-menu__soon">Soon</span>
            </button>
            <button
              aria-disabled={!actions.unpublish}
              className="dil-page-menu__item"
              onClick={() => {
                if (!actions.unpublish) return;
                close();
                openModal(unpublishSlug);
              }}
              role="menuitem"
              title={actions.unpublish ? undefined : "It isn't published."}
              type="button"
            >
              <MaterialIcon name="unpublished" />
              Unpublish…
            </button>
            <div className="dil-page-menu__divider" role="separator" />
            <button
              className="dil-page-menu__item dil-page-menu__item--danger"
              onClick={() => {
                close();
                openModal(trashSlug);
              }}
              role="menuitem"
              type="button"
            >
              <MaterialIcon name="delete" />
              Move to trash…
            </button>
          </div>
        )}
      </Popover>
      <ConfirmDialog
        body={
          <>
            {live
              ? `It's published, so it will be removed from ${where}.`
              : "It isn't on the website."}{" "}
            {childCount > 0
              ? `Its ${childCount === 1 ? "child page stays" : `${childCount} child pages stay`} as they are but ${childCount === 1 ? "is" : "are"} listed at the top level until it's restored. `
              : ""}
            You can restore it from Trash.
          </>
        }
        confirmLabel="Move to trash"
        onConfirm={trash}
        slug={trashSlug}
        title={`Move "${row.title}" to trash?`}
        tone="delete"
      />
      <ConfirmDialog
        body={`It goes back to Draft and leaves ${where} within minutes.`}
        confirmLabel="Unpublish"
        icon="unpublished"
        onConfirm={unpublish}
        slug={unpublishSlug}
        title={`Unpublish "${row.title}"?`}
        tone="go-live"
      />
    </>
  );
}
