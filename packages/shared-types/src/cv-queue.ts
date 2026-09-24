import type { TenantSlug } from "./tenant.js";

export interface CvSubmissionFields {
  applicantName: string;
  email: string;
  phone: string;
  position: string;
}

export interface CvQueueMessage {
  submissionId: string;
  tenant: TenantSlug;
  fields: CvSubmissionFields;
  resumeFileKey: string;
}
