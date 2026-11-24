const CONTENT_SOURCE = /(^|\/)content(\/|$)/;

export default {
  meta: {
    type: "problem",
    messages: {
      blocked:
        "Content modules are server-only; client components must receive content as props.",
    },
    schema: [],
  },
  create(context) {
    let isClient = false;
    return {
      Program(node) {
        isClient = node.body.some(
          (statement) => statement.directive === "use client",
        );
      },
      ImportDeclaration(node) {
        if (isClient && CONTENT_SOURCE.test(String(node.source.value))) {
          context.report({ node, messageId: "blocked" });
        }
      },
    };
  },
};
