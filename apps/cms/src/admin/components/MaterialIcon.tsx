import type { IconName } from "../icons";

export function MaterialIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={["dil-icon", className].filter(Boolean).join(" ")}
    >
      {name}
    </span>
  );
}
