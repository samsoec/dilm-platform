import type { Condition, SelectField } from "payload";
import { BUTTON_STYLES } from "@dilm/shared-types";

import { BUTTON_STYLE_LABELS } from "../blocks/factories";

export function buttonStyleField({
  name = "style",
  condition,
}: { name?: string; condition?: Condition } = {}): SelectField {
  return {
    name,
    label: "Button style",
    type: "select",
    required: true,
    defaultValue: "primary",
    options: BUTTON_STYLES.map((value) => ({
      value,
      label: BUTTON_STYLE_LABELS[value],
    })),
    ...(condition ? { admin: { condition } } : {}),
  };
}
