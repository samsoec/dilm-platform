"use client";

import { useConfig, useModal } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { type ReactNode, useEffect, useState } from "react";

import {
  linkPath,
  placementText,
  publishBlockText,
  publishButtonLabel,
  publishTitle,
  refusalText,
  templateChangeText,
  trashTitle,
  unpublishLead,
  unpublishTitle,
  type FieldProblem,
  type Impact,
  validationSummary,
} from "../../../publish/confirmations";
import { Banner } from "../kit/Banner";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { ReachBadge } from "../kit/ReachBadge";
import { prePublishQuestions } from "./prePublish";

export function useImpact(
  collection: string | undefined,
  id: number | string | undefined,
  active: boolean,
): { impact?: Impact; failed: boolean } {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const [state, setState] = useState<{ impact?: Impact; failed: boolean }>({
    failed: false,
  });
  useEffect(() => {
    if (!active || !collection || id === undefined) return;
    let current = true;
    const url = formatAdminURL({
      apiRoute: routes.api,
      serverURL,
      path: `/${collection}/${id}/publish-impact`,
    });
    setState({ failed: false });
    fetch(url, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("impact");
        return (await response.json()) as { impact: Impact };
      })
      .then(({ impact }) => current && setState({ impact, failed: false }))
      .catch(() => current && setState({ failed: true }));
    return () => {
      current = false;
    };
  }, [active, collection, id, routes.api, serverURL]);
  return state;
}

function useOpen(slug: string): boolean {
  const { isModalOpen } = useModal();
  return isModalOpen(slug);
}

function SiteUrlList({ impact }: { impact: Impact }) {
  return (
    <ul className="dil-editor-publish__urls">
      {impact.sites.map((site) => (
        <li key={site.domain}>
          <b>{site.domain}</b>
          <ul>
            {site.urls.map((row) => (
              <li key={row.locale}>
                <code>{row.url}</code>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function LinkList({ impact }: { impact: Impact }) {
  return (
    <ul className="dil-editor-publish__urls">
      {impact.links.map((link) => (
        <li key={`${link.collection}:${link.id}`}>
          {link.title} <code>{linkPath(link.paths)}</code>
        </li>
      ))}
      {impact.linkCount > impact.links.length && (
        <li>and {impact.linkCount - impact.links.length} more</li>
      )}
    </ul>
  );
}

export type ConfirmProps = {
  slug: string;
  collection: string | undefined;
  id: number | string | undefined;
  name: string;
  onConfirm: () => Promise<void> | void;
  consentEmpty?: boolean;
};

export function PublishConfirm({
  slug,
  collection,
  id,
  name,
  onConfirm,
  consentEmpty,
}: Omit<ConfirmProps, "onConfirm"> & {
  onConfirm: (impact: Impact | undefined) => Promise<void> | void;
}) {
  const open = useOpen(slug);
  const { impact, failed } = useImpact(collection, id, open);
  const block = impact?.block
    ? publishBlockText(impact.block)
    : consentEmpty
      ? "Add the consent text before publishing."
      : undefined;
  const questions = impact
    ? prePublishQuestions
        .map((ask) => ask(impact))
        .filter((node): node is ReactNode => Boolean(node))
    : [];
  return (
    <ConfirmDialog
      body={
        <>
          {impact && <ReachBadge reach={reachOf(impact)} />}
          {!impact && !failed && <p>Checking where this goes live…</p>}
          {failed && <p>Couldn&apos;t check where this goes live.</p>}
          {impact && impact.sites.length > 0 && (
            <>
              <p>It goes live at</p>
              <SiteUrlList impact={impact} />
            </>
          )}
          {impact?.template && <p>{templateChangeText(impact.template)}</p>}
          {questions}
          {block && <Banner tone="error">{block}</Banner>}
        </>
      }
      busyLabel="Publishing…"
      cancelLabel={block ? "Close" : "Cancel"}
      confirmLabel={publishButtonLabel(impact)}
      icon="public"
      onConfirm={() => onConfirm(impact)}
      refusal={Boolean(block)}
      slug={slug}
      title={publishTitle(name)}
      tone="go-live"
    />
  );
}

function reachOf(impact: Impact) {
  return impact.reach.scope === "all"
    ? {
        scope: "all" as const,
        sites: impact.reach.sites,
        label: impact.reach.label,
      }
    : {
        scope: "tenant" as const,
        domain: impact.sites[0]?.domain,
        label: impact.reach.label,
      };
}

export function UnpublishConfirm({
  slug,
  collection,
  id,
  name,
  onConfirm,
}: ConfirmProps) {
  const open = useOpen(slug);
  const { impact } = useImpact(collection, id, open);
  return (
    <ConfirmDialog
      body={
        impact ? (
          <>
            {impact.collection === "posts" ? (
              impact.placements.length > 0 ? (
                <ul className="dil-editor-publish__urls">
                  {impact.placements.map((placement) => (
                    <li key={`${placement.pageId}:${placement.kind}`}>
                      {placementText(placement)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>It isn&apos;t in any list or card.</p>
              )
            ) : (
              <>
                <p>{unpublishLead(impact)}</p>
                {impact.linkCount > 0 && <LinkList impact={impact} />}
              </>
            )}
          </>
        ) : (
          <p>Checking what links here…</p>
        )
      }
      confirmLabel="Unpublish"
      icon="unpublished"
      onConfirm={onConfirm}
      slug={slug}
      title={impact ? unpublishTitle(name, impact) : `Unpublish "${name}"?`}
      tone="go-live"
    />
  );
}

export function TrashConfirm({
  slug,
  collection,
  id,
  name,
  onConfirm,
  settingsHref,
  messagesHref,
}: ConfirmProps & { settingsHref?: string; messagesHref?: string }) {
  const open = useOpen(slug);
  const { impact } = useImpact(collection, id, open);
  const refusal = impact?.refusal ?? null;
  const href =
    refusal?.kind === "recordBase"
      ? settingsHref
      : refusal?.kind === "cookiePolicy"
        ? messagesHref
        : undefined;
  return (
    <ConfirmDialog
      body={
        impact ? (
          refusal ? (
            <>
              <p>{refusalText(impact.title, refusal)}</p>
              {refusal.kind === "children" && (
                <ul className="dil-editor-publish__urls">
                  {refusal.children.map((child) => (
                    <li key={child.id}>{child.title}</li>
                  ))}
                </ul>
              )}
              {href && (
                <a href={href}>
                  {refusal.kind === "recordBase"
                    ? refusal.label
                    : "Open Site messages"}
                </a>
              )}
            </>
          ) : (
            <>
              {impact.sites.length > 0 && <SiteUrlList impact={impact} />}
              {impact.linkCount > 0 ? (
                <>
                  <p>
                    {impact.linkCount === 1
                      ? "1 link points here and will show as plain text:"
                      : `${impact.linkCount} links point here and will show as plain text:`}
                  </p>
                  <LinkList impact={impact} />
                </>
              ) : (
                <p>No links point here.</p>
              )}
            </>
          )
        ) : (
          <p>Checking what links here…</p>
        )
      }
      cancelLabel={refusal ? "Close" : "Cancel"}
      confirmLabel="Move to trash"
      onConfirm={onConfirm}
      refusal={Boolean(refusal)}
      slug={slug}
      title={trashTitle(name)}
      tone="delete"
    />
  );
}

export function ValidationSummary({ problems }: { problems: FieldProblem[] }) {
  if (problems.length === 0) return null;
  return (
    <Banner tone="error" title={validationSummary(problems.length)}>
      <ul className="dil-editor-publish__urls">
        {problems.map((problem) => (
          <li key={problem.path}>
            {problem.label}: {problem.message}{" "}
            <a
              href={`#field-${problem.path.replace(/\./g, "__")}`}
              onClick={(event) => {
                const target = document.getElementById(
                  `field-${problem.path.replace(/\./g, "__")}`,
                );
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ block: "center" });
                target.querySelector<HTMLElement>("input, textarea")?.focus();
              }}
            >
              Go to field
            </a>
          </li>
        ))}
      </ul>
    </Banner>
  );
}
