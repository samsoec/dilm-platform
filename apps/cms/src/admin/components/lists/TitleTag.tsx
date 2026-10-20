"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function TitleTag({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<Element | null>(null);
  useEffect(() => {
    setSlot(document.querySelector(".list-header__title-and-actions"));
  }, []);
  return slot ? createPortal(children, slot) : null;
}
