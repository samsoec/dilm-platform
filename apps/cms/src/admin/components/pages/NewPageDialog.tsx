"use client";

import { Modal, useConfig, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { slugify } from "../../../slugRules";
import { computeUrls } from "../editor/urls";
import { ActionButton } from "../kit/ActionButton";
import { ReachBadge } from "../kit/ReachBadge";
import { getReach } from "../kit/reach";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import {
  CHECK_FAILED,
  CHECK_FOOTNOTE,
  checkSlugPath,
  createDraftPath,
  DRAFT_NOTE,
  idSlugNote,
  NEW_PAGE_MODAL,
  parentOptionsPath,
  pickableParent,
  shapeProblems,
  slugsPayload,
  SLUG_HINT,
  splitDisplay,
  type DialogProblem,
  type ParentOption,
  type SlugField,
} from "./newPage";
import { ParentPicker } from "./ParentPicker";

export const CHECK_DELAY_MS = 350;

export type NewPageTenant = {
  id: number | string;
  name: string;
  domain?: string;
};

export type NewPageDialogProps = {
  tenant: NewPageTenant;
  parentId?: string;
};

type Options =
  | { status: "loading" }
  | { status: "ready"; list: ParentOption[] }
  | { status: "failed" };

type Check =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "done"; problems: DialogProblem[] }
  | { status: "failed" };

async function messageOf(response: Response | undefined): Promise<string> {
  if (!response) return "The CMS can't be reached.";
  try {
    const body = (await response.json()) as {
      message?: string;
      errors?: { message?: string }[];
    };
    return body.message || body.errors?.[0]?.message || "Try again.";
  } catch {
    return "Try again.";
  }
}

export function NewPageDialog(props: NewPageDialogProps) {
  const { isModalOpen } = useModal();
  if (!isModalOpen(NEW_PAGE_MODAL)) return null;
  return <OpenNewPageDialog {...props} />;
}

function OpenNewPageDialog({ tenant, parentId }: NewPageDialogProps) {
  const { closeModal } = useModal();
  const router = useRouter();
  const {
    config: { routes, serverURL, localization },
  } = useConfig();
  const api = `${serverURL ?? ""}${routes.api}`;
  const locales = useMemo(
    () => (localization ? localization.localeCodes : ["en", "id"]),
    [localization],
  );
  const defaultLocale = localization ? localization.defaultLocale : "en";

  const [title, setTitle] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugEnOwn, setSlugEnOwn] = useState(false);
  const [slugId, setSlugId] = useState("");
  const [parent, setParent] = useState<string | null>(null);
  const [options, setOptions] = useState<Options>({ status: "loading" });
  const [reload, setReload] = useState(0);
  const [check, setCheck] = useState<Check>({ status: "idle" });
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string>();

  const titleRef = useRef<HTMLInputElement>(null);
  const [focusTrapOptions] = useState(() => ({
    initialFocus: () => titleRef.current ?? false,
    returnFocusOnDeactivate: false,
  }));
  const titleId = useId();
  const fieldId = useId();
  const slugEnId = useId();
  const slugIdId = useId();
  const problemEnId = useId();
  const problemIdId = useId();
  const parentNoteId = useId();

  useEffect(() => {
    const trigger = document.activeElement;
    titleRef.current?.focus();
    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, []);

  useEffect(() => {
    const request = new AbortController();
    setOptions({ status: "loading" });
    fetch(parentOptionsPath(api, String(tenant.id)), {
      credentials: "include",
      signal: request.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(await messageOf(response));
        const body = (await response.json()) as { options: ParentOption[] };
        setOptions({ status: "ready", list: body.options });
        const wanted = pickableParent(body.options, parentId);
        if (wanted) setParent(wanted.id);
      })
      .catch(() => {
        if (!request.signal.aborted) setOptions({ status: "failed" });
      });
    return () => request.abort();
  }, [api, parentId, reload, tenant.id]);

  const list = options.status === "ready" ? options.list : [];
  const chosen = parent ? pickableParent(list, parent) : undefined;
  const parentValue = chosen?.id;

  const slugs = useMemo(() => slugsPayload(slugEn, slugId), [slugEn, slugId]);
  const shape = useMemo(
    () => shapeProblems(slugs, Boolean(parentValue)),
    [parentValue, slugs],
  );

  useEffect(() => {
    if (shape.length > 0) {
      setCheck({ status: "done", problems: shape });
      return;
    }
    setCheck({ status: "checking" });
    const request = new AbortController();
    const timer = setTimeout(() => {
      fetch(checkSlugPath(api), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant: String(tenant.id),
          parent: parentValue,
          slugs,
        }),
        signal: request.signal,
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(await messageOf(response));
          const body = (await response.json()) as {
            problems: DialogProblem[];
          };
          setCheck({ status: "done", problems: body.problems });
        })
        .catch(() => {
          if (!request.signal.aborted) setCheck({ status: "failed" });
        });
    }, CHECK_DELAY_MS);
    return () => {
      clearTimeout(timer);
      request.abort();
    };
  }, [api, parentValue, shape, slugs, tenant.id]);

  const pristine = !title.trim() && !slugEn;
  const problems = useMemo(
    () =>
      check.status === "done" && !pristine
        ? check.problems
        : ([] as DialogProblem[]),
    [check, pristine],
  );
  const problemOf = (field: SlugField) =>
    problems.find((problem) => problem.field === field);

  const rows = useMemo(
    () =>
      computeUrls({
        domain: tenant.domain,
        locales,
        defaultLocale,
        slugs,
        parentPaths: chosen?.paths,
        parent: Boolean(chosen),
      }),
    [chosen, defaultLocale, locales, slugs, tenant.domain],
  );

  const reach = getReach(
    { tenant: tenant.id },
    { collection: "pages", tenants: [tenant] },
  );

  const reason = !title.trim()
    ? "Add a title."
    : check.status === "checking"
      ? "Checking the slug…"
      : check.status === "done" && check.problems.length > 0
        ? "Fix the slug to continue."
        : undefined;

  const cancel = () => {
    if (busy) return;
    closeModal(NEW_PAGE_MODAL);
  };

  const submit = async () => {
    if (busy || reason) return;
    setBusy(true);
    setFailure(undefined);
    try {
      const response = await fetch(createDraftPath(api), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant: String(tenant.id),
          parent: parentValue,
          title: title.trim(),
          slugs,
        }),
      }).catch(() => undefined);
      if (!response) {
        setFailure("The CMS can't be reached.");
        return;
      }
      if (response.status === 422) {
        const body = (await response.json().catch(() => ({}))) as {
          problems?: DialogProblem[];
          message?: string;
        };
        if (body.problems?.length) {
          setCheck({ status: "done", problems: body.problems });
        } else {
          setFailure(body.message || "Try again.");
        }
        return;
      }
      if (!response.ok) {
        setFailure(await messageOf(response));
        return;
      }
      const created = (await response.json()) as {
        id: number | string;
        indonesianSlug?: string;
      };
      closeModal(NEW_PAGE_MODAL);
      if (created.indonesianSlug) {
        notify({
          tone: "error",
          title: "The Indonesian slug wasn't saved.",
          body: created.indonesianSlug,
        });
      }
      router.push(
        formatAdminURL({
          adminRoute: routes.admin,
          path: `/collections/pages/${created.id}`,
        }),
      );
    } finally {
      setBusy(false);
    }
  };

  const live = failure
    ? failure
    : check.status === "checking"
      ? "Checking the slug…"
      : check.status === "failed"
        ? CHECK_FAILED
        : problems.map((problem) => problem.message).join(" ");

  const renderProblem = (field: SlugField, id: string) => {
    const problem = problemOf(field);
    if (!problem) return null;
    return (
      <p className="dil-newpage__problem" id={id}>
        <MaterialIcon name="error" />
        <span>
          {problem.message}
          {problem.open && (
            <>
              {" "}
              <a
                className="dil-newpage__open"
                href={formatAdminURL({
                  adminRoute: routes.admin,
                  path: `/collections/pages/${problem.open.id}`,
                })}
              >
                Open it
              </a>
            </>
          )}
        </span>
      </p>
    );
  };

  return (
    <Modal
      className="dil-newpage"
      closeOnBlur={false}
      focusTrapOptions={focusTrapOptions}
      slug={NEW_PAGE_MODAL}
    >
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="dil-newpage__dialog"
        noValidate
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.stopPropagation();
          cancel();
        }}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        role="dialog"
      >
        <header className="dil-newpage__header">
          <h2 className="dil-newpage__title" id={titleId}>
            New page
          </h2>
          <ReachBadge reach={reach} />
        </header>

        <div className="dil-newpage__body">
          <div className="dil-newpage__field">
            <label className="dil-newpage__label" htmlFor={fieldId}>
              Title <abbr title="English">EN</abbr>
            </label>
            <input
              autoComplete="off"
              className="dil-newpage__input"
              id={fieldId}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugEnOwn) setSlugEn(slugify(event.target.value));
              }}
              ref={titleRef}
              required
              value={title}
            />
          </div>

          {options.status === "failed" && (
            <p
              className="dil-newpage__note dil-newpage__note--error"
              role="alert"
            >
              <MaterialIcon name="cloud_off" />
              <span>
                Couldn&apos;t load the pages you can pick as a parent. You can
                still create a top-level page.{" "}
                <button
                  className="dil-newpage__retry"
                  onClick={() => setReload((count) => count + 1)}
                  type="button"
                >
                  Try again
                </button>
              </span>
            </p>
          )}

          <div className="dil-newpage__field">
            <ParentPicker
              describedBy={parentNoteId}
              disabled={options.status !== "ready"}
              label="Parent page"
              onChange={setParent}
              options={list}
              value={parentValue ?? null}
            />
            <p className="dil-newpage__hint" id={parentNoteId}>
              {options.status === "loading"
                ? "Loading pages…"
                : "Leave empty for a top-level page."}
            </p>
          </div>

          <div className="dil-newpage__field">
            <label className="dil-newpage__label" htmlFor={slugEnId}>
              Slug <abbr title="English">EN</abbr>
            </label>
            <input
              aria-describedby={`${problemOf("slug-en") ? problemEnId : ""} ${fieldId}-hint`.trim()}
              aria-invalid={Boolean(problemOf("slug-en")) || undefined}
              autoComplete="off"
              autoCapitalize="none"
              className="dil-newpage__input dil-newpage__input--mono"
              id={slugEnId}
              onChange={(event) => {
                setSlugEn(event.target.value);
                setSlugEnOwn(event.target.value !== "");
              }}
              required
              spellCheck={false}
              value={slugEn}
            />
            {renderProblem("slug-en", problemEnId)}
            <p className="dil-newpage__hint" id={`${fieldId}-hint`}>
              {SLUG_HINT}
            </p>
          </div>

          <div className="dil-newpage__field">
            <label className="dil-newpage__label" htmlFor={slugIdId}>
              Slug <abbr title="Indonesian">ID</abbr>
            </label>
            <input
              aria-describedby={`${problemOf("slug-id") ? problemIdId : ""} ${slugIdId}-hint`.trim()}
              aria-invalid={Boolean(problemOf("slug-id")) || undefined}
              autoComplete="off"
              autoCapitalize="none"
              className="dil-newpage__input dil-newpage__input--mono"
              id={slugIdId}
              onChange={(event) => setSlugId(event.target.value)}
              spellCheck={false}
              value={slugId}
            />
            {renderProblem("slug-id", problemIdId)}
            <p className="dil-newpage__hint" id={`${slugIdId}-hint`}>
              {idSlugNote(slugEn.trim(), slugId.trim())}
            </p>
          </div>

          <section aria-label="Full URL" className="dil-newpage__urls">
            <h3 className="dil-newpage__urls-title">
              Full URL · updates as you type
            </h3>
            <ul className="dil-newpage__url-list">
              {rows.map((row) => {
                const { head, tail } = splitDisplay(row.display);
                return (
                  <li className="dil-newpage__url" key={row.locale}>
                    <abbr
                      className="dil-editor-urls__lang"
                      title={row.locale === "en" ? "English" : "Indonesian"}
                    >
                      {row.locale.toUpperCase()}
                    </abbr>
                    <code className="dil-newpage__url-text">
                      {head}
                      <strong>{tail}</strong>
                    </code>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="dil-newpage__note">
            <MaterialIcon name="edit_note" />
            <span>{DRAFT_NOTE}</span>
          </p>
          <p className="dil-newpage__hint">{CHECK_FOOTNOTE}</p>

          {check.status === "failed" && (
            <p className="dil-newpage__hint">{CHECK_FAILED}</p>
          )}
          {failure && (
            <p className="dil-newpage__problem" role="alert">
              <MaterialIcon name="error" />
              <span>{failure}</span>
            </p>
          )}
          <div
            aria-live="polite"
            className="dil-sr-only"
            data-testid="new-page-live"
            role="status"
          >
            {live}
          </div>
        </div>

        <footer className="dil-newpage__controls">
          <ActionButton onClick={cancel} type="button" variant="secondary">
            Cancel
          </ActionButton>
          <ActionButton
            busy={busy}
            type="submit"
            unavailableReason={reason}
            variant="primary"
          >
            Create draft
          </ActionButton>
        </footer>
      </form>
    </Modal>
  );
}
