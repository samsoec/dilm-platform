import type { ReactNode } from "react";

export function Frame({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={["dil-widget", className].filter(Boolean).join(" ")}
    >
      <header className="dil-widget__head">
        <h2>{title}</h2>
        {aside && <span className="dil-widget__aside">{aside}</span>}
      </header>
      <div className="dil-widget__body">{children}</div>
    </section>
  );
}
