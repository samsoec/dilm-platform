"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

import { policyVersionChanged } from "../../siteMessages";
import { privacyPolicyVersionWarning } from "../../../consent/privacyPolicyVersion";
import { useUnsavedChangesGuard } from "../guard/UnsavedChangesProvider";
import { Banner } from "../kit/Banner";

export function PrivacyPolicyVersionWarning() {
  const { data } = useDocumentInfo();
  const { company } = useUnsavedChangesGuard();
  const now = useFormFields(([fields]) => fields.privacyPolicyVersion?.value);
  const was = (data as { privacyPolicyVersion?: unknown })
    ?.privacyPolicyVersion;
  const change = policyVersionChanged(was, now);
  if (!change.changed || data?.id === undefined) return null;
  return (
    <Banner className="dil-policy-warning" tone="warning">
      {privacyPolicyVersionWarning(change.was, company?.domain)}
    </Banner>
  );
}
