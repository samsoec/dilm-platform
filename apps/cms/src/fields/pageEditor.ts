import { createBreadcrumbsField } from "@payloadcms/plugin-nested-docs";
import type {
  CheckboxField,
  CollectionConfig,
  Field,
  GroupField,
  RelationshipField,
  TabsField,
  UIField,
} from "payload";

import { localizedSeoFields } from "../pageModel";
import { hasRedirect } from "../pageRules";
import {
  pageLayout,
  pathField,
  slugField,
  slugFallbackField,
} from "./pageFields";
import { link } from "./link";

const EDITOR = "/admin/components/editor";

export const EDITOR_COMPONENTS = {
  header: `${EDITOR}/server#HeaderField`,
  actions: `${EDITOR}/server#ActionsField`,
  tabMarks: `${EDITOR}/server#TabMarksField`,
  sections: `${EDITOR}/server#SectionsPanelField`,
  forwardNote: `${EDITOR}/server#ForwardNoteField`,
  slugNote: `${EDITOR}/server#SlugNote`,
  seoTitle: `${EDITOR}/server#SeoTitleField`,
  seoDescription: `${EDITOR}/server#SeoDescriptionField`,
  seoImage: `${EDITOR}/server#SeoImageField`,
  seoPreview: `${EDITOR}/server#SeoPreviewField`,
  sidebar: `${EDITOR}/server#SidebarField`,
  visitors: `${EDITOR}/PageSettings#VisitorsField`,
  noControl: `${EDITOR}/EditorChrome#NoControl`,
} as const;

export const EDITOR_TAB_CLASS = "dil-editor-tabs";

function ui(name: string, Field: string, position?: "sidebar"): UIField {
  return {
    name,
    type: "ui",
    admin: { ...(position ? { position } : {}), components: { Field } },
  };
}

export const forwardsField: CheckboxField = {
  name: "forwards",
  label: "Visitors",
  type: "checkbox",
  virtual: true,
  hooks: {
    afterRead: [
      ({ data }) => hasRedirect(data as Parameters<typeof hasRedirect>[0]),
    ],
  },
  validate: (value, { data }) =>
    value && !hasRedirect(data as Parameters<typeof hasRedirect>[0])
      ? "Pick the page visitors are forwarded to."
      : true,
  admin: { components: { Field: EDITOR_COMPONENTS.visitors } },
};

export function forwarding(data: unknown): boolean {
  const doc = data as { forwards?: boolean | null } | undefined;
  return Boolean(doc?.forwards) || hasRedirect(doc as never);
}

export function seoGroup(): GroupField {
  const [title, description, image] = localizedSeoFields({
    defaultFields: [
      { name: "title", type: "text" },
      { name: "description", type: "textarea" },
      {
        name: "image",
        type: "upload",
        relationTo: "media",
      },
    ],
  });
  return {
    name: "meta",
    label: false,
    type: "group",
    admin: { hideGutter: true, className: "dil-seo" },
    fields: [
      {
        ...title,
        label: "Search title",
        admin: { components: { Field: EDITOR_COMPONENTS.seoTitle } },
      } as Field,
      {
        ...description,
        label: "Description",
        admin: { components: { Field: EDITOR_COMPONENTS.seoDescription } },
      } as Field,
      {
        ...image,
        label: "Share image",
        admin: { components: { Field: EDITOR_COMPONENTS.seoImage } },
      } as Field,
      ui("seoPreview", EDITOR_COMPONENTS.seoPreview),
    ],
  };
}

export function editorFields(parent: RelationshipField): Field[] {
  const tabs: TabsField = {
    type: "tabs",
    admin: { className: EDITOR_TAB_CLASS },
    tabs: [
      {
        label: "Sections",
        fields: [
          ui("sectionsPanel", EDITOR_COMPONENTS.sections),
          {
            ...pageLayout(),
            admin: {
              ...pageLayout().admin,
              condition: (data) => !forwarding(data),
            },
          },
        ],
      },
      {
        label: "Page settings",
        fields: [
          {
            type: "row",
            fields: [
              {
                name: "title",
                label: "Title",
                type: "text",
                localized: true,
                required: true,
                admin: { width: "50%" },
              },
              {
                ...parent,
                admin: { ...parent.admin, position: undefined, width: "50%" },
              } as Field,
            ],
          },
          {
            type: "row",
            fields: [
              {
                ...slugField(true),
                admin: {
                  ...slugField(true).admin,
                  position: undefined,
                  width: "50%",
                  components: { afterInput: [EDITOR_COMPONENTS.slugNote] },
                },
              },
              {
                ...forwardsField,
                admin: { ...forwardsField.admin, width: "50%" },
              },
            ],
          },
          ui("forwardNote", EDITOR_COMPONENTS.forwardNote),
          {
            ...link({
              name: "redirectTo",
              label: "Forward to",
              required: false,
              withLabel: false,
            }),
            admin: { condition: (data: unknown) => forwarding(data) },
          } as Field,
        ],
      },
      { label: "SEO", fields: [seoGroup()] },
    ],
  };
  return [
    ui("editorHeader", EDITOR_COMPONENTS.header),
    ui("editorActions", EDITOR_COMPONENTS.actions),
    ui("editorTabMarks", EDITOR_COMPONENTS.tabMarks),
    tabs,
    createBreadcrumbsField("pages", {
      admin: { hidden: true, readOnly: true },
    }) as Field,
    { ...pathField, admin: { ...pathField.admin, hidden: true } },
    {
      ...slugFallbackField,
      admin: { ...slugFallbackField.admin, hidden: true },
    },
    ui("editorSidebar", EDITOR_COMPONENTS.sidebar, "sidebar"),
  ];
}

export function withEditorShell(
  collection: CollectionConfig,
): CollectionConfig {
  const hide = (field: Field): Field =>
    "name" in field &&
    (field.name === "updatedBy" || field.name === "trashedBy")
      ? ({ ...field, admin: { ...field.admin, hidden: true } } as Field)
      : field;
  const components = collection.admin?.components;
  return {
    ...collection,
    fields: collection.fields.map(hide),
    admin: {
      ...collection.admin,
      components: {
        ...components,
        edit: {
          ...components?.edit,
          PublishButton: EDITOR_COMPONENTS.noControl,
          SaveDraftButton: EDITOR_COMPONENTS.noControl,
          UnpublishButton: EDITOR_COMPONENTS.noControl,
        },
      },
    },
  };
}
