const config = {
  default: {
    override: {
      wrapper: "aws-lambda",
      converter: "aws-apigw-v2",
      incrementalCache: "s3",
      tagCache: "dynamodb",
      queue: "direct",
    },
  },
};

export default config;
