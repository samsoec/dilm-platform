import { TENANT_SLUGS } from "@dilm/shared-types";
import { describe, expect, it } from "vitest";

import {
  CV_STATUSES,
  EXTERNAL_SYNC_STATUSES,
} from "../collections/CvSubmissions";
import { isPhoneNumber } from "../validation";
import {
  CV_SAMPLE_PREFIX,
  cvSamples,
  EMAIL_CASES,
  SYNC_CASES,
} from "./cvSamples";

const NOW = new Date("2026-10-16T03:00:00.000Z");
const samples = cvSamples(NOW);

describe("CV sample seed", () => {
  it("covers every status × sync × notification combination for every tenant", () => {
    for (const tenant of TENANT_SLUGS) {
      const combos = new Set(
        samples
          .filter((sample) => sample.tenantSlug === tenant)
          .map(
            (sample) =>
              `${sample.status}|${sample.externalSyncStatus}|${sample.externalSyncAttempts}|${Boolean(sample.applicantNotifiedAt)}|${Boolean(sample.recruiterNotifiedAt)}`,
          ),
      );
      expect(combos.size).toBeGreaterThanOrEqual(
        CV_STATUSES.length * SYNC_CASES.length * EMAIL_CASES.length,
      );
    }
    expect(new Set(samples.map((s) => s.externalSyncStatus))).toEqual(
      new Set(EXTERNAL_SYNC_STATUSES),
    );
  });

  it("is fixed: the same clock gives the same records", () => {
    expect(cvSamples(NOW)).toEqual(samples);
    expect(samples).toHaveLength(TENANT_SLUGS.length * 90);
  });

  it("marks every record so the script only ever replaces its own", () => {
    const ids = samples.map((sample) => sample.submissionId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith(CV_SAMPLE_PREFIX)).toBe(true);
    for (const sample of samples) {
      expect(sample.email).toMatch(/@(subdomain\.)?example\.com$/);
    }
  });

  it("keeps the data consistent with what cv-intake would write", () => {
    for (const sample of samples) {
      const submitted = Date.parse(sample.submittedAt);
      expect(submitted).toBeLessThanOrEqual(NOW.getTime());
      for (const at of [
        sample.applicantNotifiedAt,
        sample.recruiterNotifiedAt,
      ]) {
        if (at) expect(Date.parse(at)).toBeGreaterThan(submitted);
      }
      expect(sample.externalSyncAttempts > 0).toBe(
        sample.externalSyncStatus !== "pending",
      );
      expect(sample.applicantName.trim()).not.toBe("");
      expect(isPhoneNumber(sample.phone, {} as never)).toBe(true);
    }
  });

  it("includes the edge cases the list has to survive", () => {
    const names = samples.map((sample) => sample.applicantName);
    expect(names).toContain("Sukarno");
    expect(names).toContain("Maria D'Souza");
    expect(names).toContain("José Ramírez Nuñez");
    expect(Math.max(...names.map((name) => name.length))).toBeGreaterThan(50);
    expect(Math.max(...samples.map((s) => s.externalSyncAttempts))).toBe(12);
    const ages = samples.map((s) => NOW.getTime() - Date.parse(s.submittedAt));
    expect(Math.min(...ages)).toBeLessThan(5 * 60_000);
    expect(Math.max(...ages)).toBeGreaterThanOrEqual(365 * 24 * 3_600_000);
  });
});
