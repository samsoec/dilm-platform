import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROLES = ["super", "editor", "viewer"];

const USAGE = `Screenshots of admin pages as each QA role, for checking a screen against its design.

Signs in once per role, then opens every --path at every width and theme and
saves a PNG for each. Needs the CMS dev server and Docker Postgres up.

  pnpm --filter @dilm/cms qa:shots --path /admin/collections/pages --name pages

Options:
  --path <url path>     Page to capture. Repeat it for several pages.
  --name <label>        File name prefix (default: taken from the path).
  --roles <list>        Comma list of super, editor, viewer (default: all three).
  --widths <list>       Comma list of viewport widths (default: 1440,390).
  --themes <list>       Comma list of light, dark (default: light,dark).
  --tenant <id>         Company to select (default: QA_TENANT or 2).
  --wait-for <css>      Wait for this element before the capture.
  --full-page           Capture the whole scroll height, not just the viewport.
  --out <dir>           Where the PNGs go (default: docs/qa-shots, gitignored).

Each line of output is one capture: HTTP status, the number of console errors
(script errors plus requests that answered 400 or above, the first three
listed underneath) and the file path. Exits 1 when a sign-in fails, a page answers 400 or above,
or --wait-for never appears.

Environment (read from the root .env by the package script): passwords in
QA_CLAUDE_SUPER_PASSWORD, QA_CLAUDE_EDITOR_PASSWORD and
QA_CLAUDE_VIEWER_PASSWORD; emails default to qa-<role>-claude@example.test
and can be set with QA_CLAUDE_<ROLE>_EMAIL. QA_URL is the CMS address
(default http://localhost:3000), QA_CHROME a Chrome executable path
(default Playwright's channel "chrome").`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}

const values = (flag) =>
  args.flatMap((arg, index) => (arg === flag ? [args[index + 1]] : []));
const list = (flag, fallback) =>
  (values(flag).at(-1) ?? fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const paths = values("--path");
if (paths.length === 0 || paths.some((path) => !path?.startsWith("/"))) {
  console.error("Give at least one --path starting with /.\n\n" + USAGE);
  process.exit(2);
}

const roles = list("--roles", ROLES.join(","));
const unknownRole = roles.find((role) => !ROLES.includes(role));
if (unknownRole) {
  console.error(`Unknown role "${unknownRole}". Use ${ROLES.join(", ")}.`);
  process.exit(2);
}

const widths = list("--widths", "1440,390").map(Number);
const themes = list("--themes", "light,dark");
const tenant = values("--tenant").at(-1) ?? process.env.QA_TENANT ?? "2";
const waitFor = values("--wait-for").at(-1);
const fullPage = args.includes("--full-page");
const base = process.env.QA_URL ?? "http://localhost:3000";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const outDir = resolve(
  process.env.INIT_CWD ?? process.cwd(),
  values("--out").at(-1) ?? resolve(repoRoot, "docs/qa-shots"),
);
mkdirSync(outDir, { recursive: true });

const slug = (path) =>
  path
    .replace(/^\/admin\/?/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "") || "admin";
const givenName = values("--name").at(-1);
const nameFor = (path) =>
  givenName && paths.length === 1
    ? givenName
    : [givenName, slug(path)].filter(Boolean).join("-");

const credentials = (role) => {
  const key = role.toUpperCase();
  return {
    email:
      process.env[`QA_CLAUDE_${key}_EMAIL`] ?? `qa-${role}-claude@example.test`,
    password: process.env[`QA_CLAUDE_${key}_PASSWORD`],
  };
};

const missing = roles.filter((role) => !credentials(role).password);
if (missing.length > 0) {
  console.error(
    `No password for: ${missing.join(", ")}. Set QA_CLAUDE_<ROLE>_PASSWORD in the root .env.`,
  );
  process.exit(2);
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.QA_CHROME
    ? { executablePath: process.env.QA_CHROME }
    : { channel: "chrome" }),
});

let failed = false;

for (const role of roles) {
  const { email, password } = credentials(role);
  const context = await browser.newContext({
    viewport: { width: widths[0], height: 900 },
  });
  const page = await context.newPage();
  let consoleErrors = [];
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !text.startsWith("Failed to load")) {
      consoleErrors.push(text);
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url() !== page.url()) {
      consoleErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(`${base}/admin/login`, { waitUntil: "domcontentloaded" });
  const signIn = await page.evaluate(
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
  if (signIn !== 200) {
    console.log(`FAIL  sign-in as ${role} (${email}) answered ${signIn}`);
    failed = true;
    await context.close();
    continue;
  }

  for (const theme of themes) {
    await context.addCookies([
      { name: "payload-tenant", value: tenant, url: base },
      { name: "payload-theme", value: theme, url: base },
    ]);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        consoleErrors = [];
        const file = resolve(
          outDir,
          `${nameFor(path)}-${role}-${theme}-${width}.png`,
        );
        let status = 0;
        let problem = "";
        try {
          const response = await page.goto(base + path, {
            waitUntil: "networkidle",
            timeout: 60_000,
          });
          status = response?.status() ?? 0;
          if (waitFor) await page.waitForSelector(waitFor, { timeout: 15_000 });
        } catch (error) {
          problem = String(error.message).split("\n")[0];
        }
        await page.screenshot({ path: file, fullPage });
        const bad = status >= 400 || status === 0 || problem !== "";
        if (bad) failed = true;
        console.log(
          `${bad ? "FAIL" : "ok  "}  ${status}  ${consoleErrors.length} console errors  ${file}`,
        );
        if (problem) console.log(`      ${problem}`);
        for (const text of consoleErrors.slice(0, 3)) {
          console.log(`      console: ${text.slice(0, 200)}`);
        }
      }
    }
  }
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
