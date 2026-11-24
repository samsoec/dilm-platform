import type { ReactNode } from "react";

export const MAIN_ID = "main-content";

export function SiteShell({
  children,
  showContactBand = true,
}: {
  children: ReactNode;
  showContactBand?: boolean;
}) {
  return (
    <>
      <header data-slot="site-header" />
      <main id={MAIN_ID} tabIndex={-1}>
        {children}
      </main>
      <footer data-slot="site-footer">
        {showContactBand ? <div data-slot="contact-band" /> : null}
      </footer>
    </>
  );
}
