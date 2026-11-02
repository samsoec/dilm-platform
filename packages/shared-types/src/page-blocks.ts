export const PAGE_BLOCK_GROUPS = [
  "Hero",
  "Content",
  "Records",
  "Company sections",
  "Current company",
  "Template",
] as const;

export type PageBlockGroup = (typeof PAGE_BLOCK_GROUPS)[number];

export const MAX_LAYOUT_BLOCKS = 30;

export const HEADING_ALIGNMENTS = ["center", "left", "split"] as const;

export type HeadingAlignment = (typeof HEADING_ALIGNMENTS)[number];

export const BUTTON_STYLES = ["primary", "light", "text"] as const;

export type ButtonStyle = (typeof BUTTON_STYLES)[number];

export const SECTION_BACKGROUNDS = [
  "default",
  "muted",
  "dark",
  "image",
] as const;

export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number];

export const RECORD_SOURCES = ["manual", "latest", "all"] as const;

export type RecordSource = (typeof RECORD_SOURCES)[number];

export const ICON_MIME_TYPES = ["image/svg+xml", "image/png"] as const;

export const ANCHOR_ID_PATTERN = /^[a-z0-9-]+$/;
