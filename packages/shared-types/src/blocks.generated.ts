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
  title: string;
  /**
   * The last part of the address. It can't be empty.
   */
  slug: string;
  /**
   * Leave empty for a top-level page. Only pages of this company are offered.
   */
  parent?: (number | null) | Page;
  /**
   * Worked out from the parent pages and the slug.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  redirectTo: {
    type: "internal" | "external" | "reference";
    newTab?: boolean | null;
    /**
     * Start with /. The site adds the language.
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
      )[]
    | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  breadcrumbs?:
    | {
        doc?: (number | null) | Page;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
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

export interface SharedPage {
  id: number;
  title: string;
  /**
   * The last part of the address. Leave it empty only for Home.
   */
  slug?: string | null;
  /**
   * Leave empty for a top-level page.
   */
  parent?: (number | null) | SharedPage;
  /**
   * Worked out from the parent pages and the slug.
   */
  path?: string | null;
  /**
   * On when a language has no slug of its own and its address uses the English slug.
   */
  slugFallback?: boolean | null;
  redirectTo: {
    type: "internal" | "external" | "reference";
    newTab?: boolean | null;
    /**
     * Start with /. The site adds the language.
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
      )[]
    | null;
  updatedBy?: (number | null) | User;
  trashedBy?: (number | null) | User;
  breadcrumbs?:
    | {
        doc?: (number | null) | SharedPage;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
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

export interface Product {
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
  productGroup?: string | null;
  shortDescription?: string | null;
  image?: (number | null) | Media;
  /**
   * Subscript and superscript only, like H₂SO₄. Pasted bold, italic or links are turned into plain text.
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
        /**
         * Leave empty to use the product's formula. Subscript and superscript only.
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
            format:
              "left" | "start" | "center" | "right" | "end" | "justify" | "";
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
        /**
         * Leave empty to use the product's CAS number.
         */
        casNumber?: string | null;
        /**
         * Leave empty to use the product's classification.
         */
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

export interface Document {
  id: number;
  tenant?: (number | null) | Tenant;
  /**
   * Visitors download the file under this name, with .pdf added.
   */
  title: string;
  downloadName?: string | null;
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
  /**
   * Pick from every company's published products. The order here is the order shown.
   */
  supportingProducts?: (number | Product)[] | null;
  /**
   * Optional. It has to be one of the supporting products. Empty uses the first one.
   */
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
  /**
   * For example Jakarta, Indonesia.
   */
  location?: string | null;
  postedDate?: string | null;
  /**
   * Optional. The job leaves the listings at exactly this date and time, in the time zone chosen beside it (WIB by default). Its page stays reachable without the application form.
   */
  closingDate?: string | null;
  closingDate_tz: "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";
  /**
   * Closed jobs leave the Career listing and job sections. Their page stays reachable, without the application form, so shared links still work.
   */
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
  /**
   * The post's address follows its category. Changing it moves the post and leaves a redirect from the old address.
   */
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
            type: "internal" | "external" | "reference";
            newTab?: boolean | null;
            /**
             * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
      type: "internal" | "external" | "reference";
      newTab?: boolean | null;
      /**
       * Start with /. The site adds the language.
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
          type: "internal" | "external" | "reference";
          newTab?: boolean | null;
          /**
           * Start with /. The site adds the language.
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
   * Built from the main (H2) headings of the text.
   */
  showTableOfContents?: boolean | null;
  tocTitle?: string | null;
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
  lastUpdated?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: "articleHeader";
}
