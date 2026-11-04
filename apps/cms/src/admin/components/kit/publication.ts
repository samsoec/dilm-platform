export const PUBLISH_STATUSES = [
  "draft",
  "published",
  "changed",
  "trashed",
] as const;

export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export type PublishDoc = {
  _status?: string | null;
  deletedAt?: string | Date | null;
};

export type PublishOptions = { hasPublishedVersion?: boolean };

export function getPublishStatus(
  doc: PublishDoc | null | undefined,
  { hasPublishedVersion }: PublishOptions = {},
): PublishStatus {
  if (doc?.deletedAt) return "trashed";
  const status = doc?._status;
  if (status === "changed")
    return hasPublishedVersion === false ? "draft" : "changed";
  if (status === "published") return "published";
  return hasPublishedVersion ? "changed" : "draft";
}

export type JobListingState = "open" | "closed" | "closedAutomatically";

export type JobListingDoc = {
  status?: string | null;
  closingDate?: string | Date | null;
};

export function getJobListing(
  job: JobListingDoc | null | undefined,
  now: Date = new Date(),
): JobListingState {
  if (job?.status === "closed") return "closed";
  if (
    job?.closingDate &&
    new Date(job.closingDate).getTime() <= now.getTime()
  ) {
    return "closedAutomatically";
  }
  return "open";
}
