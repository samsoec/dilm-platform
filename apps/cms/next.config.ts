import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const repoEnvFile = path.join(repoRoot, ".env");
if (existsSync(repoEnvFile)) process.loadEnvFile(repoEnvFile);

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@dilm/runtime-config", "@dilm/shared-types"],
  turbopack: {
    root: repoRoot,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
