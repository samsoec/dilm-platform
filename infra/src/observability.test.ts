import { describe, expect, it } from "vitest";

import {
  alarmEmailPlan,
  alarmSpecs,
  alarmTopicName,
  LOG_RETENTION_DAYS,
  MAX_ALARMS,
} from "./observability";

const targets = {
  stage: "staging",
  payloadFunctionName: "payload-fn",
  cvConsumerFunctionName: "consumer-fn",
  auroraClusterIdentifier: "dilm-staging-db",
};

describe("alarmSpecs", () => {
  it("stays within the alarm budget and names alarms per stage", () => {
    const specs = alarmSpecs(targets);
    expect(specs.length).toBe(8);
    expect(specs.length).toBeLessThanOrEqual(MAX_ALARMS);
    for (const spec of specs) expect(spec.name).toMatch(/^dilm-staging-/);
    expect(new Set(specs.map((s) => s.name)).size).toBe(specs.length);
    expect(new Set(specs.map((s) => s.key)).size).toBe(specs.length);
  });

  it("never alarms on missing data", () => {
    for (const spec of alarmSpecs(targets)) {
      expect(spec.treatMissingData).toBe("notBreaching");
    }
  });

  it("fires on one dead-letter message within a minute", () => {
    const dlq = alarmSpecs(targets).find((s) => s.key === "CvDlqDepth")!;
    expect(dlq.dimensions).toEqual({ QueueName: "dilm-staging-cv-intake-dlq" });
    expect(dlq).toMatchObject({
      threshold: 1,
      periodSeconds: 60,
      evaluationPeriods: 1,
      statistic: "Maximum",
    });
  });

  it("points the Lambda alarms at the right functions", () => {
    const byKey = Object.fromEntries(
      alarmSpecs(targets).map((s) => [s.key, s]),
    );
    expect(byKey.PayloadErrors.dimensions).toEqual({
      FunctionName: "payload-fn",
    });
    expect(byKey.PayloadThrottles.metricName).toBe("Throttles");
    expect(byKey.CvConsumerErrors.dimensions).toEqual({
      FunctionName: "consumer-fn",
    });
  });

  it("reads the webhook metric the intake emits", () => {
    const hook = alarmSpecs(targets).find((s) => s.key === "WebhookFailure")!;
    expect(hook).toMatchObject({
      namespace: "DILM/CMS",
      metricName: "WebhookFailure",
      dimensions: { Stage: "staging" },
    });
  });

  it("needs 30 minutes at max capacity for the Aurora alarm", () => {
    const aurora = alarmSpecs(targets).find(
      (s) => s.key === "AuroraCapacityAtMax",
    )!;
    expect(aurora.periodSeconds * aurora.evaluationPeriods).toBe(1800);
    expect(aurora.datapointsToAlarm).toBe(aurora.evaluationPeriods);
    expect(aurora.threshold).toBe(1);
  });

  it("skips the Aurora alarm without an Aurora cluster", () => {
    expect(
      alarmSpecs({ ...targets, auroraClusterIdentifier: undefined }).length,
    ).toBe(7);
    expect(
      alarmSpecs({ ...targets, stage: "dev" }).some(
        (s) => s.key === "AuroraCapacityAtMax",
      ),
    ).toBe(false);
  });
});

describe("alarm topic and email", () => {
  it("names the topic per stage and retains 30 days", () => {
    expect(alarmTopicName("staging")).toBe("dilm-staging-alarms");
    expect(LOG_RETENTION_DAYS).toBe(30);
  });

  it("subscribes a valid email", () => {
    expect(alarmEmailPlan("staging", " ops@example.com ")).toEqual({
      email: "ops@example.com",
    });
  });

  it("skips with a log when unset off production", () => {
    expect(alarmEmailPlan("staging", "").log).toMatch(/ALARM_EMAIL/);
    expect(alarmEmailPlan("dev", undefined).email).toBeUndefined();
  });

  it("requires an email on production and rejects garbage", () => {
    expect(() => alarmEmailPlan("production", "")).toThrow(/required/);
    expect(() => alarmEmailPlan("staging", "nope")).toThrow(/not an email/);
  });
});
