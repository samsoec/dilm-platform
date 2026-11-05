"use client";

import {
  FieldLabel,
  useConfig,
  useField,
  useFormFields,
  useLocale,
} from "@payloadcms/ui";
import type { CheckboxFieldClientComponent } from "payload";
import { useEffect, useRef, useState } from "react";

import { Banner } from "../kit/Banner";
import { SegmentedControl } from "../kit/SegmentedControl";
import { MaterialIcon } from "../MaterialIcon";
import { forwardsTarget, type LinkLike } from "../pages/pagesModel";
import { forwardNote, VISITOR_LABELS, type VisitorMode } from "./editor";
import { relationId } from "./urls";
import { useEditorUrls, type UrlSeed } from "./useEditorUrls";

const REDIRECT_TARGETS = [
  "redirectTo.internalPath",
  "redirectTo.externalUrl",
  "redirectTo.reference",
] as const;

const OPTIONS = (Object.keys(VISITOR_LABELS) as VisitorMode[]).map((value) => ({
  value,
  label: VISITOR_LABELS[value],
}));

export const VisitorsField: CheckboxFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const { value, setValue, disabled } = useField<boolean>({ path: fieldPath });
  const dispatch = useFormFields(([, dispatchFields]) => dispatchFields);
  const targets = useFormFields(([fields]) =>
    REDIRECT_TARGETS.map((target) => fields[target]?.value),
  );
  const remembered = useRef<unknown[]>(undefined);

  const choose = (mode: VisitorMode) => {
    if (mode === "forward") {
      if (remembered.current) {
        REDIRECT_TARGETS.forEach((target, index) => {
          dispatch({
            type: "UPDATE",
            path: target,
            value: remembered.current?.[index] ?? null,
          });
        });
      }
      setValue(true);
      return;
    }
    remembered.current = targets;
    for (const target of REDIRECT_TARGETS) {
      dispatch({ type: "UPDATE", path: target, value: null });
    }
    setValue(false);
  };

  return (
    <div className="field-type dil-visitors" id={`field-${fieldPath}`}>
      <FieldLabel label="Visitors" path={fieldPath} />
      <SegmentedControl
        disabled={readOnly || disabled}
        label="Visitors"
        onChange={choose}
        options={OPTIONS}
        value={value ? "forward" : "see"}
      />
    </div>
  );
};

function useTargetTitle(
  redirect: LinkLike,
  locale: string,
): { title: string | undefined; failed: boolean } {
  const {
    config: { routes, serverURL },
  } = useConfig();
  const relationTo = redirect.reference?.relationTo ?? undefined;
  const id = relationId(redirect.reference?.value as never);
  const wanted = redirect.type === "reference" && relationTo && id;
  const key = wanted ? `${relationTo}:${id}` : undefined;
  const [found, setFound] = useState<{ key: string; title?: string }>();
  const [failed, setFailed] = useState<string>();

  useEffect(() => {
    if (!key || !relationTo || !id) return;
    const request = new AbortController();
    fetch(
      `${serverURL ?? ""}${routes.api}/${relationTo}/${encodeURIComponent(id)}?depth=0&locale=${locale}&select[title]=true&select[name]=true&select[slug]=true`,
      { credentials: "include", signal: request.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("lookup failed");
        const doc = (await response.json()) as {
          title?: string;
          name?: string;
          slug?: string;
        };
        setFailed(undefined);
        setFound({ key, title: doc.title || doc.name || doc.slug });
      })
      .catch(() => {
        if (!request.signal.aborted) setFailed(key);
      });
    return () => request.abort();
  }, [id, key, locale, relationTo, routes.api, serverURL]);

  return {
    title: found?.key === key ? found?.title : undefined,
    failed: Boolean(key) && failed === key,
  };
}

export function ForwardNote({
  seed,
  childCount,
}: {
  seed: UrlSeed;
  childCount: number;
}) {
  const { code } = useLocale();
  const forwards = useFormFields(([fields]) => Boolean(fields.forwards?.value));
  const type = useFormFields(([fields]) => fields["redirectTo.type"]?.value);
  const internalPath = useFormFields(
    ([fields]) => fields["redirectTo.internalPath"]?.value,
  );
  const externalUrl = useFormFields(
    ([fields]) => fields["redirectTo.externalUrl"]?.value,
  );
  const reference = useFormFields(
    ([fields]) => fields["redirectTo.reference"]?.value,
  );
  const { current } = useEditorUrls(seed);
  const redirect = {
    type: type as string,
    internalPath: internalPath as string,
    externalUrl: externalUrl as string,
    reference: reference as LinkLike["reference"],
  } satisfies LinkLike;
  const { title, failed } = useTargetTitle(redirect, code);
  if (!forwards) return null;

  const key =
    redirect.type === "reference" && redirect.reference?.relationTo
      ? `${redirect.reference.relationTo}:${relationId(redirect.reference.value as never)}`
      : undefined;
  const target = forwardsTarget(
    redirect,
    new Map(key && title ? [[key, title]] : []),
  );

  return (
    <div className="dil-forward-note">
      <Banner icon="subdirectory_arrow_right" tone="info">
        {forwardNote({
          url: current?.path ?? "/",
          target,
          children: childCount,
        })}
      </Banner>
      {failed && (
        <p className="dil-field-warning" role="alert">
          <MaterialIcon name="error" />
          The target page&apos;s name couldn&apos;t be loaded.
        </p>
      )}
    </div>
  );
}

export function SlugFallbackNote({ seed }: { seed: UrlSeed }) {
  const { warning } = useEditorUrls(seed);
  if (!warning) return null;
  return (
    <p className="dil-field-warning" role="status">
      <MaterialIcon name="warning" />
      {warning.message}
    </p>
  );
}
