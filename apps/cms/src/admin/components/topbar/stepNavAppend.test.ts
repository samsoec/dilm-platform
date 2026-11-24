import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const components = join(__dirname, "..");

const listViews = [
  "pages/PagesView.tsx",
  "pages/SharedPagesView.tsx",
  "posts/PostsView.tsx",
  "products/ProductsView.tsx",
  "solutions/SolutionsView.tsx",
  "redirects/RedirectsView.tsx",
  "templates/TemplatesView.tsx",
  "jobs/JobsView.tsx",
  "categories/CategoriesView.tsx",
];

const allowedToDeriveFromCurrentNav: string[] = [];

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

export function setStepNavArguments(source: string): string[] {
  const found: string[] = [];
  for (const match of source.matchAll(/setStepNav\s*\(/g)) {
    let depth = 1;
    let i = match.index + match[0].length;
    const start = i;
    while (i < source.length && depth > 0) {
      if (source[i] === "(") depth++;
      if (source[i] === ")") depth--;
      i++;
    }
    found.push(source.slice(start, i - 1));
  }
  return found;
}

export function derivesFromCurrentNav(source: string, argument: string) {
  const names = [
    ...source.matchAll(/\{\s*([^}]*)\}\s*=\s*useStepNav\(\)/g),
  ].flatMap(([, list]) =>
    list
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("setStepNav")),
  );
  const identifiers = names.map((name) => name.split(":").pop()!.trim());
  const mentions = identifiers.some((name) =>
    new RegExp(`\\b${name}\\b`).test(argument),
  );
  return (
    mentions || /\.\.\.|\.concat\s*\(|\.slice\s*\(|\.push\s*\(/.test(argument)
  );
}

describe("step nav", () => {
  it("detects calls that build on the current crumbs", () => {
    const base = "const { stepNav, setStepNav } = useStepNav();\n";
    const bad = [
      "setStepNav([...stepNav, { label }])",
      "setStepNav(\n[\n...stepNav,\n{ label }])",
      "setStepNav(stepNav.concat({ label }))",
      "setStepNav([...nav.slice(0, 1), { label }])",
      "setStepNav(stepNav.slice(0, 1))",
    ];
    for (const call of bad) {
      const args = setStepNavArguments(base + call);
      expect(derivesFromCurrentNav(base + call, args[0])).toBe(true);
    }
    const good = "setStepNav([{ label: 'My account' }])";
    expect(
      derivesFromCurrentNav(base + good, setStepNavArguments(good)[0]),
    ).toBe(false);
  });

  it("never builds the next crumbs by appending to the previous route's", () => {
    const offenders = sources(components)
      .filter((path) => {
        const source = readFileSync(path, "utf8");
        return setStepNavArguments(source).some((argument) =>
          derivesFromCurrentNav(source, argument),
        );
      })
      .map((path) => path.slice(components.length + 1))
      .filter((path) => !allowedToDeriveFromCurrentNav.includes(path));
    expect(offenders).toEqual([]);
  });

  it.each(listViews)("%s replaces crumbs through ListStepNav", (view) => {
    const source = readFileSync(join(components, view), "utf8");
    expect(source).toMatch(/import \{ ListStepNav \} from "[^"]*ListStepNav"/);
    expect(source).toMatch(/<ListStepNav\b/);
  });
});
