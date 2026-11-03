import { describe, expect, it } from "vitest";

import {
  entityIdOf,
  entityPlaceholders,
  normalizeHost,
  resolveBlockEntity,
  resolveContactEntityIds,
  resolveCurrentEntity,
  resolveEntityFallbacks,
  resolveGroupTile,
  type EntityRecord,
} from "./entities";

const indoacid: EntityRecord = {
  id: 1,
  name: "Indonesian Acids",
  domain: "indonesianacids.com",
  brand: { legalName: "PT Indonesian Acids Industry", logoOnDark: { id: 11 } },
  profile: {
    hubLabel: "Chemical hub in Sumatra",
    shortDescription: "Acids for industry.",
    coverImage: { id: 21 },
    regions: [{ name: "All Sumatra" }, { name: "Banten" }],
    mapPin: { x: 12, y: 0 },
  },
};

const bare: EntityRecord = {
  id: 2,
  name: "Liku Telaga",
  domain: "likutelaga.com",
};

describe("resolveEntityFallbacks (§4.5.22, US-BLD-7)", () => {
  it("fills every empty field of a card from the company's profile", () => {
    const { values, source } = resolveEntityFallbacks({ entity: 1 }, indoacid);
    expect(values).toEqual({
      image: { id: 21 },
      label: "Chemical hub in Sumatra",
      title: "Indonesian Acids",
      description: "Acids for industry.",
      regions: ["All Sumatra", "Banten"],
      pinX: 12,
      pinY: 0,
    });
    expect(Object.values(source)).toEqual(Array(7).fill("company"));
  });

  it("keeps what the editor typed and falls back only for the rest", () => {
    const { values, source } = resolveEntityFallbacks(
      {
        entity: 1,
        label: "Our hub",
        title: "  ",
        regions: [{ name: "Java" }],
        pin: { x: 50 },
        image: 5,
      },
      indoacid,
    );
    expect(values).toMatchObject({
      label: "Our hub",
      title: "Indonesian Acids",
      description: "Acids for industry.",
      regions: ["Java"],
      pinX: 50,
      pinY: 0,
      image: 5,
    });
    expect(source).toEqual({
      image: "item",
      label: "item",
      title: "company",
      description: "company",
      regions: "item",
      pinX: "item",
      pinY: "company",
    });
  });

  it("treats a pin at 0 as a real position, never as empty", () => {
    const { values, source } = resolveEntityFallbacks(
      { pin: { x: 0, y: 0 } },
      indoacid,
    );
    expect([values.pinX, values.pinY]).toEqual([0, 0]);
    expect([source.pinX, source.pinY]).toEqual(["item", "item"]);
  });

  it("leaves a free card as typed, with nothing to fall back to", () => {
    const { values, source, placeholders } = resolveEntityFallbacks(
      { title: "Others", regions: [] },
      null,
    );
    expect(values.title).toBe("Others");
    expect(values.label).toBeNull();
    expect(values.regions).toEqual([]);
    expect(source.title).toBe("item");
    expect(source.image).toBe("none");
    expect(placeholders).toEqual(entityPlaceholders(null));
  });

  it("reports none where the company's profile is empty too", () => {
    const { values, source } = resolveEntityFallbacks({ entity: 2 }, bare);
    expect(values.title).toBe("Liku Telaga");
    expect(source).toMatchObject({
      title: "company",
      label: "none",
      image: "none",
      regions: "none",
      pinX: "none",
    });
  });

  it("gives the admin the company's values as placeholders, whatever the card holds", () => {
    const { placeholders } = resolveEntityFallbacks(
      { entity: 1, label: "Own" },
      indoacid,
    );
    expect(placeholders).toEqual(entityPlaceholders(indoacid));
    expect(placeholders.label).toBe("Chemical hub in Sumatra");
  });

  it("is pure: the same input gives the same output and nothing is modified", () => {
    const item = { entity: 1, label: "Own", regions: [{ name: "Java" }] };
    const before = structuredClone({ item, indoacid });
    const first = resolveEntityFallbacks(item, indoacid);
    expect(resolveEntityFallbacks(item, indoacid)).toEqual(first);
    expect({ item, indoacid }).toEqual(before);
  });

  it("falls back to the legal name when the company has no short name", () => {
    expect(
      resolveEntityFallbacks({}, { id: 3, brand: { legalName: "PT Tiga" } })
        .values.title,
    ).toBe("PT Tiga");
  });
});

describe("resolveGroupTile (§4.5.23)", () => {
  it("reads the cover image, light logo and legal name, and links to the company's Home", () => {
    expect(resolveGroupTile(indoacid)).toEqual({
      id: "1",
      name: "PT Indonesian Acids Industry",
      coverImage: { id: 21 },
      logo: { id: 11 },
      href: "https://indonesianacids.com/",
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
    "1": "indonesianacids.com",
    "2": "duniakimia.com",
    "3": "likutelaga.com",
  };

  it("resolves the company of whichever domain is being viewed", () => {
    expect(resolveCurrentEntity("indonesianacids.com", domains)).toBe("1");
    expect(resolveCurrentEntity("duniakimia.com", domains)).toBe("2");
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
      "DuniaKimia.com",
      "duniakimia.com:3000",
      "https://duniakimia.com/en/contact",
      "duniakimia.com.",
      "www.duniakimia.com",
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
    expect(resolveCurrentEntity("duniakimia.com", {})).toBeNull();
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
    expect(others("indonesianacids.com")).toEqual(["2", "3"]);
    expect(others("duniakimia.com")).toEqual(["1", "3"]);
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
