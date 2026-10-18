"use client";

import { useModal } from "@payloadcms/ui";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { ConfirmDialog } from "../kit/ConfirmDialog";
import { notify } from "../kit/Toast";
import { changeCountText, CONTINUE_VERBS, type GuardTrigger } from "./changes";

export const UNSAVED_CHANGES_SLUG = "dil-unsaved-changes";

export type FormReport = {
  modified: boolean;
  count: number;
  title: string;
  save: () => Promise<boolean>;
};

export type GuardCompany = { name: string; domain?: string };

type Pending = {
  trigger: GuardTrigger;
  action: () => void;
  form: FormReport;
};

type GuardContext = {
  guard: (trigger: GuardTrigger, action: () => void) => void;
  report: (form: FormReport | undefined) => void;
  setCompany: (company: GuardCompany | undefined) => void;
};

const Context = createContext<GuardContext>({
  guard: (_, action) => action(),
  report: () => undefined,
  setCompany: () => undefined,
});

export function useUnsavedChangesGuard(): GuardContext {
  return useContext(Context);
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const { openModal } = useModal();
  const form = useRef<FormReport>(undefined);
  const company = useRef<GuardCompany>(undefined);
  const [pending, setPending] = useState<Pending>();
  const [shownCompany, setShownCompany] = useState<GuardCompany>();

  const guard = useCallback(
    (trigger: GuardTrigger, action: () => void) => {
      const current = form.current;
      if (!current?.modified) {
        action();
        return;
      }
      setShownCompany(company.current);
      setPending({ trigger, action, form: current });
      openModal(UNSAVED_CHANGES_SLUG);
    },
    [openModal],
  );

  const value = useMemo<GuardContext>(
    () => ({
      guard,
      report: (next) => {
        form.current = next;
      },
      setCompany: (next) => {
        company.current = next;
      },
    }),
    [guard],
  );

  const saveAndContinue = async () => {
    if (!pending) return;
    const saved = await pending.form.save();
    if (!saved) {
      notify({
        tone: "error",
        title: "Couldn't save.",
        body: "Your changes are still here. Fix them and try again.",
      });
      return;
    }
    pending.action();
  };

  return (
    <Context value={value}>
      {children}
      {pending && (
        <ConfirmDialog
          body={
            <p>
              You have {changeCountText(pending.form.count)}
              {shownCompany && <> for {shownCompany.name}</>}.
              {shownCompany?.domain && (
                <>
                  {" "}
                  Saving puts {pending.form.count === 1 ? "it" : "them"} on{" "}
                  {shownCompany.domain}.
                </>
              )}
            </p>
          }
          busyLabel="Saving…"
          confirmLabel={CONTINUE_VERBS[pending.trigger]}
          icon="edit_off"
          onConfirm={saveAndContinue}
          secondary={{ label: "Discard", onClick: () => pending.action() }}
          slug={UNSAVED_CHANGES_SLUG}
          title={`Save changes to the ${pending.form.title} first?`}
          tone="discard"
        />
      )}
    </Context>
  );
}
