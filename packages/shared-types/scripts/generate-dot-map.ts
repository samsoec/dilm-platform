import { writeFileSync } from "node:fs";

import { dotMapSvg } from "../src/dot-map";

writeFileSync(
  new URL("../src/dot-map.svg", import.meta.url),
  `${dotMapSvg()}\n`,
);
