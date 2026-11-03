import { TENANT_NAMES, type TenantSlug } from "@dilm/shared-types";

import { MAX_CAROUSEL_ITEMS } from "../blocks/imageCarousel";
import type {
  DetailTemplate,
  Page,
  RichTextBlock,
  SiteMessage,
} from "../payload-types";

export type Lexical = NonNullable<RichTextBlock["body"]>;

export type PageBlock = NonNullable<Page["layout"]>[number];

export type TemplateBlock = NonNullable<DetailTemplate["layout"]>[number];

type Link = {
  type: "internal" | "external";
  newTab: boolean;
  internalPath?: string;
  externalUrl?: string;
  label: string;
};

type ButtonStyle = "primary" | "light" | "text";

type Align = "center" | "left" | "split";

export type SeedContext = {
  image: number;
  tenants: Record<TenantSlug, number>;
  categories: Record<CategorySlug, number>;
  tenant?: TenantSlug;
};

export const CATEGORY_SEED = [
  { slug: "company-news", name: "Company News" },
  { slug: "events-and-activities", name: "Events & Activities" },
  { slug: "sustainability", name: "Sustainability" },
] as const;

export type CategorySlug = (typeof CATEGORY_SEED)[number]["slug"];

export const CONTACTS: Record<
  TenantSlug,
  { address: string; email: string; phone: string }
> = {
  duniakimia: {
    address:
      "JL. Raya Palembang-Indralaya KM 24, Desa Pulau Semambu, Kecamatan Indralaya Utara, Kabupaten Ogan Ilir, Provinsi Sumatera Selatan, 30862, Indonesia",
    email: "product-area.dku@dilmgroup.com",
    phone: "(+62) 711-311-772",
  },
  indoacid: {
    address:
      "JL. Raya Bekasi KM 21, Kelurahan Rawa Terate, Kecamatan Cakung, Kota Adm Jakarta Timur, Provinsi DKI Jakarta, 13920, Indonesia",
    email: "product-area.iai@dilmgroup.com",
    phone: "021-4602203",
  },
  likutelaga: {
    address:
      "JL. Raya Sukomulyo KM 24, Kecamatan Manyar, Kabupaten Gresik, Provinsi Jawa Timur, 61151, Indonesia",
    email: "product-area.ltg@dilmgroup.com",
    phone: "(+62) 313-951-670 / (+62) 313-951-669",
  },
};

export function legalName(tenant: TenantSlug): string {
  return tenant === "likutelaga"
    ? "PT Liku Telaga"
    : tenant === "indoacid"
      ? "PT Indonesian Acids Industry"
      : "PT Dunia Kimia Utama";
}

function text(value: string) {
  return {
    type: "text",
    version: 1,
    text: value,
    format: 0,
    style: "",
    mode: "normal",
    detail: 0,
  };
}

function paragraph(children: unknown[]) {
  return {
    type: "paragraph",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    children,
  };
}

function lexical(children: unknown[]) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children,
    },
  } as unknown as Lexical;
}

export function plain(value: string): Lexical {
  return lexical([paragraph([text(value)])]);
}

export function paragraphs(values: string[]): Lexical {
  return lexical(values.map((value) => paragraph([text(value)])));
}

function heading2(value: string) {
  return {
    type: "heading",
    tag: "h2",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [text(value)],
  };
}

export function sections(
  parts: { heading: string; body: string[] }[],
): Lexical {
  return lexical(
    parts.flatMap(({ heading, body }) => [
      heading2(heading),
      ...body.map((value) => paragraph([text(value)])),
    ]),
  );
}

export function cookieBody(cookiePolicyId: number): SiteMessageBody {
  return lexical([
    paragraph([
      text(
        "We use cookies to ensure our website functions properly and, with your permission, to understand how visitors use our website. Learn more in our ",
      ),
      {
        type: "link",
        version: 3,
        direction: "ltr",
        format: "",
        indent: 0,
        fields: {
          linkType: "internal",
          newTab: false,
          doc: { relationTo: "pages", value: cookiePolicyId },
        },
        children: [text("Cookie Policy")],
      },
      text("."),
    ]),
  ]) as SiteMessageBody;
}

type SiteMessageBody = NonNullable<
  NonNullable<SiteMessage["cookieBanner"]>["body"]
>;

function link(label: string, path: string): Link {
  return { type: "internal", newTab: false, internalPath: path, label };
}

function external(label: string, url: string): Link {
  return { type: "external", newTab: false, externalUrl: url, label };
}

function button(label: string, path: string, style: ButtonStyle = "primary") {
  return { link: link(label, path), style };
}

function head(
  eyebrow: string | undefined,
  title: string | undefined,
  description: string | undefined,
  align: Align = "center",
) {
  return {
    eyebrow,
    title: title ? plain(title) : undefined,
    description,
    align,
  };
}

const PLAIN = { background: "default" as const };

const MUTED = { background: "muted" as const };

function onImage(image: number) {
  return { background: "image" as const, backgroundImage: image };
}

const NO_CTA = { link: { type: "internal" as const, newTab: false } };

function hero(
  ctx: SeedContext,
  eyebrow: string,
  title: string,
  description: string,
): PageBlock {
  return {
    blockType: "pageHero",
    backgroundImage: ctx.image,
    heading: head(eyebrow, title, description),
  };
}

function certificationLogos(ctx: SeedContext): PageBlock {
  return {
    blockType: "certifications",
    heading: head(
      "CERTIFICATIONS",
      "Standards That Define Our Excellence",
      "We adhere to internationally recognized standards to ensure quality, safety, and operational excellence across our processes.",
    ),
    buttons: [
      button(
        "View Our Certifications",
        "/about-us/awards-and-certifications",
        "text",
      ),
    ],
    variant: "logos",
    layout: "grid",
    items: ["ISO 9001", "ISO 14001", "ISO 45001", "SMK3"].map((title) => ({
      logo: ctx.image,
      title,
    })),
    appearance: PLAIN,
  };
}

function groupShowcase(ctx: SeedContext): PageBlock {
  return {
    blockType: "groupShowcase",
    heading: head(
      "OUR GROUP",
      "Growing Together with Lautan Luas",
      `As part of the Lautan Luas business ecosystem, ${TENANT_NAMES.duniakimia} stands alongside ${TENANT_NAMES.indoacid} and ${TENANT_NAMES.likutelaga}, combining complementary capabilities to support diverse industrial needs.`,
      "left",
    ),
    mainLink: NO_CTA.link,
    entities: [
      ctx.tenants.duniakimia,
      ctx.tenants.indoacid,
      ctx.tenants.likutelaga,
    ],
  };
}

const SECTORS = [
  "Chemical",
  "Bleaching Earth",
  "FMCG",
  "Battery",
  "Feed",
  "Textile",
  "Tire & Rubber",
  "Paper",
  "Fertilizer",
  "Metal",
  "Carrageenan",
  "Plantation",
  "Oil & Gas",
  "Power & Energy",
  "Water Treatment",
  "Mining",
  "Agrochemical",
  "Aluminium",
  "Essential Oil",
  "Construction",
  "Electronics",
  "Plastic & Polymer",
  "Retail",
  "Automotive",
  "Lubricant",
  "Wastewater Treatment",
  "Asphalt",
  "Leather",
];

const WHY_POINTS = [
  [
    "Industry Expertise",
    "Experience across diverse chemical and industrial applications.",
  ],
  [
    "Reliable Supply",
    "Supporting customers with dependable products and distribution.",
  ],
  [
    "Integrated Capabilities",
    "Connecting products, solutions, and expertise across our ecosystem.",
  ],
  [
    "Quality & Compliance",
    "Committed to consistent standards across our operations.",
  ],
] as const;

const DEFAULT_PAGE_SIZE = 10;

export function homeLayout(ctx: SeedContext): PageBlock[] {
  return [
    {
      blockType: "heroCarousel",
      slides: [
        {
          backgroundImage: ctx.image,
          eyebrow: "CHEMISTRY FOR A BETTER FUTURE",
          title: plain("Supporting Growth Through Essential Chemistry"),
          description:
            "Providing essential chemical solutions that support industries, agriculture, and the development of a more sustainable future.",
          buttons: [
            button(
              "Explore Our Solutions",
              "/products-and-solutions/solutions",
              "primary",
            ),
            button("Discover Our Company", "/about-us/overview", "light"),
          ],
        },
      ],
      stats: [
        { value: "50+", label: "Years of industry experience" },
        { value: "350+", label: "Supported industries" },
        { value: "24+", label: "Regions linked by our network" },
        { value: "99%", label: "Client satisfaction" },
      ],
      autoplaySeconds: 6,
    },
    {
      blockType: "mediaText",
      heading: head(
        "Why Choose Us",
        "50+ Years of Precision and Industrial Reliability",
        "We are an innovative chemical company committed to quality products and effective solutions, prioritizing safety and collaboration to meet today's industrial needs.",
        "left",
      ),
      images: [{ image: ctx.image }, { image: ctx.image }],
      imageLayout: "staggered",
      imagePosition: "right",
      points: WHY_POINTS.map(([title, description]) => ({
        title,
        description,
      })),
      pointsLayout: "grid",
      buttons: [button("View About Us", "/about-us/overview")],
      appearance: PLAIN,
    },
    {
      blockType: "entityMap",
      heading: head(
        "OUR BUSINESS NETWORK",
        "Find the Right Business for Your Region",
        undefined,
      ),
      items: [
        {
          entity: ctx.tenants.duniakimia,
          label: "Chemical Hub in Sumatra",
          title: TENANT_NAMES.duniakimia,
          description:
            "Supporting water treatment, mining, and manufacturing with essential chemicals produced from its Sumatra operations.",
          regions: [{ name: "All Sumatra" }],
          buttons: [
            button("Contact Us", "/contact-us"),
            button(
              "Explore Products",
              "/products-and-solutions/products",
              "text",
            ),
          ],
        },
        { entity: ctx.tenants.indoacid },
        { entity: ctx.tenants.likutelaga },
      ],
    },
    {
      blockType: "productsSolutionsTabs",
      heading: head(
        "Products & Solutions",
        "Solutions Built Around Your Business Needs",
        "Explore our national footprint across Indonesia and discover the specialized entity operating in your regional industrial corridor.",
      ),
      solutionsTab: { label: "Our Solutions", items: [] },
      productsTab: { label: "Our Products", items: [] },
      defaultTab: "solutions",
      ctaCard: {
        text: "Discover how our solutions, skills, and offerings integrate seamlessly.",
        link: link(
          "Explore Our Solutions",
          "/products-and-solutions/solutions",
        ),
      },
      bottomCta: {
        title: "Looking for something specific?",
        description:
          "Tell us your target chemical formula or application need, and our specialists will route your brief to the right entity.",
        first: link("Contact Us", "/contact-us"),
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: PLAIN,
    },
    certificationLogos(ctx),
    {
      blockType: "imageCarousel",
      heading: head(
        "INDUSTRY SECTORS",
        "Industries We Serve",
        "Our chemical products and solutions support diverse industries, helping businesses meet their operational and production needs.",
      ),
      items: SECTORS.slice(0, MAX_CAROUSEL_ITEMS).map((label) => ({
        image: ctx.image,
        label,
        link: link(label, "/products-and-solutions/solutions"),
      })),
    },
    groupShowcase(ctx),
    {
      blockType: "postShowcase",
      heading: head(
        "ENVIRONMENTAL RESPONSIBILITY",
        "Operating With Care for the Environment",
        "Through responsible practices and continuous improvement, we strive to use resources more efficiently and support environmental protection.",
        "left",
      ),
      buttons: [button("View Our Sustainability", "/sustainability", "light")],
      source: "latest",
      limit: 3,
      layout: "overlay",
      cardEyebrow: "entity",
      appearance: onImage(ctx.image),
    },
    {
      blockType: "mediaText",
      heading: head(
        "Vision & Mission",
        "Our Direction Forward",
        "Our vision and mission guide how we create value for our customers, industries, and the communities we serve.",
        "left",
      ),
      images: [{ image: ctx.image }],
      imageLayout: "single",
      imagePosition: "left",
      pointsLayout: "inline",
      buttons: [button("View Our Vision & Mission", "/about-us/overview")],
      appearance: PLAIN,
    },
    {
      blockType: "postShowcase",
      heading: head(
        "our development",
        "What's Moving Our Business Forward",
        undefined,
        "left",
      ),
      buttons: [button("View All Insights", "/publication", "text")],
      source: "latest",
      limit: 5,
      layout: "carousel",
      cardEyebrow: "category",
      appearance: PLAIN,
    },
  ];
}

export function productsLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "Our Products",
      "Chemical Products for Diverse Industrial Needs",
      "Our products and solutions are engineered to deliver reliability, efficiency, and long-term value across diverse industrial applications.",
    ),
    {
      blockType: "productShowcase",
      heading: head(
        "Featured Products",
        "Essential Chemicals for Diverse Industries",
        "Explore our featured chemical products, including Sulfuric Acid, Aluminium Sulfate, and Sodium Silicate, supporting a wide range of industrial processes and applications.",
      ),
      source: "all",
      cardStyle: "imageOverlay",
      ctaCard: NO_CTA,
      bottomCta: {
        first: { type: "internal", newTab: false },
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: PLAIN,
    },
    {
      blockType: "productShowcase",
      heading: head(
        "OUR PRODUCTS",
        "Chemical Products Across Industries",
        "Explore a combined portfolio from three companies, offering chemical products for diverse industrial applications.",
      ),
      source: "all",
      cardStyle: "imageCard",
      ctaCard: NO_CTA,
      bottomCta: {
        first: { type: "internal", newTab: false },
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: MUTED,
    },
    certificationLogos(ctx),
    {
      blockType: "solutionShowcase",
      heading: head(
        "INDUSTRIES WE SERVE",
        "Supporting Industries Through Chemistry",
        "Our products support a wide range of industries and applications, helping businesses meet their operational and manufacturing needs.",
      ),
      source: "all",
      cardStyle: "textCard",
      ctaCard: {
        text: "Discover how our solutions, skills, and offerings integrate seamlessly.",
        link: link(
          "Explore Our Solutions",
          "/products-and-solutions/solutions",
        ),
      },
      bottomCta: {
        first: { type: "internal", newTab: false },
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: onImage(ctx.image),
    },
  ];
}

const APPROACH_STEPS = [
  [
    "01",
    "Understand",
    "Analyzing Requirements",
    "We analyze your plant application, process conditions, assay thresholds, and throughput targets.",
  ],
  [
    "02",
    "MATCH",
    "Finding the Right Product",
    "We match your needs with the right chemical grade, concentration, packaging, and supply schedule.",
  ],
  [
    "03",
    "SUPPORT",
    "Supporting Your Process",
    "Our field engineers and labs ensure smooth unloading, dilution, and dosage optimization.",
  ],
  [
    "04",
    "PARTNER",
    "Long-Term Partnerships",
    "We ensure continuous plant operations with buffer inventory, dedicated ISO tanks, and nationwide logistics.",
  ],
] as const;

export function solutionsLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "Our Solutions",
      "Solutions Built Around Your Industry",
      "Explore how our chemical products support critical applications, processes, and industries across the value chain.",
    ),
    {
      blockType: "featureGrid",
      heading: head(
        "Our Approach",
        "From Chemical Products to Industry Solutions",
        "We connect products, applications, technical capabilities, and industry knowledge to support our customers' operational requirements.",
        "split",
      ),
      headingButtons: [
        button("Contact Us", "/contact-us"),
        button(
          "View All Industries",
          "/products-and-solutions/solutions",
          "text",
        ),
      ],
      items: APPROACH_STEPS.map(([marker, eyebrow, title, description]) => ({
        marker,
        eyebrow,
        title,
        description,
      })),
      markerStyle: "number",
      cardStyle: "card",
      columns: "4",
      appearance: PLAIN,
    },
    {
      blockType: "solutionShowcase",
      heading: head(
        "INDUSTRIES WE SERVE",
        "Supporting Industries Through Chemistry",
        "Our products support a wide range of industries and applications, helping businesses meet their operational and manufacturing needs.",
      ),
      source: "all",
      cardStyle: "imageTitle",
      ctaCard: NO_CTA,
      bottomCta: {
        title: "Explore more chemical solutions",
        description:
          "Discover a wider range of chemical products and distribution solutions through Lautan Luas.",
        first: external(
          "Explore Other Distribution",
          "https://lautanluas.co.id",
        ),
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: PLAIN,
    },
    {
      blockType: "productShowcase",
      heading: head(
        "OUR PRODUCTS AT WORK",
        "The Products Behind Our Solutions",
        "Explore the chemical products supporting applications across industries.",
      ),
      source: "all",
      cardStyle: "textCard",
      ctaCard: {
        text: "Explore how our expertise, products, and capabilities come together.",
        link: link("Explore Our Products", "/products-and-solutions/products"),
      },
      bottomCta: {
        first: { type: "internal", newTab: false },
        firstStyle: "primary",
        second: { type: "internal", newTab: false },
        secondStyle: "text",
      },
      appearance: onImage(ctx.image),
    },
  ];
}

export function overviewLayout(ctx: SeedContext): PageBlock[] {
  const name = TENANT_NAMES[ctx.tenant!];
  return [
    hero(
      ctx,
      "ABOUT US",
      "Building Value Through What We Do",
      "We are committed to delivering products, solutions, and services that create value for our customers and the industries we serve.",
    ),
    {
      blockType: "mediaText",
      heading: head("Overview", `Who We Are ${name}`, undefined, "left"),
      body: paragraphs([
        `PT ${name} is a chemical manufacturer and supplier with a long-standing presence in Indonesia since 1978. The company provides essential chemical products including sulfuric acid, sodium silicate, and aluminium sulfate to support a wide range of industrial applications.`,
        `With a focus on product quality, reliable supply, and continuous improvement, ${name} serves industries across water treatment, infrastructure, manufacturing, and other essential sectors.`,
      ]),
      images: [{ image: ctx.image }],
      imageLayout: "single",
      imagePosition: "right",
      stats: [
        { value: "50+", label: "Years of industry experience" },
        { value: "350+", label: "Supported industries" },
        { value: "24+", label: "Regions linked by our network" },
      ],
      pointsLayout: "inline",
      appearance: PLAIN,
    },
    {
      blockType: "featureGrid",
      heading: head(
        "WHAT WE DO",
        "Capabilities That Create Value",
        "From products and solutions to operational and technical capabilities, we bring together the expertise and resources needed to support our customers throughout their journey.",
      ),
      items: [
        [
          "Products & Solutions",
          "Delivering products and solutions designed to meet diverse customer needs.",
        ],
        [
          "Industry Expertise",
          "Applying our knowledge and experience to understand the challenges of the industries we serve.",
        ],
        [
          "Operational Excellence",
          "Continuously improving the way we work to deliver consistent and reliable outcomes.",
        ],
        [
          "Customer Partnership",
          "Building long-term relationships through collaboration, responsiveness, and trust.",
        ],
      ].map(([title, description]) => ({ title, description })),
      markerStyle: "icon",
      cardStyle: "card",
      columns: "4",
      appearance: PLAIN,
    },
    {
      blockType: "visionMission",
      heading: head(
        "Vision & Mission",
        "Our Direction Forward",
        "Our vision and mission guide how we create value for our customers, industries, and the communities we serve.",
      ),
      vision: {
        title: "Our Vision",
        statement: plain(
          "To become a manufacturing company that provides comprehensive solutions, continuous innovation and added value to become the preferred choice for our partners.",
        ),
      },
      mission: {
        title: "Our Mission",
        items: [
          {
            text: "Menjadi pemain global terkemuka dalam industri Aluminium Sulfat dan Sodium Silikat.",
          },
          { text: "Menjadi partner penting dalam industri Asam Sulfat." },
          { text: "Menuju industri ramah lingkungan dan hemat energi." },
        ],
      },
    },
    {
      blockType: "timeline",
      variant: "summary",
      heading: head(
        "OUR JOURNEY",
        "Growing With the Industry",
        "Our journey is shaped by continuous growth, evolving capabilities, and the relationships we build along the way.",
      ),
      banner: {
        title: "Strengthening Our Foundation for the Future",
        description:
          "Focused on building a stronger foundation for sustainable growth while responding to changing customer and industry needs.",
      },
      entries: [
        {
          year: "2026",
          title: "Building the Next Chapter",
          description:
            "Building on decades of experience, we continue to strengthen our capabilities, expand our reach, and create greater value.",
        },
        {
          year: "2025",
          title: "Expanding Capabilities and Market Reach",
          description:
            "Continued to develop our capabilities while strengthening relationships across the industries and markets we serve.",
        },
        {
          year: "2024",
          title: "Expanding Capabilities and Market Reach",
          description:
            "Continued to develop our capabilities while strengthening relationships across the industries and markets we serve.",
        },
      ],
      buttons: [button("Discover Our Milestones", "/about-us/our-journey")],
    },
    {
      blockType: "certifications",
      heading: head(
        "Awards & Certifications",
        "Standards That Define Our Excellence",
        "We adhere to internationally recognized standards to ensure quality, safety, and operational excellence across our processes.",
      ),
      buttons: [
        button(
          "View Award & Certification",
          "/about-us/awards-and-certifications",
        ),
      ],
      variant: "cards",
      layout: "grid",
      items: CERTIFICATES.map(([code, title, description]) => ({
        logo: ctx.image,
        code,
        title,
        description,
      })),
      appearance: PLAIN,
    },
    groupShowcase(ctx),
  ];
}

const CERTIFICATES = [
  [
    "ISO 9001",
    "Quality Management System",
    "Ensures consistent quality management and ongoing improvement in operations.",
  ],
  [
    "ISO 14001",
    "Environmental Management System",
    "Promotes responsible environmental management and enhances environmental performance.",
  ],
  [
    "ISO 45001",
    "Occupational Health & Safety Management System",
    "Facilitates systematic management of workplace health and safety.",
  ],
  [
    "SMK3",
    "Occupational Safety & Health Management System",
    "Aids in implementing workplace safety and health practices.",
  ],
] as const;

const MILESTONE_A =
  "Change of major shareholder : PT Freeport Indonesia 66.02% and Mitsubishi Materials Corporation 33.98%";

const MILESTONE_B =
  "Continued to develop our capabilities while strengthening relationships across the industries and markets we serve.";

export function journeyLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "Our Journey",
      "Growing With Every Milestone",
      "From where we started to where we are today, our journey is shaped by the people, partnerships, and milestones that continue to move us forward.",
    ),
    {
      blockType: "timeline",
      variant: "detailed",
      heading: head(
        "WHAT'S NEXT",
        "Building the Next Chapter",
        "Building on decades of experience, we continue to strengthen our capabilities, expand our reach, and create greater value for our customers and the industries we serve.",
      ),
      entries: [
        {
          year: "2026 - Beyond",
          events: [
            { dateLabel: "30 june 2025", description: MILESTONE_A },
            { dateLabel: "30 june 2025", description: MILESTONE_B },
          ],
        },
        {
          year: "2025",
          title: "Expanding Capabilities and Market Reach",
          description: MILESTONE_B,
          events: [
            { dateLabel: "30 june 2025", description: MILESTONE_A },
            { dateLabel: "30 june 2024", description: MILESTONE_B },
          ],
        },
        {
          year: "2024",
          title: "Expanding Capabilities and Market Reach",
          description: MILESTONE_B,
          events: [
            { dateLabel: "30 june 2023", description: MILESTONE_A },
            { dateLabel: "30 june 2023", description: MILESTONE_B },
          ],
        },
        {
          year: "2023",
          title: "Building Stronger Partnerships",
          description:
            "Focused on deepening customer relationships and creating greater value through reliable products, services, and industry support.",
        },
      ],
    },
  ];
}

const AWARDS = [
  [
    "2026",
    "Excellence in Industrial Performance",
    "Acknowledged for consistent performance and contributions to the industry.",
    "Indonesia Industry Awards",
  ],
  [
    "2026",
    "Outstanding Quality Achievement",
    "Honored for upholding high quality and continuous operational improvements.",
    "National Quality Forum",
  ],
  [
    "2025",
    "Environmental Responsibility Award",
    "Commended for initiatives that enhance responsible operations and environmental practices.",
    "Indonesia Sustainability Forum",
  ],
  [
    "2025",
    "Workplace Safety Excellence",
    "Praised for dedication to workplace safety and responsible safety measures.",
    "National Safety Council",
  ],
  [
    "2024",
    "Manufacturing Excellence Award",
    "Celebrated for excellence and ongoing improvements in manufacturing.",
    "Indonesia Manufacturing Forum",
  ],
  [
    "2024",
    "Community Impact Recognition",
    "Recognized for impactful contributions to community development.",
    "Indonesia CSR Forum",
  ],
  [
    "2023",
    "Responsible Business Recognition",
    "Applauded for integrating responsible practices into business and development.",
    "Business Sustainability Forum",
  ],
  [
    "2023",
    "Industrial Innovation Award",
    "Lauded for innovation and continuous improvement in industrial support.",
    "Indonesia Industrial Forum",
  ],
] as const;

export function awardsLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "Awards & Certifications",
      "Standards That Define Our Excellence",
      "Our certifications and recognitions reflect our commitment to quality, safety, responsible operations, and continuous improvement.",
    ),
    {
      blockType: "certifications",
      heading: head(
        "Awards & Certifications",
        "Standards That Define Our Excellence",
        "We adhere to internationally recognized standards to ensure quality, safety, and operational excellence across our processes.",
      ),
      variant: "cards",
      layout: "carousel",
      items: CERTIFICATES.map(([code, title, description]) => ({
        logo: ctx.image,
        code,
        title,
        description,
      })),
      appearance: onImage(ctx.image),
    },
    {
      blockType: "certificateGallery",
      heading: head(
        "PRODUCT CERTIFICATIONS",
        "Certified to Indonesian National Standards",
        "Explore our product certifications under the Indonesian National Standard (SNI), reflecting compliance with applicable quality and technical requirements.",
      ),
      items: [{ image: ctx.image }],
    },
    {
      blockType: "awards",
      heading: head(
        "AWARDS & RECOGNITION",
        "Recognized for Our Commitment",
        "Recognition from industry organizations and partners reflects the dedication of our people and our continued commitment to creating value.",
      ),
      items: AWARDS.map(([year, title, description, issuer]) => ({
        year,
        title,
        description,
        issuer: `Issued by ${issuer}`,
      })),
      pageSize: AWARDS.length,
    },
  ];
}

const PRINCIPLES = [
  ["P", "Precision in Execution"],
  ["U", "Uncompromised Quality"],
  ["R", "Responsible Practices"],
  ["E", "Enduring Partnerships"],
] as const;

const COMMITMENTS = [
  [
    "Product Quality Standards",
    "Aim to provide products that align with national and international standards.",
  ],
  [
    "Workplace Safety",
    "Focus on preventing workplace accidents and illnesses through safe practices.",
  ],
  [
    "Regulatory Compliance",
    "Adhere to all relevant laws and regulations governing our operations.",
  ],
  [
    "Environmental Protection",
    "Take steps to minimize environmental pollution and protect air quality.",
  ],
  [
    "Waste Management",
    "Responsibly manage all types of waste according to regulations.",
  ],
  [
    "5R Practices",
    "Implement the 5R principles (Ringkas, Rapi, Resik, Rawat, Rajin)",
  ],
  [
    "Resource Efficiency",
    "Utilize materials and energy efficiently while seeking improvement opportunities.",
  ],
  [
    "Healthy Workplace",
    "Safe workplace by preventing the spread of diseases and prohibiting drugs and alcohol.",
  ],
  [
    "Employee Development",
    "Enhance employee skills through ongoing training and development.",
  ],
  [
    "Social Responsibility",
    "Engage with our communities through responsible business and CSR initiatives.",
  ],
  [
    "Continuous Improvement",
    "Regularly assess our processes to find areas for enhancement.",
  ],
  [
    "Integrity & Ethics",
    "Oppose corruption and unethical practices in all our operations.",
  ],
] as const;

function numbered(rows: readonly (readonly [string, string])[]) {
  return rows.map(([title, description], index) => ({
    marker: String(index + 1).padStart(2, "0"),
    title,
    description,
  }));
}

export function managementLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "MANAGEMENT SYSTEM",
      "Built on Principles. Driven by Discipline",
      "Our management approach brings together clear principles, consistent processes, and continuous improvement to deliver reliable value across everything we do.",
    ),
    {
      blockType: "featureGrid",
      heading: head(
        "OUR APPROACH",
        "A System Designed to Create Consistency",
        "Our management system provides a structured approach to how we operate, make decisions, manage risks, and deliver value. It connects our business principles with the processes and practices that guide our people every day.",
        "split",
      ),
      items: [
        [
          "Clear Direction",
          "We align our people, processes, and priorities around clear business objectives.",
        ],
        [
          "Consistent Execution",
          "We establish standards and processes that help us deliver reliable results across our operations.",
        ],
        [
          "Responsible Practices",
          "We consider quality, safety, compliance, and environmental responsibility in the way we operate.",
        ],
        [
          "Cont. Improvement",
          "We continuously evaluate our performance and identify opportunities to improve how we work.",
        ],
      ].map(([title, description]) => ({ title, description })),
      markerStyle: "icon",
      cardStyle: "card",
      columns: "4",
      appearance: PLAIN,
    },
    {
      blockType: "featureGrid",
      heading: head(
        "OUR COMMITMENT",
        "Committed to Quality, Safety, and Responsible Operations",
        "Our Quality, Occupational Health & Safety, and Environmental Policy provides the foundation for how we operate responsibly. It reflects our commitment to delivering reliable products, protecting our people and environment, complying with applicable requirements, and continuously improving our performance.",
      ),
      topImage: ctx.image,
      items: numbered(COMMITMENTS),
      markerStyle: "number",
      cardStyle: "card",
      columns: "4",
      appearance: PLAIN,
    },
    {
      blockType: "featureGrid",
      heading: head(
        "Our Principles",
        "Our Principles in Practice",
        "P-U-R-E represents the principles that guide how we work, make decisions, and build relationships. From operational execution to customer partnerships, these principles help us maintain a consistent standard across our business.",
      ),
      items: PRINCIPLES.map(([marker, title]) => ({
        marker,
        title,
        description:
          "Key materials and inputs used at the beginning of the process",
      })),
      markerStyle: "letter",
      cardStyle: "plain",
      columns: "4",
      appearance: PLAIN,
    },
    {
      blockType: "featureGrid",
      heading: head(
        "CONTINUOUS IMPROVEMENT",
        "Always Improving How We Work",
        "We believe operational excellence is not a destination. Through regular evaluation, collaboration, and continuous improvement, we look for better ways to enhance quality, efficiency, safety, and customer value.",
      ),
      items: numbered([
        [
          "Identify",
          "Identify opportunities, risks, and areas for improvement.",
        ],
        [
          "Improve",
          "Develop and implement practical improvements across our processes.",
        ],
        [
          "Evaluate",
          "Measure results, learn from outcomes, and continuously refine our approach.",
        ],
      ]),
      markerStyle: "number",
      cardStyle: "card",
      columns: "3",
      quote: plain(
        "A strong management system is more than a set of policies. It is how we turn our principles into consistent actions, reliable performance, and lasting value for our customers, people, and communities.",
      ),
      footerButtons: [
        button("Explore Our Sustainability", "/sustainability"),
        button(
          "View Our Certifications",
          "/about-us/awards-and-certifications",
          "light",
        ),
      ],
      appearance: onImage(ctx.image),
    },
  ];
}

export function sustainabilityLayout(ctx: SeedContext): PageBlock[] {
  const sustainability = [ctx.categories.sustainability];
  return [
    hero(
      ctx,
      "SUSTAINABILITY",
      "Creating Lasting Value for a Better Tomorrow",
      "Through environmental stewardship, workplace safety, and meaningful community initiatives, we strive to create lasting value for people and the planet.",
    ),
    {
      blockType: "mediaText",
      heading: head(
        "OUR COMMITMENT",
        "Responsibility Beyond Business",
        undefined,
        "left",
      ),
      body: paragraphs([
        "Sustainability is an important part of how we approach our business and its long-term impact.",
        "As part of Lautan Luas Group, we recognize the importance of balancing industrial development with environmental responsibility, employee well-being, and meaningful contributions to surrounding communities.",
        "Through responsible practices and continuous improvement, we aim to support a more sustainable future.",
      ]),
      images: [{ image: ctx.image }, { image: ctx.image }],
      imageLayout: "staggered",
      imagePosition: "right",
      pointsLayout: "inline",
      appearance: PLAIN,
    },
    {
      blockType: "postShowcase",
      heading: head(
        "OUR SUSTAINABILITY APPROACH",
        "Three Pillars. One Shared Responsibility.",
        "Our sustainability approach focuses on three interconnected areas that guide how we operate responsibly and contribute to long-term positive impact. Environment: Protecting Our Environment. People & Safety: Putting People First. Community: Growing With Our Communities.",
      ),
      source: "latest",
      categories: sustainability,
      limit: 3,
      layout: "overlay",
      cardEyebrow: "category",
      appearance: onImage(ctx.image),
    },
    {
      blockType: "postShowcase",
      heading: head(
        "OUR IMPACT STORIES",
        "Real Actions. Meaningful Impact.",
        "Discover the initiatives and stories that reflect our commitment to creating positive change for people, communities, and the environment.",
      ),
      source: "latest",
      categories: sustainability,
      limit: 4,
      layout: "featured",
      cardEyebrow: "category",
      readMoreLabel: "Read the Story",
      appearance: PLAIN,
    },
    {
      blockType: "hotspotIllustration",
      heading: head(
        "ENVIRONMENTAL RESPONSIBILITY",
        "Operating With Care for the Environment",
        undefined,
      ),
      image: ctx.image,
      hotspots: [
        {
          tone: "green",
          x: 28,
          y: 40,
          eyebrow: "Resource Efficiency",
          title: "Using Resources More Responsibly",
          description:
            "Encouraging efficient and responsible use of energy, raw materials, and other resources throughout our operations.",
        },
        {
          tone: "orange",
          x: 52,
          y: 55,
          eyebrow: "Waste Management",
          title: "Managing Waste Responsibly",
          description:
            "Supporting responsible waste handling and management practices to help minimize environmental impact.",
        },
        {
          tone: "navy",
          x: 74,
          y: 35,
          eyebrow: "Water Management",
          title: "Managing Water for a Cleaner Tomorrow",
          description:
            "Promoting responsible water use and management across our operational activities.",
        },
      ],
    },
    {
      blockType: "mediaText",
      heading: head(
        "OUR JOURNEY CONTINUES",
        "Building a Better Future, Together",
        "Sustainability is a continuous journey. Through responsible operations, collaboration, and meaningful action, we strive to create lasting value for our people, communities, and the environment.",
        "left",
      ),
      images: [{ image: ctx.image }],
      imageLayout: "single",
      imagePosition: "right",
      pointsLayout: "inline",
      appearance: PLAIN,
    },
  ];
}

export function investorLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "INVESTOR RELATIONS",
      "Transparent Information. Informed Decisions",
      "Access key financial information, shareholder updates, stock and bond information, corporate disclosures, and reports to stay informed about our performance and developments.",
    ),
    {
      blockType: "irDocuments",
      heading: head(
        "INFORMATION DISCLOSURE",
        "Transparent Information, Accessible to You",
        "Access our latest corporate disclosures and important information, presented transparently for shareholders and stakeholders.",
        "left",
      ),
      pageSize: DEFAULT_PAGE_SIZE,
    },
  ];
}

export function careerLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "Career",
      "Build What's Next With Us",
      "Join a growing ecosystem where diverse expertise, collaboration, and innovation come together to create meaningful impact.",
    ),
    {
      blockType: "featureGrid",
      heading: head(
        "Life at Our Company",
        "More Than Just a Workplace",
        "Be part of a workplace where people can develop their capabilities, contribute meaningful ideas, and grow together.",
        "split",
      ),
      items: numbered([
        [
          "Grow Your Potential",
          "Develop your skills, expand your experience, and continue growing throughout your career.",
        ],
        [
          "Make an Impact",
          "Contribute meaningful ideas and work that supports our business and the industries we serve.",
        ],
        [
          "Grow Together",
          "Collaborate with people who share knowledge, support one another, and move forward together.",
        ],
      ]),
      markerStyle: "number",
      cardStyle: "plain",
      columns: "3",
      appearance: PLAIN,
    },
    {
      blockType: "jobListing",
      heading: head(
        "OPEN POSITIONS",
        "Find Your Next Opportunity",
        "Explore our current openings and find a role that matches your skills, experience, and ambitions.",
      ),
      filters: {
        search: true,
        department: true,
        location: true,
        jobType: true,
      },
      searchPlaceholder: "Search jobs or keywords...",
      pageSize: DEFAULT_PAGE_SIZE,
    },
  ];
}

const FORM_CONSENT =
  "By submitting this form, you agree that we may use the information provided to respond to your inquiry.";

export function contactLayout(ctx: SeedContext): PageBlock[] {
  return [
    hero(
      ctx,
      "CONTACT US",
      "Let’s Start a Conversation",
      "Whether you have a product inquiry, business request, or need to learn more about our capabilities, our team is ready to connect and help you find the right way forward.",
    ),
    {
      blockType: "contactInquiry",
      heading: head(
        "GET IN TOUCH",
        "Connect With Our Team",
        "Find the contact details for our office and business teams below. For product inquiries and commercial requests, please contact our sales team directly.",
        "left",
      ),
      form: {
        eyebrow: "SEND AN INQUIRY",
        title: "Tell Us What You Need",
        description:
          "Share a few details about your requirements and our team will get back to you with the appropriate information and next steps.",
        fields: {
          fullName: {
            label: "Full Name",
            placeholder: "Enter your full name",
          },
          company: {
            label: "Company",
            placeholder: "Enter your company name",
          },
          workEmail: {
            label: "Work Email",
            placeholder: "Enter your business email",
          },
          phone: {
            label: "Phone Number",
            placeholder: "Enter your phone number",
          },
          message: {
            label: "Message",
            placeholder: "Tell us more about your requirements",
          },
        },
        consentText: plain(FORM_CONSENT),
        submitLabel: "Submit Inquiry",
        successMessage:
          "Thank you. Your inquiry has been sent and our team will be in touch soon.",
        errorMessage:
          "Something went wrong and your inquiry was not sent. Please try again.",
      },
    },
    { blockType: "locationMap", linkLabel: "Open Google Map" },
    {
      blockType: "entityContacts",
      heading: head(
        "OTHER CONTACTS",
        "Connect With Our Other Businesses",
        undefined,
      ),
      source: "others",
    },
  ];
}

export function publicationLayout(ctx: SeedContext): PageBlock[] {
  return [publicationHero(ctx), publicationListing("all")];
}

function publicationHero(ctx: SeedContext): PageBlock & TemplateBlock {
  return {
    blockType: "publicationHero",
    backgroundImage: ctx.image,
    heading: head(
      "PUBLICATIONS",
      "Stories, Insights, and Company Updates",
      "Stay informed with the latest news, activities, and developments from our companies as we continue supporting industries and communities.",
    ),
    searchPlaceholder: "Search stories, insights, and company updates",
    searchLabel: "Search",
    allLabel: "All Updates",
    categories: CATEGORY_SEED.map(({ slug }) => ctx.categories[slug]),
  } as PageBlock & TemplateBlock;
}

function publicationListing(
  source: "all" | "currentCategory",
): PageBlock & TemplateBlock {
  return {
    blockType: "postListing",
    source,
    pageSize: DEFAULT_PAGE_SIZE,
    resultsLabel: "Showing {count} results for “{query}”",
    emptyState: {
      title: "No Results Found for “{query}”",
      description: "Try another keyword or browse all our updates.",
      button: link("View All Publications", "/publication"),
    },
    highlights: { title: "Highlighted Updates" },
  } as PageBlock & TemplateBlock;
}

export const LEGAL_UPDATED = "2026-03-12T00:00:00.000Z";

export type LegalPage = "terms" | "privacy" | "cookie";

export const LEGAL_TITLES: Record<LegalPage, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  cookie: "Cookie Policy",
};

function termsBody(tenant: TenantSlug) {
  const company = legalName(tenant);
  const { email, address } = CONTACTS[tenant];
  return sections([
    {
      heading: "1. Introduction",
      body: [
        `Welcome to the official website of ${company} ("Company," "we," "us," or "our").`,
        "These Terms & Conditions govern your access to and use of our website, including its content, features, and information.",
        "By accessing or using this website, you agree to comply with these Terms & Conditions. If you do not agree with any part of these terms, please discontinue your use of the website.",
      ],
    },
    {
      heading: "2. Website Use",
      body: [
        `This website is intended to provide general information about ${company}, including our company profile, chemical products, industrial solutions, sustainability initiatives, publications, and related activities.`,
        "You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or the rights of other users.",
        "You must not attempt to gain unauthorized access to the website, introduce malicious software, or engage in activities that may compromise its security or functionality.",
      ],
    },
    {
      heading: "3. Information Accuracy",
      body: [
        "We strive to ensure that the information presented on this website is accurate, relevant, and up to date.",
        "However, product information, technical descriptions, specifications, availability, and other website content may be updated or changed without prior notice.",
        "Information published on this website is provided for general informational purposes and should not be considered a substitute for official product documentation, technical specifications, or direct consultation with our representatives.",
      ],
    },
    {
      heading: "4. Product Information",
      body: [
        "Descriptions of chemical products, their properties, applications, and related technical information are provided for general reference.",
        "Actual product specifications, grades, packaging, availability, and suitability for particular applications may vary.",
        "Customers are encouraged to contact our representatives to obtain the latest product information and relevant documentation, including applicable Technical Data Sheets (TDS) and Safety Data Sheets (SDS).",
        "Nothing on this website constitutes a binding offer, quotation, warranty, or commitment to supply products unless expressly agreed in a separate written agreement.",
      ],
    },
    {
      heading: "5. Intellectual Property Rights",
      body: [
        `Unless otherwise stated, the content of this website, including text, graphics, images, logos, design elements, and other materials, is owned by or licensed to ${company} and is protected by applicable intellectual property laws.`,
        "You may view and use website content for personal or legitimate business information purposes.",
        "You may not reproduce, distribute, modify, republish, or commercially exploit website content without prior written permission from the relevant rights holder, except as permitted by applicable law.",
      ],
    },
    {
      heading: "6. Third-Party Links",
      body: [
        "This website may contain links to external websites operated by third parties, including affiliated companies, business partners, and other organizations.",
        "These links are provided for convenience and informational purposes.",
        "We do not control third-party websites and are not responsible for their content, availability, security, or privacy practices.",
        "Accessing external websites is subject to the terms and policies established by their respective operators.",
      ],
    },
    {
      heading: "7. Limitation of Liability",
      body: [
        `To the extent permitted by applicable law, ${company} shall not be liable for losses or damages arising from the use of, or inability to use, this website, including reliance on information presented on the website.`,
        "We do not guarantee that the website will always be available, uninterrupted, secure, or free from technical errors.",
        "Nothing in these Terms & Conditions excludes or limits any liability that cannot lawfully be excluded or limited.",
      ],
    },
    {
      heading: "8. Privacy and Personal Data",
      body: [
        "We respect the importance of protecting personal information submitted through our website.",
        "Personal data collected through contact forms, inquiries, or other website features will be handled in accordance with our Privacy Policy and applicable data protection laws.",
        "For more information about how personal data is collected, used, stored, and protected, please refer to our Privacy Policy.",
      ],
    },
    {
      heading: "9. Changes to Terms & Conditions",
      body: [
        "We may revise or update these Terms & Conditions from time to time to reflect changes in our website, business operations, or applicable legal requirements.",
        'Any updates will be published on this page with a revised "Last Updated" date.',
        "Your continued use of the website following the publication of updated terms constitutes acceptance of those changes to the extent permitted by applicable law.",
      ],
    },
    {
      heading: "10. Governing Law",
      body: [
        "These Terms & Conditions are governed by and interpreted in accordance with the applicable laws of the Republic of Indonesia.",
        "Any disputes arising in connection with the use of this website shall be addressed in accordance with applicable Indonesian laws and legal procedures.",
      ],
    },
    {
      heading: "11. Contact Information",
      body: [
        "If you have any questions regarding these Terms & Conditions, please contact us through our official communication channels.",
        company,
        `Email: ${email}`,
        `Address: ${address}`,
      ],
    },
  ]);
}

const EMPTY_BODY = lexical([paragraph([])]);

export const COOKIE_PLACEHOLDER_BODY = paragraphs([
  "The text of this policy will be added here.",
]);

export function legalLayout(ctx: SeedContext, kind: LegalPage): PageBlock[] {
  const title = LEGAL_TITLES[kind];
  return [
    {
      blockType: "articleHeader",
      heading: head(
        undefined,
        title,
        kind === "terms"
          ? "Please read these Terms & Conditions carefully before using our website. By accessing or using this website, you acknowledge and agree to the terms outlined below."
          : `Please read this ${title} carefully before using our website.`,
        "left",
      ),
      metaLabel: "Legal Information",
      lastUpdatedLabel: "Last Updated",
      ...(kind === "terms" ? { lastUpdated: LEGAL_UPDATED } : {}),
    },
    {
      blockType: "richText",
      heading: head(undefined, undefined, undefined, "left"),
      body:
        kind === "terms"
          ? termsBody(ctx.tenant!)
          : kind === "cookie"
            ? COOKIE_PLACEHOLDER_BODY
            : EMPTY_BODY,
      showTableOfContents: true,
      tocTitle: "On This Page",
    },
  ];
}

export function productTemplate(ctx: SeedContext): TemplateBlock[] {
  return [
    {
      blockType: "recordHero",
      metaLabels: {
        formula: "Chemical Formula",
        casNumber: "CAS Number",
        totalVariants: "Total Variants",
        classification: "Classification",
      },
    },
    {
      blockType: "productOverview",
      eyebrow: "Overview",
      pdsLabel: "Download Product Data Sheet (PDS)",
    },
    {
      blockType: "productSpecifications",
      heading: head(
        "Technical Specifications",
        "Available {title} Products",
        "Find the technical specifications, physical properties, and assay parameters you need for engineering qualification.",
        "left",
      ),
      columnLabels: {
        parameter: "Parameter",
        method: "Method",
        value: "Guaranteed Value",
      },
      sideLabels: {
        formula: "Formula",
        casNumber: "CAS Number",
        classification: "Classification",
        packaging: "Packaging",
      },
      contact: { link: link("Contact Us", "/contact-us"), style: "primary" },
      pdsLabel: "Download PDS",
      sdsLabel: "Download SDS",
    },
    {
      blockType: "productApplications",
      heading: head(
        "APPLICATIONS & PROCESS",
        "Where {title} Make an Impact",
        "Explore how {title} is used across different applications and where it contributes throughout the production process.",
        "left",
      ),
    },
    entityMapSection(
      ctx,
      "CUSTOMIZED REQUIREMENTS",
      "Looking for a Specific Specification or Custom Specification?",
    ),
    testimonialsSection(),
  ] as TemplateBlock[];
}

export function solutionTemplate(ctx: SeedContext): TemplateBlock[] {
  return [
    {
      blockType: "recordHero",
      metaLabels: {
        keyApplications: "Key Applications",
        supportingProducts: "Supporting Products",
        industriesServed: "Industries Served",
      },
    },
    {
      blockType: "solutionImpact",
      eyebrow: "Impact & Value",
    },
    {
      blockType: "solutionApplications",
      heading: head(
        "APPLICATIONS & PROCESS",
        "Where Our Solutions Make an Impact",
        "Explore how our solutions are used across different applications and where they contribute throughout the production process.",
        "left",
      ),
      productsHeading: {
        title: "Our Products Supporting This Solution",
        description:
          "Explore the chemical products that support applications and processes across this industry.",
      },
      featuredLabels: {
        productName: "Product Name",
        formula: "Formula",
        casNumber: "CAS Number",
        variants: "Variants",
      },
    },
    entityMapSection(
      ctx,
      "PARTNER WITH US",
      "Looking for the Right Solution for Your Business?",
    ),
    testimonialsSection(),
  ] as TemplateBlock[];
}

function entityMapSection(
  ctx: SeedContext,
  eyebrow: string,
  title: string,
): TemplateBlock {
  return {
    blockType: "entityMap",
    heading: head(eyebrow, title, undefined),
    items: [
      {
        entity: ctx.tenants.duniakimia,
        label: "Chemical Hub in Sumatra",
        title: TENANT_NAMES.duniakimia,
        description:
          "Supporting water treatment, mining, and manufacturing with essential chemicals produced from its Sumatra operations.",
        regions: [{ name: "All Sumatra" }],
        buttons: [
          button("Explore Products", "/products-and-solutions/products"),
        ],
      },
      { entity: ctx.tenants.indoacid },
      { entity: ctx.tenants.likutelaga },
    ],
  };
}

function testimonialsSection(): TemplateBlock {
  return {
    blockType: "testimonials",
    heading: head(
      "TRUSTED BY INDUSTRY",
      "Trusted Across Indonesia's Key Industries",
      "Our sulfuric acid solutions power premier manufacturing complexes, water treatment authorities, and hydrometallurgical operations nationwide.",
    ),
    items: [
      {
        quote:
          "In our continuous nickel leaching operations, batch consistency and delivery punctuality are non-negotiable. DILM’s ecosystem approach—having synchronized buffer stock at coastal terminals and dedicated ISO tankers—has guaranteed 100% operational uptime for our facility over the past four years without a single off-spec batch.",
        name: "Hendra P.",
        role: "Vice President of Supply Chain & Plant Operations",
      },
    ],
  };
}

export function jobTemplate(): TemplateBlock[] {
  return [
    {
      blockType: "recordHero",
      metaLabels: {
        department: "Department",
        experience: "Experience",
        jobType: "Job Type",
        location: "Location",
        postedDate: "Posted Date",
      },
    },
    {
      blockType: "jobDetail",
      heading: head("ABOUT THE ROLE", "Make an Impact in This Role", undefined),
      form: {
        eyebrow: "APPLY NOW",
        title: "Ready to Take the Next Step?",
        description:
          "If this opportunity matches your experience and ambitions, we'd love to hear from you.",
        fields: {
          fullName: {
            label: "Full Name",
            placeholder: "Enter your full name",
          },
          email: { label: "Email", placeholder: "Enter your email" },
          phone: {
            label: "Phone Number",
            placeholder: "Enter your phone number",
          },
          coverLetter: {
            label: "Cover Letter",
            placeholder:
              "Tell us briefly about your experience and why you're interested in this position",
          },
          resume: {
            label: "Resume/CV",
            placeholder: "Upload your latest resume or CV",
          },
        },
        consentText: plain(
          "I agree to the processing of my personal data for recruitment purposes in accordance with the Privacy Policy.",
        ),
        submitLabel: "Apply for This Position",
        successMessage:
          "Thank you. Your application has been received and our team will review it.",
        errorMessage:
          "Something went wrong and your application was not sent. Please try again.",
      },
    },
    {
      blockType: "jobShowcase",
      heading: head(
        "MORE OPPORTUNITIES",
        "Explore Other Open Positions",
        "Explore more roles and find the opportunity that’s right for your next career move.",
      ),
      source: "latest",
      limit: 3,
      buttons: [button("View All Opportunities", "/career", "text")],
      appearance: PLAIN,
    },
  ] as TemplateBlock[];
}

export function postTemplate(): TemplateBlock[] {
  return [
    {
      blockType: "recordHero",
      metaLabels: { category: "Category", publishedDate: "Published date" },
    },
    {
      blockType: "postArticle",
      highlights: { title: "News & Updates" },
      previousLabel: "Previous",
      nextLabel: "Next",
    },
  ] as TemplateBlock[];
}

export function categoryTemplate(ctx: SeedContext): TemplateBlock[] {
  return [
    publicationHero(ctx) as unknown as TemplateBlock,
    publicationListing("currentCategory") as unknown as TemplateBlock,
  ];
}

export function siteMessages(cookiePolicyId: number) {
  return {
    notFound: {
      code: "404",
      title: "Looks Like This Page Is Missing",
      description:
        "The page you're looking for may have been moved, removed, or is no longer available. Let's get you back on track.",
      buttons: [{ link: link("Back to Homepage", "/") }],
    },
    cookieBanner: {
      title: "We Value Your Privacy",
      body: cookieBody(cookiePolicyId),
      acceptLabel: "Accept All",
      rejectLabel: "Reject",
      policyVersion: "2026-03",
    },
  };
}
