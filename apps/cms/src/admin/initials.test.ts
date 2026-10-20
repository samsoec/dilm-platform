import { describe, expect, it } from "vitest";

import { initials } from "./initials";

describe("initials", () => {
  it.each([
    [{ name: "Rani Saputra", email: "rani@duniakimia.com" }, "RS"],
    [{ name: "  Hendra  Gunawan Putra ", email: null }, "HP"],
    [{ name: "Madonna" }, "MA"],
    [{ email: "dimas.p@duniakimia.com" }, "DP"],
    [{ email: "admin@likutelaga.com" }, "AD"],
    [{ name: "", email: "m_k@indonesianacids.com" }, "MK"],
    [{ name: "QA Super (Claude)" }, "QC"],
    [{ name: "(Sari)" }, "SA"],
    [{ name: "Siti 'Ani' Rahma" }, "SR"],
    [{ name: "Ñoño Égal" }, "ÑÉ"],
    [{ name: "()", email: "budi@x.co" }, "BU"],
    [{}, "?"],
  ])("%o → %s", (person, expected) => {
    expect(initials(person)).toBe(expected);
  });
});
