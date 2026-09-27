import { createHmac } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import type { CvSubmission } from "../payload-types";
import {
  JOB_PLATFORM_TIMEOUT_MS,
  JobPlatformError,
  postToJobPlatform,
  signWebhookBody,
} from "./webhook";

const submission = {
  id: 1,
  submissionId: "sub-1",
  applicantName: "Siti Rahma",
  email: "siti@example.com",
  phone: "+62 812 3456 7890",
  position: "Process Engineer",
  resumeFileKey: "cv/duniakimia/sub-1.pdf",
  submittedAt: "2026-09-27T03:00:00.000Z",
} as CvSubmission;
const config = { webhookUrl: "https://jobs.example/hook", webhookSecret: "k" };

describe("signWebhookBody", () => {
  it("is an HMAC-SHA256 of the exact body", () => {
    const body = '{"a":1}';
    expect(signWebhookBody(body, "k")).toBe(
      `sha256=${createHmac("sha256", "k").update(body).digest("hex")}`,
    );
  });
});

describe("postToJobPlatform", () => {
  it("times out after ten seconds", () => {
    expect(JOB_PLATFORM_TIMEOUT_MS).toBe(10_000);
  });

  it("signs the body it actually sends", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
    await postToJobPlatform(config, submission, "duniakimia", fetchMock);

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    const headers = init.headers as Record<string, string>;
    expect(headers["X-DILM-Signature"]).toBe(
      signWebhookBody(init.body as string, "k"),
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      submissionId: "sub-1",
      tenant: "duniakimia",
    });
  });

  it("turns network errors and non-2xx answers into JobPlatformError", async () => {
    await expect(
      postToJobPlatform(config, submission, "duniakimia", async () => {
        throw new TypeError("fetch failed");
      }),
    ).rejects.toThrow(JobPlatformError);
    await expect(
      postToJobPlatform(
        config,
        submission,
        "duniakimia",
        async () => new Response(null, { status: 401 }),
      ),
    ).rejects.toMatchObject({ status: 401 });
  });
});
