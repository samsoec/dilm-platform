"use client";

import type { DefaultCellComponentProps } from "payload";
import { useState } from "react";

import { ROLE_LABELS, type Role, ROLES } from "../../../access";
import { initials } from "../../initials";
import { lastSignInText } from "./users";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function UserCell({ cellData, rowData }: DefaultCellComponentProps) {
  const name = text(cellData);
  const email = text(rowData.email);
  return (
    <span className="dil-user">
      <span aria-hidden className="dil-avatar dil-user__avatar">
        {initials({ name, email })}
      </span>
      <span className="dil-user__text">
        <span className="dil-user__name">{name || email}</span>
        {name && email && (
          <span className="dil-user__email" title={email}>
            {email}
          </span>
        )}
      </span>
    </span>
  );
}

export function RoleCell({ cellData }: DefaultCellComponentProps) {
  const roles = Array.isArray(cellData) ? (cellData as Role[]) : [];
  return (
    <span className="dil-user__roles">
      {ROLES.filter((role) => roles.includes(role)).map((role) => (
        <span className={`dil-role-chip dil-role-chip--${role}`} key={role}>
          {ROLE_LABELS[role]}
        </span>
      ))}
    </span>
  );
}

export function LastSignInCell({ cellData }: DefaultCellComponentProps) {
  const [now] = useState(() => new Date());
  return (
    <span className="dil-user__last">{lastSignInText(cellData, now)}</span>
  );
}
