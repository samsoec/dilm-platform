"use client";

import { useEffect, useState } from "react";

import { Spinner } from "./Spinner";

export const WAKE_UP_DELAY_MS = 3000;
export const WAKE_UP_MESSAGE =
  "Still loading. The CMS is waking up, this can take up to 20 seconds.";

export function useWakeUpNotice(
  active: boolean,
  delayMs = WAKE_UP_DELAY_MS,
): boolean {
  const [late, setLate] = useState(false);

  useEffect(() => {
    if (!active) {
      setLate(false);
      return;
    }
    const timer = setTimeout(() => setLate(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return active && late;
}

const LINE_WIDTHS = ["40%", "90%", "70%"];

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div aria-hidden="true" className="dil-skeleton">
      {Array.from({ length: lines }, (_, index) => (
        <span
          className="dil-skeleton__line"
          key={index}
          style={{ width: LINE_WIDTHS[index % LINE_WIDTHS.length] }}
        />
      ))}
    </div>
  );
}

export function WakeUpLine({ children = WAKE_UP_MESSAGE }) {
  return (
    <div className="dil-wake-up">
      <Spinner />
      <span>{children}</span>
    </div>
  );
}

export function LoadingBlock({
  lines,
  label = "Loading",
}: {
  lines?: number;
  label?: string;
}) {
  const late = useWakeUpNotice(true);
  return (
    <div aria-busy="true" aria-live="polite" role="status">
      {late ? (
        <WakeUpLine />
      ) : (
        <>
          <span className="dil-sr-only">{label}</span>
          <Skeleton lines={lines} />
        </>
      )}
    </div>
  );
}
