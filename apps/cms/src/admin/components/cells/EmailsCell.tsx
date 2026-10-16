"use client";

import type { DefaultCellComponentProps } from "payload";

import { MaterialIcon } from "../MaterialIcon";
import { emailMarks } from "./cv";

export function EmailsCell({ rowData }: DefaultCellComponentProps) {
  return (
    <span className="dil-emails">
      {emailMarks(rowData).map(({ who, sent, icon, text }) => (
        <span
          className={`dil-emails__mark dil-tone--${sent ? "ok" : "muted"}`}
          key={who}
          title={text}
        >
          <MaterialIcon name={icon} />
          <span className="dil-sr-only">{text}</span>
        </span>
      ))}
    </span>
  );
}
