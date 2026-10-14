import type { ServerProps } from "payload";

import { initials, type Nameable } from "../initials";

export function Avatar({ user }: ServerProps) {
  const person = (user ?? {}) as Nameable;
  return (
    <span
      aria-label={person.name ?? person.email ?? undefined}
      className="dil-avatar"
      role="img"
    >
      {initials(person)}
    </span>
  );
}
