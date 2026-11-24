import { describe, expect, it, vi } from "vitest";

import converter from "./dualConverter";

vi.mock("@opennextjs/aws/core/routing/util.js", () => ({
  convertToQuery: (search: string) =>
    Object.fromEntries(new URLSearchParams(search)),
}));

const v1Event = {
  httpMethod: "GET",
  path: "/admin",
  resource: "/{proxy+}",
  headers: { host: "admin.example", "x-forwarded-for": "1.2.3.4" },
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: { identity: { sourceIp: "1.2.3.4" } },
  body: null,
  isBase64Encoded: false,
};

const v2Event = {
  version: "2.0",
  rawPath: "/admin",
  rawQueryString: "a=1",
  headers: { host: "fn.lambda-url.example", "x-forwarded-for": "1.2.3.4" },
  requestContext: {
    http: { method: "GET", path: "/admin", sourceIp: "1.2.3.4" },
  },
  isBase64Encoded: false,
};

describe("dual converter", () => {
  it("reads an API Gateway REST (v1) event", async () => {
    const event = await converter.convertFrom(v1Event);
    expect(event).toMatchObject({
      type: "core",
      method: "GET",
      rawPath: "/admin",
    });
  });

  it("reads a Function URL (v2) event", async () => {
    const event = await converter.convertFrom(v2Event);
    expect(event).toMatchObject({
      method: "GET",
      rawPath: "/admin",
      query: { a: "1" },
    });
  });

  it("answers in the shape of the event it received", async () => {
    const result = {
      type: "core",
      statusCode: 200,
      headers: { "content-type": "text/plain" },
      body: new Response("ok").body,
      isBase64Encoded: false,
    };
    const forV1 = await converter.convertTo(result, v1Event);
    expect(forV1).toHaveProperty("multiValueHeaders");
    const forV2 = await converter.convertTo(
      { ...result, body: new Response("ok").body },
      v2Event,
    );
    expect(forV2).toHaveProperty("cookies");
    expect(forV2).not.toHaveProperty("multiValueHeaders");
  });
});
