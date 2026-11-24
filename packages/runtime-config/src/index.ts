import type { RuntimeConfig } from "./config";
import { readRuntimeConfigFromAws } from "./aws";
import { readRuntimeConfigFromEnv } from "./env";

export * from "./config";
export {
  loadEdgeConfig,
  readRuntimeConfigFromAws,
  readSstResource,
  SSM_PARAMETER_NAMES,
} from "./aws";
export type { AwsConfigProviders } from "./aws";
export { MissingEnvError, readRuntimeConfigFromEnv } from "./env";
export * from "./pool";
export * from "./preview";
export * from "./revalidate";

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
  return readRuntimeConfigFromAws(env);
}

let cached: Promise<RuntimeConfig> | undefined;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
  cached ??= loadRuntimeConfig(process.env).catch((error: unknown) => {
    cached = undefined;
    throw error;
  });
  return cached;
}
