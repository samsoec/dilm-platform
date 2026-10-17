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
      className="dil-field-banner"
      title="No recruiter email yet."
      tone="error"
    >
      Career applications to this site can&apos;t notify anyone until you add
      one.
    </Banner>
  );
}
