// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { applyA11yPatches } from "./a11yPatches";

function mount(html: string) {
  document.body.innerHTML = html;
  applyA11yPatches(document);
}

describe("applyA11yPatches", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("names the unnamed Payload controls", () => {
    mount(`
      <div class="collapsible__drag" role="button"></div>
      <div class="doc-controls__popup"><button class="popup-button"></button></div>
      <button class="clickable-arrow clickable-arrow--left"></button>
      <button class="clickable-arrow clickable-arrow--right"></button>
      <button class="date-time-picker__clear-button"></button>
      <button class="popup-button array-actions__button"></button>
      <ul class="array-field__header-actions"><li><button class="popup-button"></button></li></ul>
    `);
    expect(
      document
        .querySelector(".array-actions__button")
        ?.getAttribute("aria-label"),
    ).toBe("Row actions");
    expect(
      document
        .querySelector(".array-field__header-actions .popup-button")
        ?.getAttribute("aria-label"),
    ).toBe("More actions for this list");
    expect(
      document.querySelector(".collapsible__drag")?.getAttribute("aria-label"),
    ).toBe("Drag to reorder row");
    expect(
      document.querySelector(".popup-button")?.getAttribute("aria-label"),
    ).toBe("Document actions");
    expect(
      document
        .querySelector(".clickable-arrow--left")
        ?.getAttribute("aria-label"),
    ).toBe("Previous");
    expect(
      document
        .querySelector(".clickable-arrow--right")
        ?.getAttribute("aria-label"),
    ).toBe("Next");
    expect(
      document
        .querySelector(".date-time-picker__clear-button")
        ?.getAttribute("aria-label"),
    ).toBe("Clear date");
  });

  it("names the rich text toolbar buttons from their key", () => {
    mount(
      '<button class="toolbar-popup__button" data-button-key="strike-through"></button>',
    );
    expect(
      document
        .querySelector(".toolbar-popup__button")
        ?.getAttribute("aria-label"),
    ).toBe("Strike through");
  });

  it("keeps a name that is already there", () => {
    mount(
      '<button class="clickable-arrow--left" aria-label="Earlier"></button>',
    );
    expect(
      document
        .querySelector(".clickable-arrow--left")
        ?.getAttribute("aria-label"),
    ).toBe("Earlier");
  });

  it("removes decorative indicators from the tab order", () => {
    mount(
      '<button class="dropdown-indicator" aria-hidden="true"></button><div class="clear-indicator" aria-hidden="true" role="button" tabindex="0"></div>',
    );
    document
      .querySelectorAll("[aria-hidden]")
      .forEach((element) =>
        expect(element.getAttribute("tabindex")).toBe("-1"),
      );
  });

  it("labels list checkboxes with the row they select", () => {
    mount(`
      <table><tbody>
        <tr><th><input id="select-all" aria-label="" aria-labelledby="select-all" type="checkbox"></th></tr>
        <tr><td class="cell-_select"><input aria-label="" type="checkbox"></td><td>Budi Santoso</td></tr>
      </tbody></table>
    `);
    const [all, row] = [...document.querySelectorAll("input")];
    expect(all.getAttribute("aria-label")).toBe("Select all rows");
    expect(all.hasAttribute("aria-labelledby")).toBe(false);
    expect(row.getAttribute("aria-label")).toBe("Select Budi Santoso");
  });

  it("names unlabelled field inputs from their field label", () => {
    mount(`
      <div class="field-type"><label class="field-label">Published date <span>*</span></label>
        <div class="date-time-picker__input-wrapper"><input type="text"></div></div>
    `);
    expect(document.querySelector("input")?.getAttribute("aria-label")).toBe(
      "Published date",
    );
  });

  it("does not rename an input that has a label", () => {
    mount(`
      <div class="field-type"><label class="field-label">Date</label>
        <label for="x">Own label</label><input id="x" class="rs__input"></div>
    `);
    expect(document.querySelector("input")?.hasAttribute("aria-label")).toBe(
      false,
    );
  });

  it("stops the tab strip being an invalid list", () => {
    mount('<ul class="doc-tabs__tabs"><a href="/x">Edit</a></ul>');
    expect(
      document.querySelector(".doc-tabs__tabs")?.getAttribute("role"),
    ).toBe("group");
  });
});
