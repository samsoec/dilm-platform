// @vitest-environment jsdom
import { ModalContainer, ModalProvider, useModal } from "@faceless-ui/modal";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode, Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";

vi.mock("@payloadcms/ui", async () => {
  const modal = await import("@faceless-ui/modal");
  return {
    Modal: modal.Modal,
    useModal: modal.useModal,
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

const SLUG = "confirm-test";

function Harness(props: Partial<ConfirmDialogProps>) {
  return (
    <ModalProvider transTime={0}>
      <Trigger />
      <ConfirmDialog
        body="It becomes public on duniakimia.com/en/investor within minutes."
        confirmLabel="Publish"
        onConfirm={() => undefined}
        slug={SLUG}
        title="Publish Annual Report 2024?"
        tone="go-live"
        {...props}
      />
      <ModalContainer />
    </ModalProvider>
  );
}

function Trigger() {
  const { openModal } = useModal();
  return (
    <button onClick={() => openModal(SLUG)} type="button">
      Publish…
    </button>
  );
}

async function openDialog(props: Partial<ConfirmDialogProps> = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  const trigger = screen.getByRole("button", { name: "Publish…" });
  await user.click(trigger);
  const dialog = await screen.findByRole("alertdialog");
  return { user, trigger, dialog };
}

afterEach(cleanup);

describe("ConfirmDialog (K-07, FR-UI-67)", () => {
  it("names the action and starts focus on Cancel", async () => {
    const { dialog } = await openDialog();
    expect(dialog).toHaveProperty(
      "textContent",
      expect.stringContaining("Publish Annual Report 2024?"),
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Cancel" }),
      ),
    );
  });

  it("closes on Esc and returns focus to the trigger", async () => {
    const onConfirm = vi.fn();
    const { user, trigger } = await openDialog({ onConfirm });
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Cancel" }),
      ),
    );
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("returns focus to the trigger after Cancel", async () => {
    const onCancel = vi.fn();
    const { user, trigger } = await openDialog({ onCancel });
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("keeps the label and shows a busy state while confirming", async () => {
    let finish!: () => void;
    const onConfirm = vi.fn(
      () => new Promise<void>((resolve) => (finish = resolve)),
    );
    const { user } = await openDialog({ onConfirm });
    const confirm = screen.getByRole("button", { name: "Publish" });
    await user.click(confirm);
    expect(confirm.getAttribute("aria-busy")).toBe("true");
    expect(confirm.textContent).toBe("Publish");
    finish();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("asks for DELETE before an irreversible delete", async () => {
    const onConfirm = vi.fn();
    const { user } = await openDialog({
      tone: "delete",
      confirmLabel: "Delete permanently",
      typeToConfirm: "DELETE",
      onConfirm,
    });
    const confirm = screen.getByRole("button", { name: "Delete permanently" });
    expect(confirm).toHaveProperty("disabled", true);
    expect(confirm.getAttribute("aria-describedby")).toBe(
      screen.getByText("Type DELETE to confirm").id,
    );
    await user.type(screen.getByLabelText("Type DELETE to confirm"), "DELETE");
    expect(confirm).toHaveProperty("disabled", false);
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
