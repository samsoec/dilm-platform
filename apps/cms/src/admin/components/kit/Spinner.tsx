export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={["dil-spinner", className].filter(Boolean).join(" ")}
    />
  );
}
