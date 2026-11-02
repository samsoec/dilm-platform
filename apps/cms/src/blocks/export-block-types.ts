import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pageBlocks } from ".";
import { extractBlockTypes } from "./exportTypes";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const source = await readFile(path.join(root, "src/payload-types.ts"), "utf8");
const names = pageBlocks.flatMap((block) =>
  block.interfaceName ? [block.interfaceName] : [],
);
await writeFile(
  path.join(root, "../../packages/shared-types/src/blocks.generated.ts"),
  extractBlockTypes(source, names),
);
process.exit(0);
