import type { RuntimeConfig } from "./config";
import { readRuntimeConfigFromEnv } from "./env";

export * from "./config";
export { MissingEnvError, readRuntimeConfigFromEnv } from "./env";
export * from "./pool";

export type RuntimeConfigSource = "env" | "aws";

type Env = Record<string, string | undefined>;

export function runtimeConfigSource(env: Env): RuntimeConfigSource {
  const source = env.RUNTIME_CONFIG_SOURCE ?? "aws";
  if (source !== "env" && source !== "aws") {
    throw new Error(
      `RUNTIME_CONFIG_SOURCE must be "env" or "aws", got "${source}".`,
    );
  }
  return source;
}

export async function loadRuntimeConfig(env: Env): Promise<RuntimeConfig> {
  if (runtimeConfigSource(env) === "env") {
    return readRuntimeConfigFromEnv(env);
  }
  // TODO(DILM-12): resolve the payload_app secret from Secrets Manager, the
  // rest from SSM and SST Resource bindings, into this same RuntimeConfig shape.
  throw new Error(
    "The AWS runtime-config loader is not implemented yet (DILM-12). Set RUNTIME_CONFIG_SOURCE=env to read from environment variables.",
  );
}

let cached: Promise<RuntimeConfig> | undefined;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
  cached ??= loadRuntimeConfig(process.env);
  return cached;
}
