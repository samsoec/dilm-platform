"use client";

import { Form, useDocumentInfo } from "@payloadcms/ui";
import type { ReactNode } from "react";

import { UnsavedChangesReporter } from "../guard/UnsavedChangesReporter";

export function ApplicationForm({ children }: { children: ReactNode }) {
  const { action, hasSavePermission, initialState, isInitializing } =
    useDocumentInfo();
  return (
    <Form
      action={action}
      className="dil-app-form"
      disabled={isInitializing || !hasSavePermission}
      initialState={!isInitializing ? initialState : undefined}
      isDocumentForm
      isInitializing={isInitializing}
      method="PATCH"
    >
      <UnsavedChangesReporter />
      {children}
    </Form>
  );
}
