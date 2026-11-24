"use client";

import { useEffect } from "react";

import { analyticsAllowed } from "@/analytics/consent";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function loadGa4(
  measurementId: string,
  doc: Document,
  win: GtagWindow,
): void {
  if (!analyticsAllowed(doc.cookie)) return;
  if (doc.querySelector("script[data-ga4]") !== null) return;
  win.dataLayer = win.dataLayer ?? [];
  win.gtag = function gtag() {
    win.dataLayer?.push(arguments);
  };
  win.gtag("js", new Date());
  win.gtag("config", measurementId);
  const script = doc.createElement("script");
  script.async = true;
  script.dataset.ga4 = "";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  doc.head.appendChild(script);
}

export function Analytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    loadGa4(measurementId, document, window);
  }, [measurementId]);
  return null;
}
