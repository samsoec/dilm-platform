// @vitest-environment jsdom
import { ModalContainer, ModalProvider } from "@faceless-ui/modal";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode, Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { countChanges, type GuardTrigger, leaveTrigger } from "./changes";
import {
  type FormReport,
  UnsavedChangesProvider,
  useUnsavedChangesGuard,
} from "./UnsavedChangesProvider";

vi.mock("@payloadcms/ui", async () => {
  const modal = await import("@faceless-ui/modal");
  return {
    Modal: modal.Modal,
    useModal: modal.useModal,
    toast: { custom: vi.fn(), dismiss: vi.fn() },
    Button: ({
      children,
      className,
      disabled,
      extraButtonProps,
      onClick,
      ref,
      type,
    }: {
      children: ReactNode;
      className?: string;
      disabled?: boolean;
      extraButtonProps?: Record<string, unknown>;
      onClick?: () => void;
      ref?: Ref<HTMLButtonElement>;
      type?: "button" | "submit";
    }) => (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        type={type}
        {...extraButtonProps}
      >
        {children}
      </button>
    ),
  };
});

const TRIGGERS: [GuardTrigger, string][] = [
  ["company", "Save and switch company"],
  ["language", "Save and switch language"],
  ["leave", "Save and continue"],
  ["sign-out", "Save and sign out"],
];

function Harness({
  form,
  trigger,
  action,
}: {
  form?: FormReport;
  trigger: GuardTrigger;
  action: () => void;
}) {
  return (
    <ModalProvider transTime={0}>
      <UnsavedChangesProvider>
        <Trigger action={action} form={form} trigger={trigger} />
      </UnsavedChangesProvider>
      <ModalContainer />
    </ModalProvider>
  );
}

function Trigger({
  form,
  trigger,
  action,
}: {
  form?: FormReport;
  trigger: GuardTrigger;
  action: () => void;
}) {
  const { guard, report, setCompany } = useUnsavedChangesGuard();
  return (
    <button
      onClick={() => {
        report(form);
        setCompany({ name: "Dunia Kimia Utama", domain: "duniakimia.com" });
        guard(trigger, action);
      }}
      type="button"
    >
      Go
    </button>
  );
}

function dirtyForm(save: () => Promise<boolean>): FormReport {
  return { modified: true, count: 3, title: "Header", save };
}

async function start(trigger: GuardTrigger, form?: FormReport) {
  const user = userEvent.setup();
  const action = vi.fn();
  render(<Harness action={action} form={form} trigger={trigger} />);
  await user.click(screen.getByRole("button", { name: "Go" }));
  return { user, action };
}

afterEach(cleanup);

describe("UnsavedChangesProvider (G-03, FR-UI-74)", () => {
  describe.each(TRIGGERS)("the %s trigger", (trigger, verb) => {
    it("skips the guard when the form is clean", async () => {
      const save = vi.fn();
      const { action } = await start(trigger, {
        modified: false,
        count: 0,
        title: "Header",
        save,
      });
      expect(action).toHaveBeenCalledOnce();
      expect(save).not.toHaveBeenCalled();
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });

    it("skips the guard outside an edit form", async () => {
      const { action } = await start(trigger);
      expect(action).toHaveBeenCalledOnce();
    });

    it("asks first when the form is dirty, naming document, count and domain", async () => {
      const { action } = await start(
        trigger,
        dirtyForm(async () => true),
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(action).not.toHaveBeenCalled();
      expect(dialog.textContent).toContain("Save changes to the Header first?");
      expect(dialog.textContent).toContain(
        "You have 3 unsaved changes for Dunia Kimia Utama. Saving puts them on duniakimia.com.",
      );
      expect(screen.getByRole("button", { name: verb })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Discard" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    });

    it("saves first, then performs the action", async () => {
      const order: string[] = [];
      const save = vi.fn(async () => {
        order.push("save");
        return true;
      });
      const { user, action } = await start(trigger, dirtyForm(save));
      action.mockImplementation(() => order.push("action"));
      await user.click(await screen.findByRole("button", { name: verb }));
      await waitFor(() => expect(order).toEqual(["save", "action"]));
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    });
  });

  it("doesn't perform the action when the save fails", async () => {
    const { user, action } = await start(
      "leave",
      dirtyForm(async () => false),
    );
    await user.click(
      await screen.findByRole("button", { name: "Save and continue" }),
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(action).not.toHaveBeenCalled();
  });

  it("performs the action without saving on Discard", async () => {
    const save = vi.fn(async () => true);
    const { user, action } = await start("company", dirtyForm(save));
    await user.click(await screen.findByRole("button", { name: "Discard" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(save).not.toHaveBeenCalled();
  });

  it("does nothing on Cancel", async () => {
    const save = vi.fn(async () => true);
    const { user, action } = await start("sign-out", dirtyForm(save));
    await user.click(await screen.findByRole("button", { name: "Cancel" }));
    await act(async () => undefined);
    expect(action).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });
});

describe("leaveTrigger", () => {
  const here = "http://cms.test/admin/collections/header/3?locale=en";

  it("reads a locale-only change as the language switch", () => {
    expect(leaveTrigger(here, "/admin/collections/header/3?locale=id")).toBe(
      "language",
    );
  });

  it("reads the logout route as sign-out", () => {
    expect(leaveTrigger(here, "/admin/logout")).toBe("sign-out");
  });

  it("reads anything else as leaving the page", () => {
    expect(leaveTrigger(here, "/admin/collections/footer")).toBe("leave");
    expect(
      leaveTrigger(here, "/admin/collections/header/3?locale=id&tab=2"),
    ).toBe("leave");
  });
});

describe("countChanges", () => {
  it("counts the fields whose value differs from the loaded one", () => {
    expect(
      countChanges({
        title: { value: "New", initialValue: "Old" },
        tagline: { value: "", initialValue: undefined },
        "links.0.label": { value: "About", initialValue: "About" },
        links: { value: 3, initialValue: 2 },
      }),
    ).toBe(2);
  });
});
