import { chromium } from "playwright-core";

const USAGE = `Visual smoke test for src/admin/styles/overrides.scss (TRD-UI NFR-UI-05).

Run it after every Payload upgrade, with the CMS dev server and Docker
Postgres up. Each check loads an admin page, finds the Payload element an
override targets and compares its computed style with what the override sets,
so a renamed Payload class or a changed default fails by name.

  SMOKE_EMAIL=... SMOKE_PASSWORD=... pnpm --filter @dilm/cms smoke:overrides

Environment: SMOKE_EMAIL and SMOKE_PASSWORD (a Super Admin), SMOKE_URL
(default http://localhost:3000), SMOKE_TENANT (tenant id, default 2),
SMOKE_CHROME (Chrome executable path, default Playwright's channel "chrome").`;

if (process.argv.includes("--help")) {
  console.log(USAGE);
  process.exit(0);
}

const base = process.env.SMOKE_URL ?? "http://localhost:3000";
const email = process.env.SMOKE_EMAIL;
const password = process.env.SMOKE_PASSWORD;
if (!email || !password) {
  console.error("SMOKE_EMAIL and SMOKE_PASSWORD are required.\n\n" + USAGE);
  process.exit(2);
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.SMOKE_CHROME
    ? { executablePath: process.env.SMOKE_CHROME }
    : { channel: "chrome" }),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
await page.goto(`${base}/admin/login`, { waitUntil: "domcontentloaded" });
const status = await page.evaluate(
  async ([e, p]) =>
    (
      await fetch("/api/users/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      })
    ).status,
  [email, password],
);
if (status !== 200) {
  console.error(`Sign-in failed (${status}).`);
  process.exit(2);
}
await context.addCookies([
  { name: "payload-tenant", value: process.env.SMOKE_TENANT ?? "2", url: base },
  { name: "payload-theme", value: "light", url: base },
]);

const token = (name) =>
  `getComputedStyle(document.documentElement).getPropertyValue("--dil-${name}").trim()`;

const checks = [
  {
    name: "primary button reads the brand fill colour (.btn--style-primary)",
    path: "/admin/collections/ir-documents",
    selector: ".btn--style-primary:not(.btn--disabled)",
    expect: `getComputedStyle(el).getPropertyValue("--bg-color").trim() === ${token("brand-fill")}`,
  },
  {
    name: "secondary button reads the surface colour (.btn--style-secondary)",
    path: "/admin/account",
    selector: ".btn--style-secondary:not(.btn--disabled)",
    expect: `getComputedStyle(el).getPropertyValue("--bg-color").trim() === ${token("surface")}`,
  },
  {
    name: "sidebar uses the surface colour (.nav)",
    path: "/admin",
    selector: ".nav",
    expect: `(() => { const probe = document.createElement("i"); probe.style.background = "var(--dil-surface)"; document.body.appendChild(probe); const surface = getComputedStyle(probe).backgroundColor; probe.remove(); return getComputedStyle(el).backgroundColor === surface; })()`,
  },
  {
    name: "native locale switch is hidden (.app-header__localizer)",
    path: "/admin/collections/header/3",
    selector: ".app-header__localizer",
    expect: `getComputedStyle(el).display === "none"`,
    optional: true,
  },
  {
    name: "breadcrumb home link is hidden (.app-header__step-nav)",
    path: "/admin/collections/cv-submissions",
    selector: ".app-header__step-nav > :nth-child(1)",
    expect: `getComputedStyle(el).display === "none"`,
  },
  {
    name: "settings tabs carry the DIL icon hook (.tabs-field__tab-button)",
    path: "/admin/collections/tenant-settings/10",
    selector: ".tabs-field__tab-button[data-dil-icon]",
    expect: `true`,
  },
  {
    name: "keyboard focus ring is visible (a:focus-visible)",
    path: "/admin/account",
    selector: ".template-default__wrap a[href]",
    keyboard: true,
    expect: `getComputedStyle(document.activeElement).outlineStyle !== "none" && document.activeElement !== document.body`,
  },
];

let failed = 0;
for (const check of checks) {
  await page.goto(`${base}${check.path}`, { waitUntil: "domcontentloaded" });
  await page
    .waitForLoadState("networkidle", { timeout: 60000 })
    .catch(() => {});
  const found = await page
    .locator(check.selector)
    .first()
    .elementHandle({ timeout: 8000 })
    .catch(() => null);
  let outcome;
  if (!found) {
    outcome = check.optional
      ? "skipped (not on this page)"
      : "FAIL: selector no longer matches";
  } else {
    if (check.keyboard) {
      for (let press = 0; press < 6; press += 1)
        await page.keyboard.press("Tab");
    }
    const ok = await found.evaluate(
      new Function("el", `return ${check.expect};`),
    );
    outcome = ok ? "ok" : "FAIL: computed style differs from the override";
  }
  if (outcome.startsWith("FAIL")) failed += 1;
  console.log(
    `${outcome.startsWith("FAIL") ? "✗" : "✓"} ${check.name}: ${outcome}`,
  );
}
await browser.close();
if (failed > 0) {
  console.error(`\n${failed} override check(s) failed.`);
  process.exit(1);
}
console.log("\nAll override checks passed.");
