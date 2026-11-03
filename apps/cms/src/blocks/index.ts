import type { Block } from "payload";

import { heroCarousel } from "./heroCarousel";
import { pageHero } from "./pageHero";
import { mediaText } from "./mediaText";
import { featureGrid } from "./featureGrid";
import { visionMission } from "./visionMission";
import { timeline } from "./timeline";

export {
  sectionBlock,
  type BlockCatalog,
  type SectionBlockConfig,
} from "./sectionBlock";

export const pageBlocks: Block[] = [
  heroCarousel,
  pageHero,
  mediaText,
  featureGrid,
  visionMission,
  timeline,
];
