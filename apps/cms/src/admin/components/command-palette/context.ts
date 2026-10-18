"use client";

import { createContext, useContext } from "react";

export type CommandPaletteControls = { open: () => void };

export const CommandPaletteContext = createContext<
  CommandPaletteControls | undefined
>(undefined);

export function useCommandPalette(): CommandPaletteControls | undefined {
  return useContext(CommandPaletteContext);
}
