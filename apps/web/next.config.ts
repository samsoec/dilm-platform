import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

import { mediaOrigin } from "./src/images/mediaImage";
import { cspMode, securityHeaders } from "./src/security/headers";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@dilm/runtime-config", "@dilm/shared-types"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          mode: cspMode(process.env.CSP_MODE),
          dev: process.env.NODE_ENV !== "production",
          mediaOrigin: mediaOrigin(),
        }),
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/images/loader.ts",
  },
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
