"use client";

import {
  DOT_MAP_HEIGHT,
  DOT_MAP_RADIUS,
  DOT_MAP_WIDTH,
  dotMapDots,
  nudgePin,
  pinFromPoint,
  pinToViewBox,
  type MapPin,
} from "@dilm/shared-types";
import { useField } from "@payloadcms/ui";
import { useMemo, useRef } from "react";

export const MAP_PIN_HINT = "Click to place · Esc to cancel · arrow keys nudge";

function toPin(x: unknown, y: unknown): MapPin | null {
  return typeof x === "number" && typeof y === "number" ? { x, y } : null;
}

export function MapPinPicker() {
  const xField = useField<number | null>({ path: "profile.mapPin.x" });
  const yField = useField<number | null>({ path: "profile.mapPin.y" });
  const dots = useMemo(() => dotMapDots(), []);
  const map = useRef<SVGSVGElement>(null);
  const before = useRef<MapPin | null>(null);
  const pin = toPin(xField.value, yField.value);
  const disabled = Boolean(xField.disabled || yField.disabled);

  function place(next: MapPin | null) {
    xField.setValue(next ? next.x : null);
    yField.setValue(next ? next.y : null);
  }

  const marker = pin ? pinToViewBox(pin) : null;

  return (
    <div className="dil-map-pin field-type">
      <span className="field-label">Map pin</span>
      <div
        aria-label="Dot map. Click to place the company pin, or use the arrow keys."
        aria-readonly={disabled}
        className="dil-map-pin__surface"
        onClick={(event) => {
          if (disabled) return;
          if (!map.current) return;
          const next = pinFromPoint(
            map.current.getBoundingClientRect(),
            event.clientX,
            event.clientY,
          );
          if (next) place(next);
        }}
        onFocus={() => {
          before.current = pin;
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Escape") {
            event.preventDefault();
            place(before.current);
            return;
          }
          const next = nudgePin(pin, event.key, event.shiftKey);
          if (!next) return;
          event.preventDefault();
          place(next);
        }}
        role="application"
        tabIndex={0}
      >
        <svg
          aria-hidden="true"
          className="dil-map-pin__svg"
          ref={map}
          viewBox={`0 0 ${DOT_MAP_WIDTH} ${DOT_MAP_HEIGHT}`}
        >
          {dots.map(([x, y]) => (
            <circle cx={x} cy={y} key={`${x}-${y}`} r={DOT_MAP_RADIUS} />
          ))}
          {marker && (
            <circle
              className="dil-map-pin__marker"
              cx={marker.cx}
              cy={marker.cy}
              r={9}
            />
          )}
        </svg>
      </div>
      <p className="dil-map-pin__hint">{MAP_PIN_HINT}</p>
      <p aria-live="polite" className="dil-map-pin__readout">
        {pin ? `x ${pin.x}% y ${pin.y}%` : "No pin placed yet"}
      </p>
    </div>
  );
}
