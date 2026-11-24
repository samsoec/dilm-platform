export function fixtureModeEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.CONTENT_TRANSPORT !== "fixture") return false;
  if (env.SITE_STAGE === "production") {
    throw new Error(
      "CONTENT_TRANSPORT=fixture is not allowed when SITE_STAGE is production.",
    );
  }
  return true;
}
