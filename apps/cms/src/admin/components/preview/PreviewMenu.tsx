"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BUILDING_PREVIEW,
  LISTING_LABELS,
  LISTING_NOTE,
  LISTING_STATES,
  PREVIEW_UNAVAILABLE_MESSAGE,
  RECORD_TIP,
  type ListingState,
} from "../../../previewUrl";
import { ActionButton } from "../kit/ActionButton";
import { Popover } from "../kit/Popover";
import { SegmentedControl } from "../kit/SegmentedControl";
import { MaterialIcon } from "../MaterialIcon";

type Site = {
  id: number | string;
  name: string;
  domain: string;
  url: string | null;
};

type Links = {
  sites: Site[];
  records: { id: number | string; title: string }[];
  record: number | string | null;
  listing: boolean;
};

type Target = { collection: string; id: string | number };

const PROBE_MS = 8000;

export async function siteAnswers(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_MS);
  try {
    await fetch(url, { mode: "no-cors", signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function PreviewEntries({
  collection,
  id,
  itemClassName,
}: Target & { itemClassName?: string }) {
  const [links, setLinks] = useState<Links>();
  const [failed, setFailed] = useState(false);
  const [record, setRecord] = useState<string>();
  const [state, setState] = useState<ListingState>("initial");
  const [building, setBuilding] = useState<number | string>();
  const [unavailable, setUnavailable] = useState<Site>();
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    const code = new URLSearchParams(window.location.search).get("locale");
    const query = new URLSearchParams({
      collection,
      id: String(id),
      state,
      ...(code ? { locale: code } : {}),
      ...(record ? { record } : {}),
    });
    let response: Response | undefined;
    try {
      response = await fetch(`/api/preview-links?${query}`, {
        credentials: "include",
      });
    } catch {
      response = undefined;
    }
    if (!alive.current) return;
    if (!response?.ok) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setLinks((await response.json()) as Links);
  }, [collection, id, record, state]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = async (site: Site) => {
    setUnavailable(undefined);
    if (!site.url) {
      setUnavailable(site);
      return;
    }
    const popup = window.open("about:blank", "_blank");
    setBuilding(site.id);
    const answered = await siteAnswers(site.url);
    if (!alive.current) return;
    setBuilding(undefined);
    if (!answered) {
      popup?.close();
      setUnavailable(site);
      return;
    }
    if (popup) popup.location.href = site.url;
    else window.open(site.url, "_blank");
  };

  if (failed) {
    return (
      <p className="dil-preview__note" role="alert">
        {PREVIEW_UNAVAILABLE_MESSAGE}{" "}
        <button className="dil-preview__retry" onClick={() => void load()}>
          Retry
        </button>
      </p>
    );
  }
  if (!links) return <p className="dil-preview__note">{BUILDING_PREVIEW}</p>;

  return (
    <div className="dil-preview">
      {links.records.length > 0 && (
        <label className="dil-preview__field">
          Preview with
          <select
            onChange={(event) => setRecord(event.target.value)}
            value={String(links.record ?? "")}
          >
            {links.records.map((entry) => (
              <option key={entry.id} value={String(entry.id)}>
                {entry.title}
              </option>
            ))}
          </select>
          <span className="dil-preview__note">{RECORD_TIP}</span>
        </label>
      )}
      {links.listing && (
        <div className="dil-preview__field">
          <SegmentedControl
            label="Listing state"
            onChange={setState}
            options={LISTING_STATES.map((value) => ({
              value,
              label: LISTING_LABELS[value],
            }))}
            value={state}
          />
          <span className="dil-preview__note">{LISTING_NOTE}</span>
        </div>
      )}
      <ul
        className="dil-preview__sites"
        role={itemClassName ? "none" : undefined}
      >
        {links.sites.map((site) => (
          <li key={site.id}>
            {itemClassName ? (
              <button
                aria-disabled={building !== undefined}
                className={itemClassName}
                onClick={() => building === undefined && void open(site)}
                role="menuitem"
                type="button"
              >
                <MaterialIcon name="visibility" />
                {building === site.id ? BUILDING_PREVIEW : site.domain}
              </button>
            ) : (
              <ActionButton
                busy={building === site.id}
                icon="visibility"
                onClick={() => building === undefined && void open(site)}
                type="button"
                variant="secondary"
              >
                {building === site.id ? BUILDING_PREVIEW : site.domain}
              </ActionButton>
            )}
          </li>
        ))}
      </ul>
      {unavailable && (
        <p className="dil-preview__note" role="alert">
          {PREVIEW_UNAVAILABLE_MESSAGE} ({unavailable.domain}){" "}
          <button
            className="dil-preview__retry"
            onClick={() => void open(unavailable)}
            type="button"
          >
            Retry
          </button>
        </p>
      )}
    </div>
  );
}

export function PreviewMenu(target: Target) {
  return (
    <Popover
      align="end"
      className="dil-editor-preview"
      icon="visibility"
      label="Preview"
    >
      {() => <PreviewEntries {...target} />}
    </Popover>
  );
}
