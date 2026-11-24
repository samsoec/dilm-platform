function isV2(event: unknown): boolean {
  return (event as { version?: unknown } | null)?.version === "2.0";
}

async function converterFor(event: unknown) {
  return isV2(event)
    ? (await import("@opennextjs/aws/overrides/converters/aws-apigw-v2.js"))
        .default
    : (await import("@opennextjs/aws/overrides/converters/aws-apigw-v1.js"))
        .default;
}

const dualConverter = {
  name: "aws-apigw-v1-or-v2",
  convertFrom: async (event: unknown) =>
    (await converterFor(event)).convertFrom(event as never),
  convertTo: async (result: unknown, originalRequest?: unknown) =>
    (await converterFor(originalRequest)).convertTo(
      result as never,
      originalRequest as never,
    ),
};

export default dualConverter;
