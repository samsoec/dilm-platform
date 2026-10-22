function setIfMissing(element: Element, attribute: string, value: string) {
  if (!element.getAttribute(attribute)?.trim()) {
    element.setAttribute(attribute, value);
  }
}

function fieldLabel(element: Element): string | undefined {
  const label = element
    .closest(".field-type")
    ?.querySelector("label.field-label")
    ?.textContent?.replace(/\*/g, "")
    .trim();
  return label || undefined;
}

function rowName(element: Element): string {
  const cell = element
    .closest("tr")
    ?.querySelector("td:not(.cell-_select)")
    ?.textContent?.replace(/\s+/g, " ")
    .trim();
  return cell ? cell.slice(0, 60) : "row";
}

function hasName(element: Element): boolean {
  if (element.getAttribute("aria-label")?.trim()) return true;
  if (element.getAttribute("aria-labelledby")) return true;
  return element.id
    ? Boolean(element.ownerDocument.querySelector(`label[for="${element.id}"]`))
    : false;
}

export function applyA11yPatches(root: ParentNode): void {
  root
    .querySelectorAll('.collapsible__drag[role="button"]')
    .forEach((element) =>
      setIfMissing(element, "aria-label", "Drag to reorder row"),
    );
  root
    .querySelectorAll(
      '.dropdown-indicator[aria-hidden="true"], .clear-indicator[aria-hidden="true"]',
    )
    .forEach((element) => element.setAttribute("tabindex", "-1"));
  root
    .querySelectorAll(".doc-controls__popup .popup-button")
    .forEach((element) =>
      setIfMissing(element, "aria-label", "Document actions"),
    );
  root
    .querySelectorAll(".array-actions__button")
    .forEach((element) => setIfMissing(element, "aria-label", "Row actions"));
  root
    .querySelectorAll(".array-field__header-actions .popup-button")
    .forEach((element) =>
      setIfMissing(element, "aria-label", "More actions for this list"),
    );
  root
    .querySelectorAll(".toolbar-popup__button[data-button-key]")
    .forEach((element) => {
      const key = element.getAttribute("data-button-key") ?? "";
      const name = key.replace(/[-_]+/g, " ").trim();
      if (name) {
        setIfMissing(
          element,
          "aria-label",
          name.charAt(0).toUpperCase() + name.slice(1),
        );
      }
    });
  root
    .querySelectorAll(".clickable-arrow--left")
    .forEach((element) => setIfMissing(element, "aria-label", "Previous"));
  root
    .querySelectorAll(".clickable-arrow--right")
    .forEach((element) => setIfMissing(element, "aria-label", "Next"));
  root
    .querySelectorAll(".date-time-picker__clear-button")
    .forEach((element) => setIfMissing(element, "aria-label", "Clear date"));
  root.querySelectorAll(".doc-tabs__tabs").forEach((element) => {
    if (!element.getAttribute("role")) element.setAttribute("role", "group");
  });
  root.querySelectorAll('table input[type="checkbox"]').forEach((element) => {
    if (element.id === "select-all") {
      element.removeAttribute("aria-labelledby");
      element.setAttribute("aria-label", "Select all rows");
      element.removeAttribute("title");
      return;
    }
    if (!element.getAttribute("aria-label")?.trim()) {
      element.setAttribute("aria-label", `Select ${rowName(element)}`);
    }
  });
  root
    .querySelectorAll(
      ".rs__input, .date-time-picker__input-wrapper input, .ContentEditable__root",
    )
    .forEach((element) => {
      if (hasName(element)) return;
      const label = fieldLabel(element);
      if (label) element.setAttribute("aria-label", label);
    });
}
