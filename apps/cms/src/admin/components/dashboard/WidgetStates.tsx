"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ActionButton } from "../kit/ActionButton";
import { LoadingBlock } from "../kit/Loading";
import { MaterialIcon } from "../MaterialIcon";
import { Frame } from "./Frame";

export function WidgetLoading({ title }: { title: string }) {
  return (
    <Frame title={title}>
      <div className="dil-widget__loading">
        <LoadingBlock label={`Loading ${title.toLowerCase()}`} />
      </div>
    </Frame>
  );
}

export function WidgetError({ title, what }: { title: string; what: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Frame title={title}>
      <div className="dil-widget__state" role="alert">
        <MaterialIcon
          className="dil-widget__state-icon dil-widget__state-icon--danger"
          name="cloud_off"
        />
        <b>Couldn&apos;t load {what}</b>
        <span>The rest of the dashboard is fine.</span>
        <ActionButton
          busy={pending}
          icon="refresh"
          onClick={() => startTransition(() => router.refresh())}
          type="button"
          variant="secondary"
        >
          Retry
        </ActionButton>
      </div>
    </Frame>
  );
}
