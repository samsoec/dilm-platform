"use client";

import {
  useConfig,
  useDocumentInfo,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";
import { useEffect, useMemo, useState } from "react";

import { MaterialIcon } from "../MaterialIcon";
import {
  categoryChangeSummary,
  categoryMoves,
  type CategoryChange,
  type CategoryMove,
} from "./urlChange";
import { mergeSlugs, relationId } from "./urls";

type Locales = Record<string, string | null | undefined>;

type Stored = { status?: string; slug: Locales; path: Locales };

type Lookup<T> =
  { key: string; value: T } | { key: string; failed: true } | undefined;

function asLocales(value: unknown, fallbackLocale: string): Locales {
  if (typeof value === "string") return { [fallbackLocale]: value };
  return value && typeof value === "object" ? (value as Locales) : {};
}

export function CategoryChangeNote({
  moves,
  failed,
}: {
  moves: CategoryMove[];
  failed?: boolean;
}) {
  if (failed) {
    return (
      <p className="dil-field-warning" role="alert">
        <MaterialIcon name="error" />
        The post&apos;s new address couldn&apos;t be worked out. The redirect is
        still created when the post is published.
      </p>
    );
  }
  if (moves.length === 0) return null;
  return (
    <div className="dil-category-note" role="status">
      <p className="dil-category-note__text">
        <MaterialIcon name="subdirectory_arrow_right" />
        <span>{categoryChangeSummary(moves)}</span>
      </p>
      <ul className="dil-category-note__moves">
        {moves.map((move) => (
          <li key={move.locale}>
            <abbr title={move.locale === "en" ? "English" : "Indonesian"}>
              {move.locale.toUpperCase()}
            </abbr>
            <s>
              <span className="dil-sr-only">Old address </span>
              <code>{move.from}</code>
            </s>
            <span aria-hidden="true">→</span>
            <strong>
              <span className="dil-sr-only">New address </span>
              <code>{move.to}</code>
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PostCategoryNote() {
  const { id, collectionSlug } = useDocumentInfo();
  const { code } = useLocale();
  const {
    config: { localization, routes, serverURL },
  } = useConfig();
  const field = useFormFields(([fields]) => fields.primaryCategory);
  const slug = useFormFields(([fields]) => fields.slug?.value);
  const wanted = relationId(field?.value as Parameters<typeof relationId>[0]);
  const original = relationId(
    field?.initialValue as Parameters<typeof relationId>[0],
  );
  const changed = Boolean(wanted) && wanted !== original && id !== undefined;
  const api = `${serverURL ?? ""}${routes.api}`;
  const [post, setPost] = useState<Lookup<Stored>>();
  const [category, setCategory] = useState<Lookup<Locales>>();
  const locales = useMemo(
    () => (localization ? localization.localeCodes : ["en"]),
    [localization],
  );
  const fallbackLocale = localization ? localization.defaultLocale : "en";
  const active = collectionSlug === "posts" && changed;

  useEffect(() => {
    if (!active) return;
    const key = String(id);
    const request = new AbortController();
    fetch(
      `${api}/posts/${encodeURIComponent(key)}?draft=false&trash=true&locale=all&fallbackLocale=false&depth=0&select[slug]=true&select[path]=true&select[_status]=true`,
      { credentials: "include", signal: request.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("lookup failed");
        const doc = (await response.json()) as {
          _status?: string;
          deletedAt?: string | null;
          slug?: unknown;
          path?: unknown;
        };
        setPost({
          key,
          value: {
            status: doc.deletedAt ? "trashed" : doc._status,
            slug: asLocales(doc.slug, fallbackLocale),
            path: asLocales(doc.path, fallbackLocale),
          },
        });
      })
      .catch(() => {
        if (!request.signal.aborted) setPost({ key, failed: true });
      });
    return () => request.abort();
  }, [active, api, fallbackLocale, id]);

  useEffect(() => {
    if (!active || !wanted) return;
    const request = new AbortController();
    fetch(
      `${api}/categories/${encodeURIComponent(wanted)}?locale=all&fallbackLocale=false&depth=0&select[path]=true`,
      { credentials: "include", signal: request.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("lookup failed");
        const doc = (await response.json()) as { path?: unknown };
        setCategory({
          key: wanted,
          value: asLocales(doc.path, fallbackLocale),
        });
      })
      .catch(() => {
        if (!request.signal.aborted) setCategory({ key: wanted, failed: true });
      });
    return () => request.abort();
  }, [active, api, fallbackLocale, wanted]);

  const moves = useMemo(() => {
    if (!active || !wanted) return [];
    if (!post || post.key !== String(id) || "failed" in post) return [];
    if (!category || category.key !== wanted || "failed" in category) {
      return [];
    }
    const change: CategoryChange = {
      locales,
      fallbackLocale,
      live: post.value.status === "published",
      slugs: mergeSlugs(post.value.slug, {
        locale: code,
        slug: typeof slug === "string" ? slug : undefined,
      }),
      current: post.value.path,
      category: category.value,
    };
    return categoryMoves(change);
  }, [active, category, code, fallbackLocale, id, locales, post, slug, wanted]);

  const failed =
    active &&
    ((post && post.key === String(id) && "failed" in post) ||
      (category && category.key === wanted && "failed" in category));

  return <CategoryChangeNote failed={Boolean(failed)} moves={moves} />;
}
