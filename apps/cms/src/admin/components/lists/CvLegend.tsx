import { statusChip } from "../kit/status";
import { MaterialIcon } from "../MaterialIcon";

const SYNC_STATES = [
  ["synced", "sent to the job platform"],
  ["failed", "the last try didn't go through; the queue tries again"],
  ["pending", "not sent yet"],
] as const;

export function CvLegend() {
  return (
    <aside aria-label="Legend" className="dil-legend">
      <div className="dil-legend__group">
        <span className="dil-legend__title">Emails</span>
        <span className="dil-legend__item">
          <MaterialIcon className="dil-tone--ok" name="mark_email_read" />
          Applicant got the confirmation
        </span>
        <span className="dil-legend__item">
          <MaterialIcon className="dil-tone--ok" name="person_check" />
          Recruiter was notified
        </span>
        <span className="dil-legend__item">
          <MaterialIcon className="dil-tone--muted" name="remove" />
          Not sent yet
        </span>
      </div>
      <div className="dil-legend__group">
        <span className="dil-legend__title">Job platform</span>
        {SYNC_STATES.map(([status, meaning]) => {
          const chip = statusChip("sync", status)!;
          return (
            <span className="dil-legend__item" key={status}>
              <MaterialIcon
                className={`dil-tone--${chip.tone}`}
                name={chip.icon}
              />
              {chip.label}: {meaning}
            </span>
          );
        })}
      </div>
    </aside>
  );
}
