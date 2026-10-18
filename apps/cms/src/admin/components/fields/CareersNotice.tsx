"use client";

import { useFormFields } from "@payloadcms/ui";

import { Banner } from "../kit/Banner";

export function CareersNotice() {
  const recruiterEmail = useFormFields(
    ([fields]) => fields.recruiterEmail?.value,
  );
  if (typeof recruiterEmail === "string" && recruiterEmail.trim() !== "") {
    return null;
  }
  return (
    <Banner
      className="dil-field-banner dil-careers-notice"
      title="Nobody is notified of new applications."
      tone="error"
    >
      They still arrive in Career applications, but no recruiter gets an email.
    </Banner>
  );
}
