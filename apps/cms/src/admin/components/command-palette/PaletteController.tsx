"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { CommandPaletteContext } from "./context";
import { PaletteDialog, type PaletteDialogProps } from "./PaletteDialog";
import { isPaletteShortcut } from "./search";

export type PaletteControllerProps = Omit<
  PaletteDialogProps,
  "onClose" | "onSelect"
> & {
  children: ReactNode;
  navigate: (href: string) => void;
};

export function PaletteController({
  children,
  navigate,
  ...dialog
}: PaletteControllerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openRef = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setIsOpen(false);
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target?.isConnected) target.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isPaletteShortcut(event)) return;
      event.preventDefault();
      if (openRef.current) close();
      else open();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  const controls = useMemo(() => ({ open }), [open]);

  return (
    <CommandPaletteContext.Provider value={controls}>
      {children}
      {isOpen &&
        createPortal(
          <PaletteDialog
            {...dialog}
            onClose={close}
            onSelect={(href) => {
              close();
              navigate(href);
            }}
          />,
          document.body,
        )}
    </CommandPaletteContext.Provider>
  );
}
