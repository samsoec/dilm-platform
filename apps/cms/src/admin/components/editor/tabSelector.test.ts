import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { editorFields } from "../../../fields/pageEditor";
import { parentField } from "../../../fields/pageFields";
import {
  EDITOR_TAB_CLASS,
  TAB_BUTTON_CLASS,
  TAB_BUTTON_SELECTOR,
} from "./editor";

const uiRoot = fileURLToPath(
  new URL("../../../../node_modules/@payloadcms/ui", import.meta.url),
);

function payloadSource(file: string): string {
  return readFileSync(path.join(uiRoot, "dist/fields/Tabs", file), "utf8");
}

describe("tab button selector used by TabMarks", () => {
  it("matches the class Payload puts on its tab buttons", () => {
    expect(payloadSource("Tab/index.js")).toContain(
      `const baseClass = '${TAB_BUTTON_CLASS}'`,
    );
  });

  it("matches the wrapper class Payload gives the tabs field", () => {
    const source = payloadSource("index.js");
    expect(source).toContain("const baseClass = 'tabs-field'");
    expect(source).toMatch(/\[fieldBaseClass, className, baseClass/);
  });

  it("is the class the Pages tabs field is configured with", () => {
    const tabs = editorFields(parentField("pages", true)).find(
      (field) => field.type === "tabs",
    );
    expect(tabs && "admin" in tabs && tabs.admin?.className).toBe(
      EDITOR_TAB_CLASS,
    );
    expect(TAB_BUTTON_SELECTOR).toBe(
      ".dil-editor-tabs .tabs-field__tab-button",
    );
  });
});
