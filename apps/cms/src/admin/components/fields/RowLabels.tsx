"use client";

import { useRowLabel } from "@payloadcms/ui";

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
import { SameAsEnBadge, useSameAsDefault } from "./SameAsEnTag";

function RowLabel({
  number,
  title,
  meta,
  same,
}: {
  number: string;
  title: string;
  meta: string[];
  same: boolean;
}) {
  return (
    <span className="dil-row-label">
      <span className="dil-row-label__number">{number}</span>
      <span className="dil-row-label__title">{title || "Untitled"}</span>
      {meta.map((part) => (
        <span className="dil-row-label__meta" key={part}>
          {part}
        </span>
      ))}
      {same && <SameAsEnBadge />}
    </span>
  );
}

export function NavItemRowLabel() {
  const { data, path, rowNumber } = useRowLabel<NavItemValue>();
  const title = navItemTitle(data ?? {});
  const same = useSameAsDefault(
    `${path}.${navItemLabelPath(data ?? {})}`,
    title,
  );
  return (
    <RowLabel
      meta={navItemMeta(data ?? {})}
      number={rowNumberText(rowNumber)}
      same={same}
      title={title}
    />
  );
}

export function LinkRowLabel() {
  const { data, path, rowNumber } = useRowLabel<{ link?: LinkValue }>();
  const link = data?.link ?? {};
  const same = useSameAsDefault(`${path}.link.label`, link.label);
  return (
    <RowLabel
      meta={[linkTarget(link), tabText(link.newTab)].filter(Boolean)}
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
      meta={[columnMeta(data ?? {}, maxLinks)]}
      number={rowNumberText(rowNumber)}
      same={same}
      title={data?.title ?? ""}
    />
  );
}
