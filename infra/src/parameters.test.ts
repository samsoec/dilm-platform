import { describe, expect, it } from "vitest";

import { SSM_PARAMETER_NAMES } from "../../packages/runtime-config/src/aws";
import {
  parameterArns,
  parameterPrefix,
  RUNTIME_PARAMETER_NAMES,
} from "./parameters";

describe("runtime parameters", () => {
  it("are exactly the ones the runtime-config loader reads", () => {
    expect([...RUNTIME_PARAMETER_NAMES]).toEqual([...SSM_PARAMETER_NAMES]);
  });

  it("are granted by exact ARN under the stage prefix, no wildcards", () => {
    const arns = parameterArns({
      partition: "aws",
      region: "ap-southeast-3",
      accountId: "123456789012",
      stage: "staging",
    });
    expect(parameterPrefix("staging")).toBe("/dilm/staging");
    expect(arns).toHaveLength(5);
    expect(arns[0]).toBe(
      "arn:aws:ssm:ap-southeast-3:123456789012:parameter/dilm/staging/PAYLOAD_SECRET",
    );
    expect(arns.some((arn) => arn.includes("*"))).toBe(false);
  });
});
