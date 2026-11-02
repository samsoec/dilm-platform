import ts from "typescript";

export function extractBlockTypes(
  source: string,
  interfaceNames: readonly string[],
): string {
  const file = ts.createSourceFile(
    "payload-types.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const declarations = new Map<string, ts.Statement>();
  for (const statement of file.statements) {
    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)
    ) {
      declarations.set(statement.name.text, statement);
    }
  }

  const wanted = new Set<string>();
  const visit = (name: string) => {
    const declaration = declarations.get(name);
    if (!declaration || wanted.has(name)) return;
    wanted.add(name);
    const walk = (node: ts.Node) => {
      if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
        visit(node.typeName.text);
      }
      ts.forEachChild(node, walk);
    };
    walk(declaration);
  };
  interfaceNames.forEach(visit);

  const body = [...declarations]
    .filter(([name]) => wanted.has(name))
    .map(([, statement]) => statement.getText(file))
    .join("\n\n");
  return body ? `${body}\n` : "export {};\n";
}
