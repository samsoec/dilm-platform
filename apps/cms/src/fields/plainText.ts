type LexicalNode = {
  type?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

export function formulaPlainText(value: unknown): string {
  const root = (value as { root?: LexicalNode } | null | undefined)?.root;
  if (!root) return "";
  const walk = (node: LexicalNode): string => {
    if (node.type === "text") return String(node.text ?? "");
    return (node.children ?? []).map(walk).join("");
  };
  return walk(root);
}
