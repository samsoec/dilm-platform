import { describe, expect, it, vi } from "vitest";

import {
  altArrowMove,
  clampMove,
  menuActions,
  pickupKey,
  runMenuAction,
  type PickupState,
  itemCount,
  pickedUpText,
  positionText,
  removeCopy,
  sectionCountText,
  sectionSummary,
  variantText,
} from "./sectionRows";

describe("section rows", () => {
  it("numbers positions from 01", () => {
    expect(positionText(0)).toBe("01");
    expect(positionText(11)).toBe("12");
  });

  it("counts sections against the limit", () => {
    expect(sectionCountText(7, 30)).toBe("7 of 30 sections");
  });

  it("summarises by heading, then by item count, then by record", () => {
    expect(
      sectionSummary(
        { heading: { eyebrow: "Since 1990", title: "Our story" } },
        false,
      ),
    ).toBe("Since 1990 · Our story");
    expect(sectionSummary({ banner: { title: "Milestones" } }, false)).toBe(
      "Milestones",
    );
    expect(sectionSummary({ products: [{}, {}, {}] }, true)).toBe("3 products");
    expect(sectionSummary({ cards: [{}] }, false)).toBe("1 card");
    expect(sectionSummary({}, true)).toBe("Filled from the record");
    expect(sectionSummary({}, false)).toBe("");
  });

  it("humanises the variant", () => {
    expect(variantText("logos")).toBe("Logos");
    expect(variantText("imageCard")).toBe("Image card");
    expect(variantText(undefined)).toBe("");
  });

  it("names the item count and both languages when removing", () => {
    expect(itemCount({ entries: [{}, {}], cards: [{}] })).toBe(3);
    const copy = removeCopy("Timeline", { entries: new Array(8).fill({}) });
    expect(copy.body).toBe(
      "Its 8 items and their text in English and Indonesian go with it. You can get it back from Versions until you publish.",
    );
  });

  it("stops moves at the ends", () => {
    expect(clampMove(0, -1, 7)).toBe(0);
    expect(clampMove(6, 1, 7)).toBe(6);
    expect(clampMove(3, 1, 7)).toBe(4);
  });

  it("announces a pick-up as the design says", () => {
    expect(pickedUpText("Timeline", 3, 7)).toBe(
      "Timeline, picked up. Position 4 of 7. Arrow keys to move, Space to drop, Escape to cancel.",
    );
  });

  it("does not count buttons as items", () => {
    expect(itemCount({ buttons: [{}, {}], entries: [{}] })).toBe(1);
  });

  describe("keyboard pick-up", () => {
    const idle: PickupState = { pickedUp: false, origin: 0 };

    it("picks up on Space and announces", () => {
      const r = pickupKey(idle, " ", 3, 7, "Timeline");
      expect(r.state).toEqual({ pickedUp: true, origin: 3 });
      expect(r.announce).toContain("Position 4 of 7");
    });

    it("ignores other keys while idle", () => {
      expect(pickupKey(idle, "ArrowDown", 3, 7, "Timeline").handled).toBe(
        false,
      );
    });

    it("moves with arrows and stops at the ends", () => {
      const held: PickupState = { pickedUp: true, origin: 3 };
      expect(pickupKey(held, "ArrowDown", 3, 7, "T").moveTo).toBe(4);
      expect(pickupKey(held, "ArrowUp", 0, 7, "T").moveTo).toBeUndefined();
    });

    it("drops on Space", () => {
      const r = pickupKey({ pickedUp: true, origin: 3 }, " ", 5, 7, "T");
      expect(r.state.pickedUp).toBe(false);
      expect(r.moveTo).toBeUndefined();
      expect(r.announce).toBe("T, dropped at position 6 of 7.");
    });

    it("returns to the origin on Escape", () => {
      const r = pickupKey({ pickedUp: true, origin: 3 }, "Escape", 5, 7, "T");
      expect(r.state.pickedUp).toBe(false);
      expect(r.moveTo).toBe(3);
    });
  });

  describe("Alt+Arrow", () => {
    it("moves the row the focus is in", () => {
      expect(
        altArrowMove(
          { altKey: true, key: "ArrowDown" },
          "layout-row-2",
          "layout",
          5,
        ),
      ).toEqual({ from: 2, to: 3 });
    });

    it("ignores plain arrows, other fields and the ends", () => {
      expect(
        altArrowMove(
          { altKey: false, key: "ArrowUp" },
          "layout-row-2",
          "layout",
          5,
        ),
      ).toBeNull();
      expect(
        altArrowMove(
          { altKey: true, key: "ArrowUp" },
          "other-row-2",
          "layout",
          5,
        ),
      ).toBeNull();
      expect(
        altArrowMove(
          { altKey: true, key: "ArrowUp" },
          "layout-row-0",
          "layout",
          5,
        ),
      ).toBeNull();
    });
  });

  describe("row menu", () => {
    const handlers = () => ({
      move: vi.fn(),
      openCatalog: vi.fn(),
      duplicate: vi.fn(),
      confirmRemove: vi.fn(),
    });

    it("lists the six actions and disables moves at the ends", () => {
      const actions = menuActions(0, 3);
      expect(actions.map((a) => a.label)).toEqual([
        "Move up",
        "Move down",
        "Insert above",
        "Insert below",
        "Duplicate",
        "Remove…",
      ]);
      expect(actions[0].disabled).toBe(true);
      expect(menuActions(2, 3)[1].disabled).toBe(true);
    });

    it("dispatches each action", () => {
      const h = handlers();
      runMenuAction("down", 1, 4, h);
      runMenuAction("insertAbove", 1, 4, h);
      runMenuAction("insertBelow", 1, 4, h);
      runMenuAction("duplicate", 1, 4, h);
      runMenuAction("remove", 1, 4, h);
      expect(h.move).toHaveBeenCalledWith(2);
      expect(h.openCatalog.mock.calls).toEqual([[1], [2]]);
      expect(h.duplicate).toHaveBeenCalledOnce();
      expect(h.confirmRemove).toHaveBeenCalledOnce();
    });
  });
});
