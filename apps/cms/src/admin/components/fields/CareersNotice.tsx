"use client";

import { useFormFields } from "@payloadcms/ui";

import { MaterialIcon } from "../MaterialIcon";

export function CareersNotice() {
  const recruiterEmail = useFormFields(
    ([fields]) => fields.recruiterEmail?.value,
  );
  if (typeof recruiterEmail === "string" && recruiterEmail.trim() !== "") {
    return null;
  }
  return (
    <div className="dil-notice dil-notice--danger">
      <MaterialIcon name="error" />
      <div>
        <p className="dil-notice__title">No recruiter email yet</p>
        <p className="dil-notice__text">
          Career applications to this site can&apos;t notify anyone until you
          add one.
        </p>
      </div>
    </div>
  );
}
