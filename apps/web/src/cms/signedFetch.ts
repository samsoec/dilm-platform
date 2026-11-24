import { AwsClient } from "aws4fetch";

type Env = Record<string, string | undefined>;

export function cmsUrl(env: Env = process.env): string {
  const url = env.CMS_URL;
  if (!url) throw new Error("CMS_URL is not set.");
  return url.replace(/\/+$/, "");
}

export function cmsRequiresSigning(env: Env = process.env): boolean {
  return env.CMS_AUTH === "iam";
}

export async function cmsFetch(
  path: string,
  env: Env = process.env,
  fetcher: typeof fetch = fetch,
  init?: RequestInit,
): Promise<Response> {
  const url = `${cmsUrl(env)}${path}`;
  if (!cmsRequiresSigning(env)) {
    return init === undefined ? fetcher(url) : fetcher(url, init);
  }
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN } = env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("CMS_AUTH=iam needs AWS credentials in the environment.");
  }
  const client = new AwsClient({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
    service: "lambda",
    region: env.AWS_REGION,
  });
  return fetcher(await client.sign(url, init));
}
