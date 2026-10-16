import { syncBadge } from "../cells/cv";
import { MaterialIcon } from "../MaterialIcon";

const SYNC_STATES = [
  [syncBadge("synced", 1), "sent to the job platform"],
  [
    syncBadge("failed", 3),
    "the last try didn't go through; the queue tries again",
  ],
  [syncBadge("pending", 0), "not sent yet"],
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
        {SYNC_STATES.map(([badge, meaning]) => (
          <span className="dil-legend__item" key={badge.label}>
            <MaterialIcon
              className={`dil-tone--${badge.tone}`}
              name={badge.icon}
            />
            {badge.label.split(" · ")[0]}: {meaning}
          </span>
        ))}
      </div>
    </aside>
  );
}
