import { trashBlockedNote } from "../documents/documents";
import { ReplacePdf } from "../documents/ReplacePdf";
import { MaterialIcon } from "../MaterialIcon";
import { PublishBadge } from "./PublishBadge";
import { ReachBadge } from "./ReachBadge";
import {
  hiddenText,
  replaceAllText,
  USED_IN_EMPTY,
  usedInTitle,
  type UsedInData,
} from "./usedIn";

export function UsedInPanel({
  data,
  canReplace,
  replaceAction,
}: {
  data: UsedInData;
  canReplace?: boolean;
  replaceAction?: boolean;
}) {
  const count = data.rows.length;
  const live = data.rows.filter((row) => row.status === "published").length;
  return (
    <section aria-labelledby="dil-panel-used" className="dil-editor-panel">
      <h2 className="dil-editor-panel__title" id="dil-panel-used">
        {usedInTitle(count, data.unit)}
      </h2>
      {count === 0 && data.hidden === 0 ? (
        <p className="dil-editor-panel__note">{USED_IN_EMPTY}</p>
      ) : (
        <ul className="dil-used-in">
          {data.rows.map((row) => (
            <li className="dil-used-in__row" key={row.key}>
              <a href={row.href}>{row.label}</a>
              <span className="dil-used-in__meta">
                <span>{row.type}</span>
                <ReachBadge compact reach={row.reach} />
                <span>
                  <MaterialIcon name="domain" />
                  {row.owner}
                </span>
                {row.status && <PublishBadge status={row.status} />}
              </span>
            </li>
          ))}
        </ul>
      )}
      {data.hidden > 0 && (
        <p className="dil-editor-panel__note">{hiddenText(data.hidden)}</p>
      )}
      {replaceAction && live > 0 && (
        <p className="dil-editor-panel__note">{trashBlockedNote(live)}</p>
      )}
      {canReplace && replaceAction && <ReplacePdf count={count} />}
      {canReplace &&
        !replaceAction &&
        data.unit === "variants" &&
        count > 0 && (
          <p className="dil-editor-panel__note">{replaceAllText(count)}</p>
        )}
    </section>
  );
}
