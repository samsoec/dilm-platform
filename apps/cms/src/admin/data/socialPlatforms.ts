export const SOCIAL_PLATFORMS = [
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
};

export const SOCIAL_PLATFORM_OPTIONS = SOCIAL_PLATFORMS.map((value) => ({
  label: SOCIAL_PLATFORM_LABELS[value],
  value,
}));

export const SEO_LIMITS = { title: 60, description: 160 } as const;
