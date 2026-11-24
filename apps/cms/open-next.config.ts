const config = {
  default: {
    override: {
      wrapper: "aws-lambda",
      converter: () =>
        import("./src/lambda/dualConverter").then((module) => module.default),
    },
  },
};

export default config;
