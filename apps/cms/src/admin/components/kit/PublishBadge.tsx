import type { JobListingState, PublishStatus } from "./publication";
import { StatusChip } from "./StatusChip";

export function PublishBadge({ status }: { status: PublishStatus }) {
  return (
    <StatusChip
      set="document"
      srText={
        status === "changed"
          ? ", the website still shows the last published version"
          : undefined
      }
      status={status}
    />
  );
}

export function JobListingBadge({ listing }: { listing: JobListingState }) {
  return <StatusChip set="job" status={listing} />;
}
