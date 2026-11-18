import { describe, expect, it } from "vitest";

import {
  cvConsumerDatabaseTls,
  cvConsumerSettings,
  cvDeadLetterQueueName,
  cvQueueName,
  cvQueueSettings,
} from "./queue";

describe("cv queue", () => {
  it("names the queue and its dead-letter queue per stage", () => {
    expect(cvQueueName("staging")).toBe("dilm-staging-cv-intake");
    expect(cvDeadLetterQueueName("staging")).toBe("dilm-staging-cv-intake-dlq");
  });

  it("encrypts with SSE-SQS and waits at least 6x the consumer timeout", () => {
    const queue = cvQueueSettings();
    expect(queue.sqsManagedSseEnabled).toBe(true);
    expect(queue.visibilitySeconds).toBe(360);
    expect(queue.visibilitySeconds).toBeGreaterThanOrEqual(6 * 60);
  });

  it("moves a message to the dead-letter queue after 5 receives", () => {
    expect(cvQueueSettings().maxReceiveCount).toBe(5);
  });

  it("caps the consumer at the shared constants", () => {
    expect(cvConsumerSettings()).toEqual({
      timeout: "60 seconds",
      batchSize: 1,
      maximumConcurrency: 2,
    });
  });
});

describe("cvConsumerDatabaseTls", () => {
  it("ships the RDS CA to the consumer on Aurora stages", () => {
    for (const stage of ["staging", "production"]) {
      expect(cvConsumerDatabaseTls(stage)).toEqual({
        copyFiles: [
          {
            from: "src/rotation/ap-southeast-3-bundle.pem",
            to: "ca-bundle.pem",
          },
        ],
        environment: { NODE_EXTRA_CA_CERTS: "/var/task/ca-bundle.pem" },
      });
    }
  });

  it("leaves the express dev stage alone", () => {
    expect(cvConsumerDatabaseTls("dev")).toEqual({});
  });
});
