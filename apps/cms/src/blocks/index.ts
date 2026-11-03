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
import { entityMap } from "./entityMap";
import { groupShowcase } from "./groupShowcase";
import { entityContacts } from "./entityContacts";
import { contactInquiry } from "./contactInquiry";
import { locationMap } from "./locationMap";
import { recordHero } from "./recordHero";
import { productOverview } from "./productOverview";
import { productSpecifications } from "./productSpecifications";
import { productApplications } from "./productApplications";
import { solutionImpact } from "./solutionImpact";
import { solutionApplications } from "./solutionApplications";
import { jobDetail } from "./jobDetail";
import { postArticle } from "./postArticle";
import { publicationHero } from "./publicationHero";
import { postListing } from "./postListing";

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
  entityMap,
  groupShowcase,
  entityContacts,
  contactInquiry,
  locationMap,
  recordHero,
  productOverview,
  productSpecifications,
  productApplications,
  solutionImpact,
  solutionApplications,
  jobDetail,
  postArticle,
  publicationHero,
  postListing,
];
