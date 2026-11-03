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

export const PRODUCT_CARD_STYLES = [
  "imageOverlay",
  "imageCard",
  "textCard",
] as const;

export type ProductCardStyle = (typeof PRODUCT_CARD_STYLES)[number];

export const SOLUTION_CARD_STYLES = [
  "imageCard",
  "textCard",
  "imageTitle",
] as const;

export type SolutionCardStyle = (typeof SOLUTION_CARD_STYLES)[number];

export const POST_LAYOUTS = ["carousel", "overlay", "featured"] as const;

export type PostLayout = (typeof POST_LAYOUTS)[number];

export const POST_CARD_EYEBROWS = ["category", "entity"] as const;

export type PostCardEyebrow = (typeof POST_CARD_EYEBROWS)[number];

export const RECORD_TABS = ["solutions", "products"] as const;

export type RecordTab = (typeof RECORD_TABS)[number];

export const MAX_TAB_ITEMS = 9;

export const MAX_SHOWCASE_ITEMS = 24;

export const MAX_POST_ITEMS = 12;

export const MAX_JOB_ITEMS = 6;

export const DEFAULT_JOB_LIMIT = 3;

export const MAX_RECORD_QUERY = 100;
