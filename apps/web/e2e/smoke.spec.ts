import AxeBuilder from "@axe-core/playwright";
import { TENANT_DOMAINS } from "@dilm/shared-types";
import { expect, test } from "@playwright/test";

const PORT = 3101;
const TENANTS = [
  { slug: "indoacid", name: "Indonesian Acids" },
  { slug: "duniakimia", name: "Dunia Kimia" },
  { slug: "likutelaga", name: "Liku Telaga" },
] as const;
function origin(label: string): string {
  return `http://${label}.localhost:${PORT}`;
}

const LOCALES = ["en", "id"] as const;

const REQUIRED_HEADERS = [
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "content-security-policy",
];

function expectSecurityHeaders(headers: Record<string, string>) {
  for (const name of REQUIRED_HEADERS) {
    expect(headers[name], name).toBeTruthy();
  }
}

for (const tenant of TENANTS) {
  for (const locale of LOCALES) {
    test(`${tenant.slug} ${locale} renders without serious axe violations`, async ({
      page,
    }) => {
      const url = `${origin(tenant.slug)}/${locale}`;
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      expectSecurityHeaders(response?.headers() ?? {});
      await expect(page.locator("main")).toContainText(tenant.name);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      );
      expect(serious.map((violation) => violation.id)).toEqual([]);
    });
  }

  test(`${tenant.slug} serves its own robots.txt that blocks non-production`, async ({
    request,
  }) => {
    const response = await request.get("/robots.txt", {
      headers: { host: TENANT_DOMAINS[tenant.slug] },
    });
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Disallow: /");
  });

  test(`${tenant.slug} bare / redirects to /en with security headers`, async ({
    request,
  }) => {
    const response = await request.get("/", {
      headers: { host: TENANT_DOMAINS[tenant.slug] },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe("/en");
    expectSecurityHeaders(response.headers());
  });
}

test("unknown host returns 404 with security headers", async ({ request }) => {
  const response = await request.get("/en", {
    headers: { host: "unknown.example" },
  });
  expect(response.status()).toBe(404);
  expectSecurityHeaders(response.headers());
});

test("unknown tenant slug on a local host returns 404", async ({ request }) => {
  const response = await request.get("/en", {
    headers: { host: "nope.example" },
  });
  expect(response.status()).toBe(404);
});

test("revalidate rejects an unsigned POST with 401", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    headers: { host: TENANT_DOMAINS[TENANTS[0].slug] },
    data: {},
  });
  expect(response.status()).toBe(401);
});

test("revalidate rejects GET with 405", async ({ request }) => {
  const response = await request.get("/api/revalidate", {
    headers: { host: TENANT_DOMAINS[TENANTS[0].slug] },
  });
  expect(response.status()).toBe(405);
});

test("a path under /api/revalidate returns 404", async ({ request }) => {
  const response = await request.post("/api/revalidate/x", {
    headers: { host: TENANT_DOMAINS[TENANTS[0].slug] },
    data: {},
  });
  expect(response.status()).toBe(404);
});

const NOT_FOUND_TITLES = {
  en: "Page not found",
  id: "Halaman tidak ditemukan",
} as const;

for (const locale of LOCALES) {
  test(`unmatched ${locale} path renders a localized noindex 404`, async ({
    page,
  }) => {
    const response = await page.goto(
      `${origin(TENANTS[0].slug)}/${locale}/does-not-exist`,
    );
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText(NOT_FOUND_TITLES[locale]);
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("content")),
      );
    expect(robots.length).toBeGreaterThan(0);
    for (const content of robots) expect(content).toMatch(/noindex/);
  });
}
