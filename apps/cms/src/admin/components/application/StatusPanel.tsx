"use client";

import { useConfig, useField, useForm } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useId, useState } from "react";

import { CV_STATUSES } from "../../../collections/CvSubmissions";
import { ActionButton } from "../kit/ActionButton";
import { STATUS_SETS } from "../kit/status";
import { notify } from "../kit/Toast";
import { MaterialIcon } from "../MaterialIcon";
import { savedToast } from "./application";

type Status = (typeof CV_STATUSES)[number];

export function StatusPanel({
  nextHref,
  tenant,
}: {
  nextHref: string | undefined;
  tenant: number | string | undefined;
}) {
  const { value, setValue, initialValue } = useField<Status>({
    path: "status",
  });
  const { submit } = useForm();
  const {
    config: { routes, serverURL },
  } = useConfig();
  const router = useRouter();
  const headingId = useId();
  const [saved, setSaved] = useState<Status | undefined>(initialValue);
  const [busy, setBusy] = useState(false);
  const current = value ?? saved;

  async function remainingIn(status: Status): Promise<number | undefined> {
    const params = new URLSearchParams({
      "where[and][0][status][equals]": status,
    });
    if (tenant !== undefined) {
      params.set("where[and][1][tenant][equals]", String(tenant));
    }
    const response = await fetch(
      formatAdminURL({
        apiRoute: routes.api,
        serverURL,
        path: `/cv-submissions/count?${params}`,
      }),
      { credentials: "include" },
    ).catch(() => undefined);
    if (!response?.ok) return undefined;
    return ((await response.json()) as { totalDocs?: number }).totalDocs;
  }

  async function save() {
    if (!current || !saved || current === saved || busy) return;
    setBusy(true);
    const result = await submit({ disableSuccessStatus: true });
    setBusy(false);
    if (!result?.res.ok) return;
    const previous = saved;
    setSaved(current);
    const left = await remainingIn(previous);
    const message = savedToast(current, previous, left ?? 0);
    notify({
      tone: "success",
      title: message.title,
      body: left === undefined ? "The applicant wasn't emailed." : message.body,
      action: nextHref
        ? { label: "Next →", onClick: () => router.push(nextHref) }
        : undefined,
    });
    router.refresh();
  }

  return (
    <section aria-labelledby={headingId} className="dil-app-panel">
      <h2 className="dil-app-panel__title" id={headingId}>
        Status
      </h2>
      <div
        aria-labelledby={headingId}
        className="dil-app-status"
        role="radiogroup"
      >
        {CV_STATUSES.map((status) => {
          const chip = STATUS_SETS.application[status];
          return (
            <label
              className={`dil-app-status__option${current === status ? " dil-app-status__option--checked" : ""}`}
              key={status}
            >
              <input
                checked={current === status}
                name="dil-application-status"
                onChange={() => setValue(status)}
                type="radio"
                value={status}
              />
              <span className="dil-app-status__label">{chip.label}</span>
              <MaterialIcon name={chip.icon} />
            </label>
          );
        })}
      </div>
      <ActionButton
        busy={busy}
        className="dil-app-status__save"
        onClick={() => void save()}
        type="button"
        unavailableReason={
          current === saved ? "Choose a different status to save." : undefined
        }
      >
        Save status
      </ActionButton>
      <p className="dil-app-panel__note">
        Changing status doesn&apos;t email the applicant. Only the arrival
        confirmation is sent.
      </p>
    </section>
  );
}
