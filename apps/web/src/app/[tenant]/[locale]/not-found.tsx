import type { Metadata } from "next";

import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function NotFound() {
  return <NotFoundBody />;
}
