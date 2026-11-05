"use client";

import {
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useLocale,
  useModal,
} from "@payloadcms/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import {
  displayUrl,
  impactBody,
  isImpactReply,
  linksSummary,
  liveOnNote,
  pathImpactPath,
  sameValues,
  urlChangeKind,
  URL_CHANGE_CHECKING,
  URL_CHANGE_FAILED,
  URL_CHANGE_FOOTNOTE,
  URL_CHANGE_MODAL,
  valuesKey,
  type PathImpactReply,
  type UrlValues,
} from "./urlChange";
import { relationId } from "./urls";

export const URL_CHANGE_DELAY_MS = 350;

const SHOWN_LINKS = 5;

type Phase =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "review"; impact: PathImpactReply }
  | { kind: "refusal"; impact: PathImpactReply }
  | { kind: "failed"; message: string };

type Raw = { slug: unknown; parent: unknown };

function valuesOf(raw: Raw): UrlValues {
  return {
    slug: typeof raw.slug === "string" ? raw.slug : "",
    parent: relationId(raw.parent as Parameters<typeof relationId>[0]) ?? null,
  };
}

async function replyMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || URL_CHANGE_FAILED;
  } catch {
    return URL_CHANGE_FAILED;
  }
}

function fieldElement(which: "slug" | "parent"): HTMLElement | null {
  return which === "slug"
    ? document.querySelector<HTMLElement>("#field-slug")
    : document.querySelector<HTMLElement>("#field-parent input");
}

function useSlugEditing(): boolean {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const track = (on: boolean) => (event: Event) => {
      if ((event.target as HTMLElement | null)?.id === "field-slug") {
        setEditing(on);
      }
    };
    const focusIn = track(true);
    const focusOut = track(false);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    return () => {
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
    };
  }, []);
  return editing;
}

export function UrlChangeGuard({ domain }: { domain?: string }) {
  const { id, collectionSlug, hasSavePermission } = useDocumentInfo();
  const { dispatchFields } = useForm();
  const { openModal } = useModal();
  const { code } = useLocale();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const slugField = useFormFields(([fields]) => fields.slug);
  const parentField = useFormFields(([fields]) => fields.parent);
  const editing = useSlugEditing();
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [retry, setRetry] = useState(0);
  const checked = useRef<string>(undefined);
  const accepted = useRef<{ key: string; raw: Raw }>(undefined);
  const trigger = useRef<"slug" | "parent">("slug");

  const enabled =
    collectionSlug === "pages" &&
    id !== undefined &&
    hasSavePermission !== false;
  const api = `${serverURL ?? ""}${routes.api}`;

  const now = valuesOf({
    slug: slugField?.value,
    parent: parentField?.value,
  });
  const slugNow = now.slug;
  const parentNow = now.parent;
  const initialRaw: Raw = {
    slug: slugField?.initialValue,
    parent: parentField?.initialValue,
  };
  const initialKey = `${code}|${valuesKey(valuesOf(initialRaw))}`;
  const baseRaw: Raw =
    accepted.current?.key === initialKey ? accepted.current.raw : initialRaw;
  const base = valuesOf(baseRaw);
  const baseSlug = base.slug;
  const nowKey = valuesKey(now);
  const unchanged = sameValues(now, base);
  const hasSlugField = Boolean(slugField);

  useEffect(() => {
    if (unchanged) checked.current = undefined;
  }, [unchanged]);

  useEffect(() => {
    if (!enabled || !hasSlugField || unchanged || editing) return;
    if (checked.current === nowKey) return;
    const request = new AbortController();
    const timer = setTimeout(() => {
      setPhase({ kind: "checking" });
      fetch(pathImpactPath(api, id), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          impactBody(code, { slug: slugNow, parent: parentNow }),
        ),
        signal: request.signal,
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(await replyMessage(response));
          const body: unknown = await response.json();
          if (request.signal.aborted) return;
          if (!isImpactReply(body)) throw new Error(URL_CHANGE_FAILED);
          checked.current = nowKey;
          const kind = urlChangeKind(body);
          if (kind === "none") {
            setPhase({ kind: "idle" });
            return;
          }
          trigger.current = slugNow !== baseSlug ? "slug" : "parent";
          setPhase({ kind, impact: body });
          openModal(URL_CHANGE_MODAL);
        })
        .catch((error: unknown) => {
          if (request.signal.aborted) return;
          checked.current = nowKey;
          setPhase({
            kind: "failed",
            message:
              error instanceof Error && error.message
                ? error.message
                : URL_CHANGE_FAILED,
          });
        });
    }, URL_CHANGE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      request.abort();
      setPhase((current) =>
        current.kind === "checking" ? { kind: "idle" } : current,
      );
    };
  }, [
    api,
    baseSlug,
    code,
    editing,
    enabled,
    hasSlugField,
    id,
    nowKey,
    openModal,
    parentNow,
    retry,
    slugNow,
    unchanged,
  ]);

  const keepOld = useCallback(() => {
    dispatchFields({ type: "UPDATE", path: "slug", value: baseRaw.slug });
    dispatchFields({ type: "UPDATE", path: "parent", value: baseRaw.parent });
    checked.current = undefined;
    setPhase({ kind: "idle" });
  }, [baseRaw.parent, baseRaw.slug, dispatchFields]);

  const changeUrl = useCallback(() => {
    accepted.current = {
      key: initialKey,
      raw: { slug: slugField?.value, parent: parentField?.value },
    };
    setPhase({ kind: "idle" });
  }, [initialKey, parentField?.value, slugField?.value]);

  const impact =
    phase.kind === "review" || phase.kind === "refusal"
      ? phase.impact
      : undefined;
  const refusal = phase.kind === "refusal";

  return (
    <>
      <div
        aria-live="polite"
        className="dil-sr-only"
        data-testid="url-change-live"
        role="status"
      >
        {phase.kind === "checking" ? URL_CHANGE_CHECKING : ""}
      </div>
      {phase.kind === "failed" && (
        <Banner
          action={
            <ActionButton
              onClick={() => {
                checked.current = undefined;
                setPhase({ kind: "idle" });
                setRetry((count) => count + 1);
              }}
              type="button"
              variant="text"
            >
              Try again
            </ActionButton>
          }
          className="dil-editor-banner"
          icon="cloud_off"
          tone="error"
        >
          {phase.message}
        </Banner>
      )}
      {impact && (
        <ConfirmDialog
          body={
            <UrlChangeBody
              domain={domain}
              impact={impact}
              locale={code}
              refusal={refusal}
            />
          }
          cancelLabel="Keep old URL"
          confirmLabel="Change URL"
          icon={refusal ? "warning" : "swap_horiz"}
          onCancel={keepOld}
          onConfirm={changeUrl}
          refusal={refusal}
          returnFocus={() => fieldElement(trigger.current)}
          slug={URL_CHANGE_MODAL}
          title={
            refusal
              ? "This change moves too many pages"
              : "Change this page's URL?"
          }
          tone="discard"
        />
      )}
    </>
  );
}

export function UrlChangeBody({
  domain,
  impact,
  locale,
  refusal,
}: {
  domain?: string;
  impact: PathImpactReply;
  locale: string;
  refusal: boolean;
}) {
  const changed = impact.urls.filter((url) => url.from !== url.to);
  return (
    <div className="dil-urlchange">
      <p>
        {refusal
          ? (impact.message ?? "This change moves too many pages.")
          : liveOnNote(domain)}
      </p>
      <ul className="dil-urlchange__urls">
        {changed.map((url) => (
          <li className="dil-urlchange__url" key={url.locale}>
            <abbr title={url.locale === "en" ? "English" : "Indonesian"}>
              {url.locale.toUpperCase()}
            </abbr>
            <s>
              <span className="dil-sr-only">Old address </span>
              <code>{displayUrl(domain, url.locale, url.from)}</code>
            </s>
            <span aria-hidden="true">→</span>
            <strong>
              <span className="dil-sr-only">New address </span>
              <code>{displayUrl(domain, url.locale, url.to)}</code>
            </strong>
          </li>
        ))}
      </ul>
      <dl className="dil-urlchange__counts">
        <div>
          <dt>Child pages</dt>
          <dd>{impact.childPages}</dd>
        </div>
        <div>
          <dt>Records</dt>
          <dd>{impact.records}</dd>
        </div>
        <div>
          <dt>Redirects</dt>
          <dd>{impact.redirects}</dd>
        </div>
      </dl>
      {!refusal && (
        <>
          <p>{linksSummary(impact)}</p>
          {impact.links.length > 0 && (
            <ul className="dil-urlchange__links">
              {impact.links.slice(0, SHOWN_LINKS).map((link) => (
                <li key={`${link.collection}:${link.id}`}>
                  <code>
                    {link.paths[locale] ?? Object.values(link.paths)[0] ?? "/"}
                  </code>
                </li>
              ))}
              {impact.linkCount > SHOWN_LINKS && (
                <li>and {impact.linkCount - SHOWN_LINKS} more</li>
              )}
            </ul>
          )}
          <p className="dil-urlchange__footnote">{URL_CHANGE_FOOTNOTE}</p>
        </>
      )}
    </div>
  );
}
