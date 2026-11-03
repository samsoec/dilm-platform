import {
  FixedToolbarFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";
import type {
  CollectionSlug,
  Field,
  NamedGroupField,
  RichTextField,
  RichTextFieldValidation,
} from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { localization } from "../localization";

export const consentEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      LinkFeature({ enabledCollections: [] }),
      FixedToolbarFeature(),
    ],
  });

type LexicalNode = { text?: unknown; children?: unknown };

function hasText(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const { text, children } = node as LexicalNode;
  if (typeof text === "string" && text.trim() !== "") return true;
  return Array.isArray(children) && children.some(hasText);
}

export function isConsentEmpty(value: unknown): boolean {
  const root = (value as { root?: unknown } | null | undefined)?.root;
  return !hasText(root);
}

export const CONSENT_CHECK_FAILED =
  "Couldn't check the consent text in the other languages. Try publishing again.";

export function consentMissingMessage(missing: readonly string[]): string {
  const names = new Intl.DisplayNames(["en"], { type: "language" });
  const languages = missing.map((code) => names.of(code) ?? code).join(" and ");
  return `Add the consent text in ${languages}. Visitors can't send the form without agreeing to it, so the page can't be published. Save draft still works.`;
}

const LOCALES = localization.locales as readonly string[];

function bylocale(value: unknown, current: string): Record<string, unknown> {
  const map = value as Record<string, unknown> | null | undefined;
  const isMap =
    map !== null &&
    typeof map === "object" &&
    !("root" in map) &&
    Object.keys(map).length > 0 &&
    Object.keys(map).every((key) => LOCALES.includes(key));
  return isMap ? { ...map } : { [current]: value };
}

type StoredBlock = {
  id?: string;
  form?: { consentText?: Record<string, unknown> | null } | null;
};

export const validateConsent: RichTextFieldValidation = async (value, args) => {
  const current = args.req?.locale ?? localization.defaultLocale;
  const known = bylocale(value, current);
  const unknown = LOCALES.filter((code) => !(code in known));
  if (unknown.length > 0) {
    const blockId = (args.blockData as { id?: string } | undefined)?.id;
    const payload = args.req?.payload;
    if (blockId && args.collectionSlug && args.id !== undefined && payload) {
      try {
        const stored = (await payload.findByID({
          collection: args.collectionSlug as CollectionSlug,
          id: args.id as number | string,
          depth: 0,
          draft: true,
          locale: "all",
          fallbackLocale: false,
          overrideAccess: true,
          req: args.req,
        })) as { layout?: StoredBlock[] | null };
        const block = stored.layout?.find((row) => row.id === blockId);
        for (const code of unknown) {
          known[code] = block?.form?.consentText?.[code];
        }
      } catch {
        return CONSENT_CHECK_FAILED;
      }
    }
  }
  const missing = LOCALES.filter((code) => isConsentEmpty(known[code]));
  return missing.length === 0 ? true : consentMissingMessage(missing);
};

function wordingGroup(name: string, label: string): NamedGroupField {
  return {
    name,
    label,
    type: "group",
    admin: { description: "The field stays on the form and stays required." },
    fields: [
      withSameAsEnTag({
        name: "label",
        type: "text",
        required: true,
        localized: true,
      }),
      withSameAsEnTag({ name: "placeholder", type: "text", localized: true }),
    ],
  };
}

export const consentText: RichTextField = {
  name: "consentText",
  label: "Consent text",
  type: "richText",
  localized: true,
  editor: consentEditor(),
  validate: validateConsent,
  admin: {
    description:
      "Shown beside the checkbox visitors must tick. Must link to the company's Privacy Policy (UU PDP). Needed in every language to publish; saving a draft works without it.",
  },
};

export function applicationFormFields<Name extends string>(
  names: readonly Name[],
  labels: Record<Name, string>,
): Field[] {
  return [
    withSameAsEnTag({ name: "eyebrow", type: "text", localized: true }),
    withSameAsEnTag({ name: "title", type: "text", localized: true }),
    withSameAsEnTag({ name: "description", type: "textarea", localized: true }),
    {
      name: "fields",
      label: "Field wording",
      type: "group",
      admin: {
        description:
          "The fields are fixed under UU PDP (data minimisation). You can change their wording, not add, remove or make them optional.",
      },
      fields: names.map((name) => wordingGroup(name, labels[name])),
    },
    consentText,
    withSameAsEnTag({ name: "submitLabel", type: "text", localized: true }),
    withSameAsEnTag({
      name: "successMessage",
      type: "textarea",
      localized: true,
    }),
    withSameAsEnTag({
      name: "errorMessage",
      type: "textarea",
      localized: true,
    }),
  ];
}
