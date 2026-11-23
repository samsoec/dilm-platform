export interface User {
  id: number;
  name?: string | null;
  roles: ("super-admin" | "tenant-editor" | "tenant-viewer")[];
  lastLoginAt?: string | null;
  invitedBy?: (number | null) | User;
  tenants?:
    | {
        tenant: number | Tenant;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  resetPasswordRequestedAt?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
  collection: "users";
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string;
  defaultLocale: "en" | "id";
  brandColor?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Page {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * A page holds at most 30 sections.
   */
  layout?:
    | (
        | HeroCarouselBlock
        | PageHeroBlock
        | MediaTextBlock
        | FeatureGridBlock
        | VisionMissionBlock
        | TimelineBlock
        | CertificationsBlock
        | CertificateGalleryBlock
        | AwardsBlock
        | ImageCarouselBlock
        | TestimonialsBlock
        | HotspotIllustrationBlock
        | CtaBannerBlock
        | RichTextBlock
        | ArticleHeaderBlock
        | ProductsSolutionsTabsBlock
        | ProductShowcaseBlock
        | SolutionShowcaseBlock
        | PostShowcaseBlock
        | JobListingBlock
        | JobShowcaseBlock
        | IrDocumentsBlock
        | EntityMapBlock
        | GroupShowcaseBlock
        | EntityContactsBlock
        | ContactInquiryBlock
        | LocationMapBlock
        | RecordHeroBlock
        | ProductOverviewBlock
        | ProductSpecificationsBlock
        | ProductApplicationsBlock
        | SolutionImpactBlock
        | SolutionApplicationsBlock
        | JobDetailBlock
        | PostArticleBlock
        | PublicationHeroBlock
        | PostListingBlock
      )[]
    | null;
  title: string;
  /**
   * Leave empty for a top-level page. Only pages of this company are offered.
   */
  parent?: (number | null) | Page;
  /**
   * The last part of the address. It can't be empty.
   */
  slug: string;
  forwards?: boolean | null;
  redirectTo?: {
    type: "reference" | "internal" | "external";
    newTab?: boolean | null;
    /**
     * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
     */
    internalPath?: string | null;
    /**
     * A full address starting with https://
     */
    externalUrl?: string | null;
    /**
     * Follows the page or record if it is renamed or moved. Only published ones are offered.
     */
    reference?:
      | ({
          relationTo: "pages";
          value: number | Page;
        } | null)
      | ({
          relationTo: "shared-pages";
          value: number | SharedPage;
        } | null)
      | ({
          relationTo: "products";
          value: number | Product;
        } | null)
      | ({
          relationTo: "solutions";
          value: number | Solution;
        } | null)
      | ({
          relationTo: "jobs";
          value: number | Job;
        } | null)
      | ({
          relationTo: "posts";
          value: number | Post;
        } | null)
      | ({
          relationTo: "categories";
          value: number | Category;
        } | null);
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: (number | null) | Media;
  };
  breadcrumbs?:
    | {
        doc?: (number | null) | Page;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Worked out from the parent pages and the slug.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface HeroCarouselBlock {
  slides: {
    backgroundImage: number | Media;
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    buttons?:
      | {
          link: {
            type: "reference" | "internal" | "external";
            newTab?: boolean | null;
            /**
             * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
             */
            internalPath?: string | null;
            /**
             * A full address starting with https://
             */
            externalUrl?: string | null;
            /**
             * Follows the page or record if it is renamed or moved. Only published ones are offered.
             */
            reference?:
              | ({
                  relationTo: "pages";
                  value: number | Page;
                } | null)
              | ({
                  relationTo: "shared-pages";
                  value: number | SharedPage;
                } | null)
              | ({
                  relationTo: "products";
                  value: number | Product;
                } | null)
              | ({
                  relationTo: "solutions";
                  value: number | Solution;
                } | null)
              | ({
                  relationTo: "jobs";
                  value: number | Job;
                } | null)
              | ({
                  relationTo: "posts";
                  value: number | Post;
                } | null)
              | ({
                  relationTo: "categories";
                  value: number | Category;
                } | null);
            label?: string | null;
          };
          style: "primary" | "light" | "text";
          id?: string | null;
        }[]
      | null;
    id?: string | null;
  }[];
  stats?:
    | {
        value: string;
        label: string;
        id?: string | null;
      }[]
    | null;
  /**
   * Seconds each slide stays. 0 turns autoplay off.
   */
  autoplaySeconds: number;
  id?: string | null;
  blockName?: string | null;
  blockType: "heroCarousel";
}

export interface Media {
  id: number;
  tenant?: (number | null) | Tenant;
  alt: string;
  uploadedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  prefix?: string | null;
  _objectKey?: string | null;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    "social-share"?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}

export interface SharedPage {
  id: number;
  /**
   * A page holds at most 30 sections.
   */
  layout?:
    | (
        | HeroCarouselBlock
        | PageHeroBlock
        | MediaTextBlock
        | FeatureGridBlock
        | VisionMissionBlock
        | TimelineBlock
        | CertificationsBlock
        | CertificateGalleryBlock
        | AwardsBlock
        | ImageCarouselBlock
        | TestimonialsBlock
        | HotspotIllustrationBlock
        | CtaBannerBlock
        | RichTextBlock
        | ArticleHeaderBlock
        | ProductsSolutionsTabsBlock
        | ProductShowcaseBlock
        | SolutionShowcaseBlock
        | PostShowcaseBlock
        | JobListingBlock
        | JobShowcaseBlock
        | IrDocumentsBlock
        | EntityMapBlock
        | GroupShowcaseBlock
        | EntityContactsBlock
        | ContactInquiryBlock
        | LocationMapBlock
        | RecordHeroBlock
        | ProductOverviewBlock
        | ProductSpecificationsBlock
        | ProductApplicationsBlock
        | SolutionImpactBlock
        | SolutionApplicationsBlock
        | JobDetailBlock
        | PostArticleBlock
        | PublicationHeroBlock
        | PostListingBlock
      )[]
    | null;
  title: string;
  /**
   * Leave empty for a top-level page.
   */
  parent?: (number | null) | SharedPage;
  /**
   * The last part of the address. Leave it empty only for Home.
   */
  slug?: string | null;
  forwards?: boolean | null;
  redirectTo?: {
    type: "reference" | "internal" | "external";
    newTab?: boolean | null;
    /**
     * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
     */
    internalPath?: string | null;
    /**
     * A full address starting with https://
     */
    externalUrl?: string | null;
    /**
     * Follows the page or record if it is renamed or moved. Only published ones are offered.
     */
    reference?:
      | ({
          relationTo: "pages";
          value: number | Page;
        } | null)
      | ({
          relationTo: "shared-pages";
          value: number | SharedPage;
        } | null)
      | ({
          relationTo: "products";
          value: number | Product;
        } | null)
      | ({
          relationTo: "solutions";
          value: number | Solution;
        } | null)
      | ({
          relationTo: "jobs";
          value: number | Job;
        } | null)
      | ({
          relationTo: "posts";
          value: number | Post;
        } | null)
      | ({
          relationTo: "categories";
          value: number | Category;
        } | null);
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: (number | null) | Media;
  };
  breadcrumbs?:
    | {
        doc?: (number | null) | SharedPage;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Worked out from the parent pages and the slug.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface PageHeroBlock {
  backgroundImage: number | Media;
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "pageHero";
}

export interface MediaTextBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  body?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  images: {
    image: number | Media;
    id?: string | null;
  }[];
  imageLayout: "single" | "staggered";
  imagePosition: "right" | "left";
  stats?:
    | {
        value: string;
        label: string;
        id?: string | null;
      }[]
    | null;
  points?:
    | {
        /**
         * SVG or PNG.
         */
        icon?: (number | null) | Media;
        title: string;
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  pointsLayout: "inline" | "grid";
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "mediaText";
}

export interface Product {
  id: number;
  tenant?: (number | null) | Tenant;
  formulaText?: string | null;
  /**
   * The last part of the address. Unique across every company's catalog.
   */
  slug: string;
  /**
   * Worked out from the listing page in Site routing and the slug. The same on every company's website.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  /**
   * Lower numbers come first in lists you sort by hand.
   */
  order?: number | null;
  name: string;
  productGroup?: string | null;
  shortDescription?: string | null;
  image?: (number | null) | Media;
  /**
   * Select a number and press ⌘, for subscript, ⌘. for superscript.
   */
  formula?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  casNumber?: string | null;
  classification?: string | null;
  pdsFile?: (number | null) | Document;
  overview?: {
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    body?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    image?: (number | null) | Media;
  };
  variants?:
    | {
        name: string;
        formula?: {
          root: {
            type: string;
            children: {
              type: any;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ("ltr" | "rtl") | null;
            format:
              "left" | "start" | "center" | "right" | "end" | "justify" | "";
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
        casNumber?: string | null;
        classification?: string | null;
        packaging?: string | null;
        specs?:
          | {
              parameter: string;
              method?: string | null;
              value: string;
              emphasized?: boolean | null;
              id?: string | null;
            }[]
          | null;
        pdsFile?: (number | null) | Document;
        sdsFile?: (number | null) | Document;
        id?: string | null;
      }[]
    | null;
  applications?:
    | {
        /**
         * SVG or PNG.
         */
        icon?: (number | null) | Media;
        title: string;
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  process?: {
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    stat?: {
      value?: string | null;
      label?: string | null;
      description?: string | null;
      note?: string | null;
    };
    steps?:
      | {
          title: string;
          description?: string | null;
          isThisProduct?: boolean | null;
          id?: string | null;
        }[]
      | null;
  };
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: (number | null) | Media;
  };
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface Document {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * Visitors download the file under this name, with .pdf added.
   */
  title: string;
  createdAt: string;
  usedInCount?: number | null;
  linkStatus?: string | null;
  downloadName?: string | null;
  uploadedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  prefix?: string | null;
  _objectKey?: string | null;
  updatedAt: string;
  deletedAt?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}

export interface Solution {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * The last part of the address. Unique across every company's catalog.
   */
  slug: string;
  /**
   * Worked out from the listing page in Site routing and the slug. The same on every company's website.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  /**
   * Lower numbers come first in lists you sort by hand.
   */
  order?: number | null;
  name: string;
  /**
   * Plain or italic only. Leave empty to use the name.
   */
  heroTitle?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  industryLabel?: string | null;
  shortDescription?: string | null;
  image?: (number | null) | Media;
  keyApplications?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  industriesServed?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  supportingProducts?: (number | Product)[] | null;
  featuredProduct?: (number | null) | Product;
  impact?: {
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    body?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    points?:
      | {
          /**
           * SVG or PNG.
           */
          icon?: (number | null) | Media;
          title: string;
          description?: string | null;
          id?: string | null;
        }[]
      | null;
    image?: (number | null) | Media;
  };
  applications?:
    | {
        title: string;
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  meta?: {
    title?: string | null;
    description?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (number | null) | Media;
  };
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface Job {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * The last part of the address, under the career page. Unique within this company.
   */
  slug: string;
  /**
   * Worked out from the career page in Site routing and the slug.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  /**
   * Lower numbers come first in lists you sort by hand.
   */
  order?: number | null;
  title: string;
  summary?: string | null;
  department?: string | null;
  experienceLevel?: ("entry" | "mid" | "senior" | "lead") | null;
  jobType?: ("full-time" | "part-time" | "contract" | "internship") | null;
  location?: string | null;
  /**
   * Defaults to today.
   */
  postedDate?: string | null;
  /**
   * After this date it leaves the listing automatically. The time is in the time zone chosen beside it (WIB by default).
   */
  closingDate?: string | null;
  closingDate_tz: "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";
  status: "open" | "closed";
  body?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  meta?: {
    title?: string | null;
    description?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (number | null) | Media;
  };
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface Post {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * The last part of the address, after the category. Unique within this company.
   */
  slug: string;
  /**
   * Worked out from the primary category and the slug. It changes when either changes.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  /**
   * Lower numbers come first in lists you sort by hand.
   */
  order?: number | null;
  title: string;
  primaryCategory: number | Category;
  publishedAt?: string | null;
  coverImage?: (number | null) | Media;
  excerpt?: string | null;
  body?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  meta?: {
    title?: string | null;
    description?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (number | null) | Media;
  };
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  _status?: ("draft" | "published") | null;
}

export interface Category {
  id: number;
  /**
   * The last part of the address, after the category prefix. Unique across categories.
   */
  slug?: string | null;
  /**
   * The category prefix and the slug. The same on every company's website.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  name?: string | null;
  description?: string | null;
  coverImage?: (number | null) | Media;
  updatedAt: string;
  createdAt: string;
}

export interface FeatureGridBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  headingButtons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  topImage?: (number | null) | Media;
  /**
   * Limit reached: the grid fits 12 items. Numbers (01, 02…) are computed from the order, so there's no marker field.
   */
  items: {
    /**
     * SVG or PNG.
     */
    icon?: (number | null) | Media;
    marker?: string | null;
    eyebrow?: string | null;
    title: string;
    description?: string | null;
    id?: string | null;
  }[];
  markerStyle: "icon" | "number" | "letter" | "none";
  cardStyle: "card" | "plain";
  columns: "3" | "4";
  bottomImage?: (number | null) | Media;
  /**
   * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
   */
  quote?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  footerButtons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "featureGrid";
}

export interface VisionMissionBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  vision?: {
    title?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    statement?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
  };
  mission: {
    title?: string | null;
    items: {
      text: string;
      id?: string | null;
    }[];
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "visionMission";
}

export interface TimelineBlock {
  variant: "summary" | "detailed";
  heading?: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  banner?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    periodLabel?: string | null;
  };
  entries: {
    year: string;
    title?: string | null;
    description?: string | null;
    events?:
      | {
          dateLabel: string;
          description: string;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
  }[];
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "timeline";
}

export interface CertificationsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  variant: "logos" | "cards";
  layout: "grid" | "carousel";
  items: {
    logo: number | Media;
    code?: string | null;
    title?: string | null;
    description?: string | null;
    certificateImages?:
      | {
          image: number | Media;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
  }[];
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "certifications";
}

export interface CertificateGalleryBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  badge?: (number | null) | Media;
  items: {
    image: number | Media;
    caption?: string | null;
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "certificateGallery";
}

export interface AwardsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  items: {
    image?: (number | null) | Media;
    year?: string | null;
    title: string;
    description?: string | null;
    issuer?: string | null;
    id?: string | null;
  }[];
  /**
   * How many awards show before the page buttons.
   */
  pageSize: number;
  id?: string | null;
  blockName?: string | null;
  blockType: "awards";
}

export interface ImageCarouselBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  items: {
    image: number | Media;
    label: string;
    link: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
    };
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "imageCarousel";
}

export interface TestimonialsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  logos?:
    | {
        image: number | Media;
        /**
         * Read aloud as the logo's alt text.
         */
        name: string;
        id?: string | null;
      }[]
    | null;
  items?:
    | {
        quote: string;
        name: string;
        role?: string | null;
        avatar?: (number | null) | Media;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "testimonials";
}

export interface HotspotIllustrationBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  image: number | Media;
  hotspots: {
    tone: "green" | "orange" | "navy";
    /**
     * Distance from the left edge, 0 to 100 (%).
     */
    x: number;
    /**
     * Distance from the top edge, 0 to 100 (%).
     */
    y: number;
    eyebrow?: string | null;
    title: string;
    description?: string | null;
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "hotspotIllustration";
}

export interface CtaBannerBlock {
  title?: string | null;
  description?: string | null;
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "ctaBanner";
}

export interface RichTextBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  body: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ("ltr" | "rtl") | null;
      format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  /**
   * Built from the H2 headings below
   */
  showTableOfContents?: boolean | null;
  tocTitle?: string | null;
  tocAnchors?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "richText";
}

export interface ArticleHeaderBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  metaLabel?: string | null;
  lastUpdatedLabel?: string | null;
  lastUpdated: string;
  textStamp?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "articleHeader";
}

export interface ProductsSolutionsTabsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  solutionsTab: {
    label: string;
    /**
     * Published solutions from every company. The order here is the order on the page.
     */
    items: (number | Solution)[];
  };
  productsTab: {
    label: string;
    /**
     * Published products from every company. The order here is the order on the page.
     */
    items: (number | Product)[];
  };
  /**
   * The tab that is open when the page loads.
   */
  defaultTab: "solutions" | "products";
  ctaCard: {
    text?: string | null;
    link: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
  };
  bottomCta: {
    title?: string | null;
    description?: string | null;
    first: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    firstStyle: "primary" | "light" | "text";
    second: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    secondStyle: "primary" | "light" | "text";
  };
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "productsSolutionsTabs";
}

export interface ProductShowcaseBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  source: "manual" | "all";
  items?: (number | Product)[] | null;
  cardStyle: "imageOverlay" | "imageCard" | "textCard";
  ctaCard: {
    text?: string | null;
    link: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
  };
  bottomCta: {
    title?: string | null;
    description?: string | null;
    first: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    firstStyle: "primary" | "light" | "text";
    second: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    secondStyle: "primary" | "light" | "text";
  };
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "productShowcase";
}

export interface SolutionShowcaseBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  source: "manual" | "all";
  items?: (number | Solution)[] | null;
  cardStyle: "imageCard" | "textCard" | "imageTitle";
  ctaCard: {
    text?: string | null;
    link: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
  };
  bottomCta: {
    title?: string | null;
    description?: string | null;
    first: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    firstStyle: "primary" | "light" | "text";
    second: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    secondStyle: "primary" | "light" | "text";
  };
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "solutionShowcase";
}

export interface PostShowcaseBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  source: "manual" | "latest";
  items?:
    | {
        /**
         * Published posts only; a post card links to that post.
         */
        doc:
          | {
              relationTo: "posts";
              value: number | Post;
            }
          | {
              relationTo: "categories";
              value: number | Category;
            };
        eyebrow?: string | null;
        title?: string | null;
        description?: string | null;
        image?: (number | null) | Media;
        id?: string | null;
      }[]
    | null;
  /**
   * Leave empty to use posts from every category.
   */
  categories?: (number | Category)[] | null;
  limit?: number | null;
  layout: "carousel" | "overlay" | "featured";
  cardEyebrow: "category" | "entity";
  readMoreLabel?: string | null;
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "postShowcase";
}

export interface JobListingBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  filters?: {
    search?: boolean | null;
    department?: boolean | null;
    location?: boolean | null;
    jobType?: boolean | null;
  };
  searchPlaceholder?: string | null;
  /**
   * How many jobs show per page.
   */
  pageSize: number;
  emptyText?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "jobListing";
}

export interface JobShowcaseBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  source: "manual" | "latest";
  items?: (number | Job)[] | null;
  limit?: number | null;
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  appearance: {
    background: "default" | "muted" | "dark" | "image";
    backgroundImage?: (number | null) | Media;
    /**
     * Optional in-page anchor: lowercase letters, numbers and hyphens.
     */
    anchorId?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "jobShowcase";
}

export interface IrDocumentsBlock {
  sideNav?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        id?: string | null;
      }[]
    | null;
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  /**
   * Leave empty to show every type.
   */
  documentTypes?:
    | (
        | "annual-report"
        | "financial-statement"
        | "sustainability-report"
        | "public-disclosure"
        | "shareholder-meeting"
        | "prospectus"
      )[]
    | null;
  /**
   * How many documents show per page.
   */
  pageSize: number;
  id?: string | null;
  blockName?: string | null;
  blockType: "irDocuments";
}

export interface EntityMapBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  cards: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    badges?:
      | {
          text: string;
          id?: string | null;
        }[]
      | null;
    image?: (number | null) | Media;
    buttons?:
      | {
          link: {
            type: "reference" | "internal" | "external";
            newTab?: boolean | null;
            /**
             * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
             */
            internalPath?: string | null;
            /**
             * A full address starting with https://
             */
            externalUrl?: string | null;
            /**
             * Follows the page or record if it is renamed or moved. Only published ones are offered.
             */
            reference?:
              | ({
                  relationTo: "pages";
                  value: number | Page;
                } | null)
              | ({
                  relationTo: "shared-pages";
                  value: number | SharedPage;
                } | null)
              | ({
                  relationTo: "products";
                  value: number | Product;
                } | null)
              | ({
                  relationTo: "solutions";
                  value: number | Solution;
                } | null)
              | ({
                  relationTo: "jobs";
                  value: number | Job;
                } | null)
              | ({
                  relationTo: "posts";
                  value: number | Post;
                } | null)
              | ({
                  relationTo: "categories";
                  value: number | Category;
                } | null);
            label?: string | null;
          };
          style: "primary" | "light" | "text";
          id?: string | null;
        }[]
      | null;
    position: "left" | "right" | "bottom";
    /**
     * Provinces highlighted on the map. Leave empty for the Other areas case: nothing highlighted and the map stays zoomed out.
     */
    areas?:
      | (
          | "ID-AC"
          | "ID-SU"
          | "ID-SB"
          | "ID-RI"
          | "ID-KR"
          | "ID-JA"
          | "ID-SS"
          | "ID-BB"
          | "ID-BE"
          | "ID-LA"
          | "ID-JK"
          | "ID-JB"
          | "ID-BT"
          | "ID-JT"
          | "ID-YO"
          | "ID-JI"
          | "ID-BA"
          | "ID-NB"
          | "ID-NT"
          | "ID-KB"
          | "ID-KT"
          | "ID-KS"
          | "ID-KI"
          | "ID-KU"
          | "ID-SA"
          | "ID-GO"
          | "ID-ST"
          | "ID-SR"
          | "ID-SN"
          | "ID-SG"
          | "ID-MA"
          | "ID-MU"
          | "ID-PB"
          | "ID-PD"
          | "ID-PA"
          | "ID-PT"
          | "ID-PE"
          | "ID-PS"
        )[]
      | null;
    id?: string | null;
  }[];
  items?:
    | {
        entity?: (number | null) | Tenant;
        image?: (number | null) | Media;
        label?: string | null;
        title?: string | null;
        description?: string | null;
        regions?:
          | {
              name: string;
              id?: string | null;
            }[]
          | null;
        pin?: {
          x?: number | null;
          y?: number | null;
        };
        buttons?:
          | {
              link: {
                type: "reference" | "internal" | "external";
                newTab?: boolean | null;
                /**
                 * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
                 */
                internalPath?: string | null;
                /**
                 * A full address starting with https://
                 */
                externalUrl?: string | null;
                /**
                 * Follows the page or record if it is renamed or moved. Only published ones are offered.
                 */
                reference?:
                  | ({
                      relationTo: "pages";
                      value: number | Page;
                    } | null)
                  | ({
                      relationTo: "shared-pages";
                      value: number | SharedPage;
                    } | null)
                  | ({
                      relationTo: "products";
                      value: number | Product;
                    } | null)
                  | ({
                      relationTo: "solutions";
                      value: number | Solution;
                    } | null)
                  | ({
                      relationTo: "jobs";
                      value: number | Job;
                    } | null)
                  | ({
                      relationTo: "posts";
                      value: number | Post;
                    } | null)
                  | ({
                      relationTo: "categories";
                      value: number | Category;
                    } | null);
                label?: string | null;
              };
              style: "primary" | "light" | "text";
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "entityMap";
}

export interface GroupShowcaseBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  mainImage?: (number | null) | Media;
  mainLogo?: (number | null) | Media;
  mainLink: {
    type: "reference" | "internal" | "external";
    newTab?: boolean | null;
    /**
     * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
     */
    internalPath?: string | null;
    /**
     * A full address starting with https://
     */
    externalUrl?: string | null;
    /**
     * Follows the page or record if it is renamed or moved. Only published ones are offered.
     */
    reference?:
      | ({
          relationTo: "pages";
          value: number | Page;
        } | null)
      | ({
          relationTo: "shared-pages";
          value: number | SharedPage;
        } | null)
      | ({
          relationTo: "products";
          value: number | Product;
        } | null)
      | ({
          relationTo: "solutions";
          value: number | Solution;
        } | null)
      | ({
          relationTo: "jobs";
          value: number | Job;
        } | null)
      | ({
          relationTo: "posts";
          value: number | Post;
        } | null)
      | ({
          relationTo: "categories";
          value: number | Category;
        } | null);
    label?: string | null;
  };
  /**
   * In the order shown. Each tile uses the company's cover image and light logo; names use its legal name. Edit those in Company settings.
   */
  entities: (number | Tenant)[];
  id?: string | null;
  blockName?: string | null;
  blockType: "groupShowcase";
}

export interface EntityContactsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  source: "others" | "manual";
  entities?: (number | Tenant)[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "entityContacts";
}

export interface ContactInquiryBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  form: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    /**
     * The fields are fixed under UU PDP (data minimisation). You can change their wording, not add, remove or make them optional.
     */
    fields: {
      /**
       * The field stays on the form and stays required.
       */
      fullName: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      company: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      workEmail: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      phone: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      message: {
        label: string;
        placeholder?: string | null;
      };
    };
    /**
     * Shown beside the checkbox visitors must tick. Must link to the company's Privacy Policy (UU PDP). Needed in every language to publish; saving a draft works without it.
     */
    consentText?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    privacyPolicyVersion?: string | null;
    submitLabel?: string | null;
    successMessage?: string | null;
    errorMessage?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "contactInquiry";
}

export interface LocationMapBlock {
  /**
   * Leave empty to show the company of the site the page is viewed on.
   */
  entity?: (number | null) | Tenant;
  linkLabel?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "locationMap";
}

export interface RecordHeroBlock {
  /**
   * The last crumb, for example Detail Product. The first crumb is the record's list page; on posts it is the Publication page.
   */
  currentLabel?: string | null;
  /**
   * One label for each fact in the row. Each record type shows its own facts; the facts themselves come from the record.
   */
  metaLabels?: {
    formula?: string | null;
    casNumber?: string | null;
    totalVariants?: string | null;
    classification?: string | null;
    keyApplications?: string | null;
    supportingProducts?: string | null;
    industriesServed?: string | null;
    department?: string | null;
    experience?: string | null;
    jobType?: string | null;
    location?: string | null;
    postedDate?: string | null;
    category?: string | null;
    publishedDate?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "recordHero";
}

export interface ProductOverviewBlock {
  eyebrow?: string | null;
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  /**
   * Hidden when the product has no data sheet.
   */
  pdsLabel?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "productOverview";
}

export interface ProductSpecificationsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  columnLabels?: {
    parameter?: string | null;
    method?: string | null;
    value?: string | null;
  };
  sideLabels?: {
    formula?: string | null;
    casNumber?: string | null;
    classification?: string | null;
    packaging?: string | null;
  };
  /**
   * Leave the link empty to hide the button.
   */
  contact: {
    link: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    style: "primary" | "light" | "text";
  };
  pdsLabel?: string | null;
  sdsLabel?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "productSpecifications";
}

export interface ProductApplicationsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "productApplications";
}

export interface SolutionImpactBlock {
  eyebrow?: string | null;
  buttons?:
    | {
        link: {
          type: "reference" | "internal" | "external";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
           */
          internalPath?: string | null;
          /**
           * A full address starting with https://
           */
          externalUrl?: string | null;
          /**
           * Follows the page or record if it is renamed or moved. Only published ones are offered.
           */
          reference?:
            | ({
                relationTo: "pages";
                value: number | Page;
              } | null)
            | ({
                relationTo: "shared-pages";
                value: number | SharedPage;
              } | null)
            | ({
                relationTo: "products";
                value: number | Product;
              } | null)
            | ({
                relationTo: "solutions";
                value: number | Solution;
              } | null)
            | ({
                relationTo: "jobs";
                value: number | Job;
              } | null)
            | ({
                relationTo: "posts";
                value: number | Post;
              } | null)
            | ({
                relationTo: "categories";
                value: number | Category;
              } | null);
          label?: string | null;
        };
        style: "primary" | "light" | "text";
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "solutionImpact";
}

export interface SolutionApplicationsBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  productsHeading?: {
    title?: string | null;
    description?: string | null;
  };
  featuredLabels?: {
    productName?: string | null;
    formula?: string | null;
    casNumber?: string | null;
    variants?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "solutionApplications";
}

export interface JobDetailBlock {
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  form: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    /**
     * The fields are fixed under UU PDP (data minimisation). You can change their wording, not add, remove or make them optional.
     */
    fields: {
      /**
       * The field stays on the form and stays required.
       */
      fullName: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      email: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      phone: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      coverLetter: {
        label: string;
        placeholder?: string | null;
      };
      /**
       * The field stays on the form and stays required.
       */
      resume: {
        label: string;
        placeholder?: string | null;
      };
    };
    /**
     * Shown beside the checkbox visitors must tick. Must link to the company's Privacy Policy (UU PDP). Needed in every language to publish; saving a draft works without it.
     */
    consentText?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    privacyPolicyVersion?: string | null;
    submitLabel?: string | null;
    successMessage?: string | null;
    errorMessage?: string | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "jobDetail";
}

export interface PostArticleBlock {
  /**
   * The same list shows on every post of the company. The post being read is left out of it.
   */
  highlights?: {
    title?: string | null;
    /**
     * Up to 5 published posts of this company.
     */
    items?: (number | Post)[] | null;
  };
  previousLabel?: string | null;
  nextLabel?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "postArticle";
}

export interface PublicationHeroBlock {
  backgroundImage: number | Media;
  heading: {
    eyebrow?: string | null;
    /**
     * Plain or italic only, to emphasise a word. Pasted bold, links or lists are turned into plain text.
     */
    title?: {
      root: {
        type: string;
        children: {
          type: any;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ("ltr" | "rtl") | null;
        format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    description?: string | null;
    align: "center" | "left" | "split";
  };
  searchPlaceholder?: string | null;
  searchLabel?: string | null;
  allLabel?: string | null;
  /**
   * Shown after the All tab, in this order. Drag to reorder. The active tab is the category in context, otherwise All.
   */
  categories?: (number | Category)[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "publicationHero";
}

export interface PostListingBlock {
  /**
   * Which posts the list is drawn from. "This category" is for the Category template. Anywhere else it shows nothing; it does not stop you saving or publishing.
   */
  source: "all" | "currentCategory" | "categories";
  categories?: (number | Category)[] | null;
  /**
   * Empty uses the newest post. Hidden while searching.
   */
  featured?: (number | null) | Post;
  /**
   * How many posts show per page.
   */
  pageSize: number;
  /**
   * {count} = number of matching posts, {query} = what the visitor typed. Sample: Showing 12 results for "alum".
   */
  resultsLabel?: string | null;
  emptyState: {
    /**
     * {query} = what the visitor typed. No other placeholder works here.
     */
    title?: string | null;
    description?: string | null;
    button: {
      type: "reference" | "internal" | "external";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language. Typed paths don't follow renames. Pick the page instead if you can.
       */
      internalPath?: string | null;
      /**
       * A full address starting with https://
       */
      externalUrl?: string | null;
      /**
       * Follows the page or record if it is renamed or moved. Only published ones are offered.
       */
      reference?:
        | ({
            relationTo: "pages";
            value: number | Page;
          } | null)
        | ({
            relationTo: "shared-pages";
            value: number | SharedPage;
          } | null)
        | ({
            relationTo: "products";
            value: number | Product;
          } | null)
        | ({
            relationTo: "solutions";
            value: number | Solution;
          } | null)
        | ({
            relationTo: "jobs";
            value: number | Job;
          } | null)
        | ({
            relationTo: "posts";
            value: number | Post;
          } | null)
        | ({
            relationTo: "categories";
            value: number | Category;
          } | null);
      label?: string | null;
    };
    buttonStyle: "primary" | "light" | "text";
  };
  /**
   * An optional title and up to 5 hand-picked posts, shown as a numbered side list. It stays while a visitor searches.
   */
  highlights?: {
    title?: string | null;
    /**
     * Up to 5 published posts of this company.
     */
    items?: (number | Post)[] | null;
  };
  id?: string | null;
  blockName?: string | null;
  blockType: "postListing";
}
