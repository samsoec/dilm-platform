import { describe, expect, it } from "vitest";

import {
  entityIdOf,
  normalizeHost,
  resolveBlockEntity,
  resolveContactEntityIds,
  resolveCurrentEntity,
  resolveGroupTile,
  type EntityRecord,
} from "./entities";

const indoacid: EntityRecord = {
  id: 1,
  name: "Indonesian Acids",
  domain: "indonesianacidsindustry.com",
  brand: { legalName: "PT Indonesian Acids Industry", logoOnDark: { id: 11 } },
  profile: {
    coverImage: { id: 21 },
  },
};

describe("resolveGroupTile (§4.5.23)", () => {
  it("reads the cover image, light logo and legal name, and links to the company's Home", () => {
    expect(resolveGroupTile(indoacid)).toEqual({
      id: "1",
      name: "PT Indonesian Acids Industry",
      coverImage: { id: 21 },
      logo: { id: 11 },
      href: "https://indonesianacidsindustry.com/",
    });
  });

  it("falls back to the name and leaves the images and link empty when unknown", () => {
    expect(resolveGroupTile({ id: 9, name: "New Co" })).toEqual({
      id: "9",
      name: "New Co",
      coverImage: null,
      logo: null,
      href: null,
    });
  });
});

describe("current company on a shared page (FR-PM-04, FR-PM-36)", () => {
  const domains = {
    "1": "indonesianacidsindustry.com",
    "2": "duniakimiautama.com",
    "3": "likutelaga.com",
  };

  it("resolves the company of whichever domain is being viewed", () => {
    expect(resolveCurrentEntity("indonesianacidsindustry.com", domains)).toBe(
      "1",
    );
    expect(resolveCurrentEntity("duniakimiautama.com", domains)).toBe("2");
    expect(resolveCurrentEntity("likutelaga.com", domains)).toBe("3");
  });

  it("gives one shared page's blocks a different company on each domain", () => {
    const block = { entity: null };
    const seen = Object.values(domains).map((host) =>
      resolveBlockEntity(block.entity, resolveCurrentEntity(host, domains)),
    );
    expect(seen).toEqual(["1", "2", "3"]);
  });

  it("ignores case, port, protocol, path, a trailing dot and www", () => {
    for (const host of [
      "DuniaKimiaUtama.com",
      "duniakimiautama.com:3000",
      "https://duniakimiautama.com/en/contact",
      "duniakimiautama.com.",
      "www.duniakimiautama.com",
    ]) {
      expect(resolveCurrentEntity(host, domains), host).toBe("2");
    }
    expect(normalizeHost(" HTTP://A.B:8080/x?y#z ")).toBe("a.b");
  });

  it("matches a company whose stored domain carries www", () => {
    expect(resolveCurrentEntity("x.com", { "7": "www.x.com" })).toBe("7");
  });

  it("finds no company for an unknown or empty host, rather than guessing", () => {
    expect(resolveCurrentEntity("example.org", domains)).toBeNull();
    expect(resolveCurrentEntity("", domains)).toBeNull();
    expect(resolveCurrentEntity(null, domains)).toBeNull();
    expect(resolveCurrentEntity("duniakimiautama.com", {})).toBeNull();
  });

  it("lets a picked company override the current one in the location map", () => {
    expect(resolveBlockEntity(3, "2")).toBe("3");
    expect(resolveBlockEntity({ id: 3 }, 2)).toBe("3");
    expect(resolveBlockEntity(null, 2)).toBe("2");
    expect(resolveBlockEntity(undefined, null)).toBeNull();
  });

  it("lists every other company for source others, in order, on each domain", () => {
    const allIds = [1, 2, 3];
    const others = (host: string) =>
      resolveContactEntityIds({
        source: "others",
        allIds,
        currentEntityId: resolveCurrentEntity(host, domains),
      });
    expect(others("indonesianacidsindustry.com")).toEqual(["2", "3"]);
    expect(others("duniakimiautama.com")).toEqual(["1", "3"]);
    expect(others("likutelaga.com")).toEqual(["1", "2"]);
    expect(others("unknown.test")).toEqual(["1", "2", "3"]);
  });

  it("lists the picked companies, deduplicated, for source manual", () => {
    expect(
      resolveContactEntityIds({
        source: "manual",
        picked: [3, { id: 1 }, 3, null],
        allIds: [1, 2, 3],
        currentEntityId: 1,
      }),
    ).toEqual(["3", "1"]);
  });
});

describe("entityIdOf", () => {
  it("reads ids, populated documents and empties", () => {
    expect(entityIdOf(4)).toBe("4");
    expect(entityIdOf("4")).toBe("4");
    expect(entityIdOf({ id: 4 })).toBe("4");
    expect(entityIdOf(null)).toBeNull();
    expect(entityIdOf("")).toBeNull();
  });
});
