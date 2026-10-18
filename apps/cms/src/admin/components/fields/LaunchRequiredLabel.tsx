"use client";

import { FieldLabel } from "@payloadcms/ui";
import type { EmailFieldLabelClientComponent } from "payload";

export const LaunchRequiredLabel: EmailFieldLabelClientComponent = ({
  field,
  path,
}) => <FieldLabel label={field?.label} path={path} required />;
