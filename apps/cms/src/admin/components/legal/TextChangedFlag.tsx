"use client";

import { TEXT_CHANGED_FLAG } from "../../../legal/legalText";
import { MaterialIcon } from "../MaterialIcon";
import { useLegalSnapshot } from "./legalForm";

export function TextChangedFlag() {
  const { changed } = useLegalSnapshot();
  if (!changed) return null;
  return (
    <p className="dil-legal-flag" role="status">
      <MaterialIcon name="warning" />
      {TEXT_CHANGED_FLAG}
    </p>
  );
}
