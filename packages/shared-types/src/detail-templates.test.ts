import { describe, expect, it } from "vitest";

import {
  HERO_ATTRIBUTES,
  HERO_ATTRIBUTE_KEYS,
  TEMPLATE_BLOCK_RECORD_TYPES,
  TOKENS_OUTSIDE_TEMPLATES,
  availabilityNote,
  isBlockInContext,
  renderTokens,
  tokenProblem,
  tokensIn,
  templateBlockRecordTypes,
  unknownTokenMessage,
  wrongContextMessage,
} from "./detail-templates";

describe("renderTokens (FR-PM-28)", () => {
  it("puts the record's title in place of {title}", () => {
    expect(
      renderTokens("Available {title} Products", { title: "Soda Ash" }, "en"),
    ).toBe("Available Soda Ash Products");
  });

  it("replaces every occurrence", () => {
    expect(renderTokens("{title} and {title}", { title: "Acid" }, "en")).toBe(
      "Acid and Acid",
    );
  });

  it("reads the title in the current locale and falls back to English", () => {
    const record = { title: { en: "Sulfuric Acid", id: "Asam Sulfat" } };
    expect(renderTokens("{title}", record, "id")).toBe("Asam Sulfat");
    expect(
      renderTokens("{title}", { title: { en: "Acid", id: "" } }, "id"),
    ).toBe("Acid");
  });

  it("uses name when the record has no title", () => {
    expect(renderTokens("{title}", { name: "Caustic Soda" }, "en")).toBe(
      "Caustic Soda",
    );
  });

  it("leaves unknown tokens alone and renders an empty title as nothing", () => {
    expect(renderTokens("{name} {title}", {}, "en")).toBe("{name} ");
    expect(renderTokens("{title}", null, "en")).toBe("");
  });

  it("does not treat dollar signs in a title as replacement patterns", () => {
    expect(renderTokens("{title}", { title: "$& $1" }, "en")).toBe("$& $1");
  });

  it("returns text without tokens unchanged", () => {
    expect(renderTokens("Plain {} text { title }", { title: "X" }, "en")).toBe(
      "Plain {} text { title }",
    );
  });
});

describe("tokensIn", () => {
  it("lists the names between braces", () => {
    expect(tokensIn("a {title} b {name} {2026} {}")).toEqual(["title", "name"]);
  });
});

describe("tokenProblem (TP-02)", () => {
  const section = (text: string) => [
    { id: "a1", blockType: "sectionHeading", blockName: "{x}", title: text },
  ];

  it("allows {title} in a template", () => {
    expect(tokenProblem(section("Where {title} fits"), true)).toBeUndefined();
  });

  it("names an unknown token in a template", () => {
    expect(tokenProblem(section("Hello {name}"), true)).toBe(
      "{name} isn't a placeholder. Use {title}.",
    );
    expect(unknownTokenMessage("name")).toBe(
      "{name} isn't a placeholder. Use {title}.",
    );
  });

  it("names the first unknown token even after a valid one", () => {
    expect(tokenProblem(section("{title} {company}"), true)).toBe(
      "{company} isn't a placeholder. Use {title}.",
    );
  });

  it("rejects any token outside a template, even {title}", () => {
    expect(tokenProblem(section("About {title}"), false)).toBe(
      TOKENS_OUTSIDE_TEMPLATES,
    );
    expect(TOKENS_OUTSIDE_TEMPLATES).toBe(
      "Placeholders only work in detail templates.",
    );
  });

  it("finds tokens deep inside rich text and nested groups", () => {
    const layout = [
      {
        blockType: "x",
        body: {
          root: {
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", text: "{oops}" }],
              },
            ],
          },
        },
      },
    ];
    expect(tokenProblem(layout, true)).toBe(unknownTokenMessage("oops"));
    expect(tokenProblem(layout, false)).toBe(TOKENS_OUTSIDE_TEMPLATES);
  });

  it("ignores ids and block names, and text with no token", () => {
    expect(
      tokenProblem(
        [
          {
            id: "{title}",
            blockType: "{title}",
            blockName: "{title}",
            t: "ok",
          },
        ],
        false,
      ),
    ).toBeUndefined();
    expect(tokenProblem(undefined, false)).toBeUndefined();
    expect(tokenProblem([], true)).toBeUndefined();
  });
});

describe("isBlockInContext (FR-PM-29)", () => {
  it("renders a block for any context when it is not a template block", () => {
    expect(isBlockInContext("richText", undefined)).toBe(true);
    expect(isBlockInContext("richText", { recordType: "job" })).toBe(true);
  });

  it("renders a template block only with its matching record", () => {
    expect(isBlockInContext("jobDetail", { recordType: "job" })).toBe(true);
    expect(isBlockInContext("jobDetail", { recordType: "post" })).toBe(false);
    expect(isBlockInContext("productOverview", { recordType: "product" })).toBe(
      true,
    );
    expect(
      isBlockInContext("productOverview", { recordType: "solution" }),
    ).toBe(false);
  });

  it("renders nothing for a template block on a page, without a record", () => {
    expect(isBlockInContext("jobDetail", undefined)).toBe(false);
    expect(isBlockInContext("jobDetail", null)).toBe(false);
    expect(isBlockInContext("jobDetail", {})).toBe(false);
    expect(isBlockInContext("jobDetail", { recordType: null })).toBe(false);
  });

  it("lets recordHero serve products, solutions, jobs and posts, not categories", () => {
    for (const recordType of ["product", "solution", "job", "post"] as const) {
      expect(isBlockInContext("recordHero", { recordType })).toBe(true);
    }
    expect(isBlockInContext("recordHero", { recordType: "category" })).toBe(
      false,
    );
  });

  it("does not mistake inherited object keys for template blocks", () => {
    expect(isBlockInContext("constructor", undefined)).toBe(true);
    expect(isBlockInContext("toString", undefined)).toBe(true);
  });

  it("registers exactly the Template group blocks of the catalog", () => {
    expect(Object.keys(TEMPLATE_BLOCK_RECORD_TYPES).sort()).toEqual([
      "jobDetail",
      "postArticle",
      "productApplications",
      "productOverview",
      "productSpecifications",
      "recordHero",
      "solutionApplications",
      "solutionImpact",
    ]);
  });
});

describe("template block wording (SC-03, SE-13)", () => {
  it("names where a block works, in the catalog's words", () => {
    expect(availabilityNote(["product"])).toBe(
      "Works on detail templates only · Product",
    );
    expect(availabilityNote(["product", "solution", "job", "post"])).toBe(
      "Works on detail templates only · Product, Solution, Job, Post",
    );
  });

  it("warns in the admin's words, for one record type or several", () => {
    expect(wrongContextMessage(["job"])).toBe(
      "This section only shows on job pages. It won't appear here.",
    );
    expect(wrongContextMessage(["product", "solution"])).toBe(
      "This section only shows on product and solution pages. It won't appear here.",
    );
    expect(wrongContextMessage(["product", "solution", "job", "post"])).toBe(
      "This section only shows on product, solution, job and post pages. It won't appear here.",
    );
  });

  it("looks a block's record types up without mistaking inherited keys", () => {
    expect(templateBlockRecordTypes("postArticle")).toEqual(["post"]);
    expect(templateBlockRecordTypes("richText")).toBeUndefined();
    expect(templateBlockRecordTypes("constructor")).toBeUndefined();
  });

  it("gives every hero fact a distinct key, and facts only to the types that show them", () => {
    expect(new Set(HERO_ATTRIBUTE_KEYS).size).toBe(HERO_ATTRIBUTE_KEYS.length);
    expect(Object.keys(HERO_ATTRIBUTES).sort()).toEqual(
      [...(TEMPLATE_BLOCK_RECORD_TYPES.recordHero as string[])].sort(),
    );
  });
});
