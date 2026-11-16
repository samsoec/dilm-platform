"use client";

import { useForm, useModal } from "@payloadcms/ui";
import { type ReactNode, useCallback, useRef, useState } from "react";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import {
  changed,
  dialogLanguages,
  dialogSummary,
  dialogTitle,
  type RoutingImpact,
  type RoutingSetting,
} from "./routing";
import {
  fetchRoutingImpact,
  PICKER_PATHS,
  useRoutingContext,
} from "./useRoutingImpact";

export const ROUTING_DIALOG_SLUG = "dil-routing-change";

type BaseSetting = Exclude<RoutingSetting, "publicationPage">;

const WATCHED: Record<string, BaseSetting[]> = {
  "tenant-settings": ["careerPage"],
  "site-routing": ["productsPage", "solutionsPage"],
};

export function useRoutingGate(slug: string | undefined): {
  confirm: () => Promise<boolean>;
  dialog: ReactNode;
} {
  const { getFields } = useForm();
  const { openModal } = useModal();
  const context = useRoutingContext();
  const [impacts, setImpacts] = useState<RoutingImpact[]>([]);
  const answer = useRef<(ok: boolean) => void>(undefined);
  const watched = WATCHED[slug ?? ""] ?? [];

  const confirm = useCallback(async (): Promise<boolean> => {
    if (watched.length === 0) return true;
    const fields = getFields();
    const moved = watched.filter((setting) => {
      const field = fields[PICKER_PATHS[setting]];
      return field && changed(field.initialValue, field.value);
    });
    if (moved.length === 0) return true;
    const found = await Promise.all(
      moved.map((setting) => {
        const value = fields[PICKER_PATHS[setting]]?.value;
        const page =
          value === null || value === undefined || value === ""
            ? ""
            : String(
                typeof value === "object"
                  ? (value as { id?: unknown }).id
                  : value,
              );
        return fetchRoutingImpact(context, setting, page);
      }),
    ).catch(() => undefined);
    if (!found) return true;
    setImpacts(found);
    return new Promise<boolean>((resolve) => {
      answer.current = resolve;
      openModal(ROUTING_DIALOG_SLUG);
    });
  }, [context, getFields, openModal, watched]);

  const refused = impacts.some((impact) => impact.overLimit);
  const first = impacts[0];

  const dialog = first ? (
    <ConfirmDialog
      body={
        <>
          {impacts.map((impact) => (
            <div className="dil-routing-dialog__item" key={impact.setting}>
              {impacts.length > 1 && (
                <b>{dialogTitle(impact.setting as BaseSetting)} </b>
              )}
              <p>{dialogSummary(impact.setting as BaseSetting, impact)}</p>
              {!impact.overLimit && (
                <ul className="dil-routing-dialog__languages">
                  {dialogLanguages(impact).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      }
      confirmLabel="Change page"
      busyLabel="Changing..."
      onCancel={() => answer.current?.(false)}
      onConfirm={() => answer.current?.(true)}
      refusal={refused}
      slug={ROUTING_DIALOG_SLUG}
      title={
        impacts.length === 1
          ? dialogTitle(first.setting as BaseSetting)
          : "Change site routing?"
      }
      tone="go-live"
    />
  ) : null;

  return { confirm, dialog };
}
