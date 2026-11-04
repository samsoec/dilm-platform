"use client";

import { useRouter } from "next/navigation";

export function PagesRetry() {
  const router = useRouter();
  return (
    <button
      className="dil-pages__retry"
      onClick={() => router.refresh()}
      type="button"
    >
      Try again
    </button>
  );
}
