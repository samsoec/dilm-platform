"use client";

import { useFormFields, useRowLabel } from "@payloadcms/ui";
import { useEffect, useRef } from "react";

import {
  type ColumnValue,
  columnMeta,
  type LinkValue,
  linkTarget,
  type NavItemValue,
  navItemLabelPath,
  navItemMeta,
  navItemTitle,
  rowNumberText,
  tabText,
} from "../../layoutEditor";
import {
  SOCIAL_PLATFORM_LABELS,
  type SocialPlatform,
} from "../../data/socialPlatforms";
import { MaterialIcon } from "../MaterialIcon";
import { referenceTitle } from "../../linkPicker";
import { announce } from "./announce";
import { useLinkTarget } from "./useLinkTarget";
import { SameAsEnBadge, useSameAsDefault } from "./SameAsEnTag";

function RowLabel({
  number,
  title,
  meta,
  same,
  full = false,
  missingTitle,
  linkName,
}: {
  linkName?: string;
  number: string;
  title: string;
  meta: string[];
  same: boolean;
  full?: boolean;
  missingTitle?: string;
}) {
  return (
    <span className="dil-row-label">
      <span className="dil-row-label__number">{number}</span>
      <span
        className={`dil-row-label__title${title ? "" : " dil-row-label__title--empty"}`}
      >
        {title || "Untitled"}
      </span>
      {!title && missingTitle && (
        <span className="dil-row-label__missing">
          <MaterialIcon name="error" />
          {missingTitle}
        </span>
      )}
      {linkName && (
        <span className="dil-row-label__meta dil-row-label__link">
          <MaterialIcon name="link" />
          {linkName}
        </span>
      )}
      {meta.map((part) => (
        <span
          className={`dil-row-label__meta${full ? " dil-row-label__meta--full" : ""}`}
          key={part}
        >
          {part}
        </span>
      ))}
      {same && <SameAsEnBadge />}
    </span>
  );
}

function useMoveAnnouncement(
  path: string,
  title: string,
  rowNumber: number | undefined,
) {
  const arrayPath = path.slice(0, path.lastIndexOf("."));
  const count = useFormFields(
    ([fields]) => fields[arrayPath]?.rows?.length ?? 0,
  );
  const previous = useRef(rowNumber);
  const previousCount = useRef(count);
  useEffect(() => {
    const moved =
      previous.current !== undefined &&
      rowNumber !== undefined &&
      previous.current !== rowNumber &&
      previousCount.current === count;
    if (moved) {
      announce(
        `${title || "Untitled"}, moved to position ${rowNumber + 1} of ${count}.`,
      );
    }
    previous.current = rowNumber;
    previousCount.current = count;
  }, [count, rowNumber, title]);
}

export function NavItemRowLabel() {
  const { data, path, rowNumber } = useRowLabel<NavItemValue>();
  const title = navItemTitle(data ?? {});
  useMoveAnnouncement(path, title, rowNumber);
  const same = useSameAsDefault(
    `${path}.${navItemLabelPath(data ?? {})}`,
    title,
  );
  const linkName = useLinkName(data?.type === "dropdown" ? null : data?.link);
  return (
    <RowLabel
      linkName={linkName}
      meta={navItemMeta(data ?? {}).filter((part) =>
        linkName ? part !== linkTarget(data?.link) : true,
      )}
      number={rowNumberText(rowNumber)}
      same={same}
      title={title}
    />
  );
}

function useLinkName(link: LinkValue | null | undefined): string {
  const reference = link?.type === "reference" ? link.reference : undefined;
  const { doc } = useLinkTarget(reference);
  if (!reference?.relationTo || !doc) return "";
  return referenceTitle(reference.relationTo, doc);
}

export function LinkRowLabel() {
  const { data, path, rowNumber } = useRowLabel<{ link?: LinkValue }>();
  const link = data?.link ?? {};
  const same = useSameAsDefault(`${path}.link.label`, link.label);
  const linkName = useLinkName(link);
  return (
    <RowLabel
      linkName={linkName}
      meta={[linkName ? "" : linkTarget(link), tabText(link.newTab)].filter(
        Boolean,
      )}
      number={rowNumberText(rowNumber)}
      same={same}
      title={link.label ?? ""}
    />
  );
}

export function ColumnRowLabel({ maxLinks }: { maxLinks: number }) {
  const { data, path, rowNumber } = useRowLabel<ColumnValue>();
  const same = useSameAsDefault(`${path}.title`, data?.title);
  return (
    <RowLabel
      full={(data?.links?.length ?? 0) >= maxLinks}
      meta={[columnMeta(data ?? {}, maxLinks)]}
      missingTitle="Add a title"
      number={rowNumberText(rowNumber)}
      same={same}
      title={data?.title ?? ""}
    />
  );
}

export function SocialRowLabel() {
  const { data, path, rowNumber } = useRowLabel<{
    platform?: SocialPlatform | null;
    url?: string | null;
  }>();
  const title = data?.platform ? SOCIAL_PLATFORM_LABELS[data.platform] : "";
  useMoveAnnouncement(path, title, rowNumber);
  return (
    <RowLabel
      meta={data?.url ? [data.url] : []}
      number={rowNumberText(rowNumber)}
      same={false}
      title={title}
    />
  );
}
