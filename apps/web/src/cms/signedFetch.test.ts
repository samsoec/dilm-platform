import { describe, expect, it, vi } from "vitest";

import { cmsFetch } from "./signedFetch";

const base = { CMS_URL: "https://cms.example/" };

describe("cmsFetch", () => {
  it("calls the CMS unsigned when CMS_AUTH is not iam", async () => {
    const fetcher = vi.fn(async () => new Response("{}"));
    await cmsFetch("/api/x", base, fetcher);
    expect(fetcher).toHaveBeenCalledWith("https://cms.example/api/x");
  });

  it("signs with SigV4 for the lambda service when CMS_AUTH is iam", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      return new Response((input as Request).headers.get("authorization"));
    });
    const response = await cmsFetch(
      "/api/x",
      {
        ...base,
        CMS_AUTH: "iam",
        AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
        AWS_SECRET_ACCESS_KEY: "secret",
        AWS_SESSION_TOKEN: "token",
        AWS_REGION: "ap-southeast-3",
      },
      fetcher as unknown as typeof fetch,
    );
    const authorization = await response.text();
    expect(authorization).toContain("AWS4-HMAC-SHA256");
    expect(authorization).toContain("ap-southeast-3/lambda/aws4_request");
  });

  it("refuses to sign without credentials", async () => {
    await expect(
      cmsFetch("/api/x", { ...base, CMS_AUTH: "iam" }),
    ).rejects.toThrow(/credentials/);
  });
});
