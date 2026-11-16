import type { Field, UIField } from "payload";

const TEMPLATES = "/admin/components/templates";

function ui(name: string, Field: string, position?: "sidebar"): UIField {
  return {
    name,
    type: "ui",
    admin: { ...(position ? { position } : {}), components: { Field } },
  };
}

export function templateEditorFields(fields: Field[]): Field[] {
  return [
    ui("templateHeader", `${TEMPLATES}/server#TemplateHeaderField`),
    ui("templateActions", `${TEMPLATES}/server#TemplateActionsField`),
    ...fields,
    ui(
      "templateSidebar",
      `${TEMPLATES}/server#TemplateSidebarField`,
      "sidebar",
    ),
  ];
}

export const TEMPLATE_LIST_VIEW = `${TEMPLATES}/TemplatesView#TemplatesView`;
