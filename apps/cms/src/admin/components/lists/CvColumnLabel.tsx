"use client";

import { Popover } from "../kit/Popover";
import { MaterialIcon } from "../MaterialIcon";

function Legend() {
  return (
    <div className="dil-legend-pop">
      <b>What the icons mean</b>
      <span className="dil-tone--ok">
        <MaterialIcon name="check_circle" />
        Sent or synced
      </span>
      <span className="dil-tone--warn">
        <MaterialIcon name="schedule" />
        Pending, the system will try
      </span>
      <span className="dil-tone--danger">
        <MaterialIcon name="sync_problem" />
        Failed · retrying automatically
      </span>
      <span>
        <span className="dil-legend-pop__keys">
          A <MaterialIcon name="check" /> R <MaterialIcon name="check" />
        </span>
        Applicant / Recruiter email
      </span>
    </div>
  );
}

function LabelWithLegend({ text }: { text: string }) {
  return (
    <span className="dil-column-label">
      {text}
      <Popover
        align="end"
        className="dil-column-label__info"
        floating
        icon="info"
        label={<span className="dil-sr-only">What the icons mean</span>}
        trailingIcon={null}
      >
        {() => <Legend />}
      </Popover>
    </span>
  );
}

export function EmailsLabel() {
  return <LabelWithLegend text="Emails" />;
}

export function JobPlatformLabel() {
  return <LabelWithLegend text="Job platform" />;
}
