import type { Block } from "payload";

import { heroCarousel } from "./heroCarousel";
import { pageHero } from "./pageHero";
import { mediaText } from "./mediaText";
import { featureGrid } from "./featureGrid";
import { visionMission } from "./visionMission";
import { timeline } from "./timeline";
import { certifications } from "./certifications";
import { certificateGallery } from "./certificateGallery";
import { awards } from "./awards";
import { imageCarousel } from "./imageCarousel";
import { testimonials } from "./testimonials";
import { hotspotIllustration } from "./hotspotIllustration";
import { ctaBanner } from "./ctaBanner";
import { richText } from "./richText";
import { articleHeader } from "./articleHeader";
import { productsSolutionsTabs } from "./productsSolutionsTabs";
import { productShowcase } from "./productShowcase";
import { solutionShowcase } from "./solutionShowcase";
import { postShowcase } from "./postShowcase";
import { jobListing } from "./jobListing";
import { jobShowcase } from "./jobShowcase";
import { irDocuments } from "./irDocuments";

export { bottomCtaField, ctaBannerFields } from "./ctaBanner";

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
  certifications,
  certificateGallery,
  awards,
  imageCarousel,
  testimonials,
  hotspotIllustration,
  ctaBanner,
  richText,
  articleHeader,
  productsSolutionsTabs,
  productShowcase,
  solutionShowcase,
  postShowcase,
  jobListing,
  jobShowcase,
  irDocuments,
];
