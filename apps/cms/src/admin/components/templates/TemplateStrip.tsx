import { MaterialIcon } from "../MaterialIcon";
import type { StripItem } from "../../data/templateEditor";
import { recordCountText } from "./templates";

export function TemplateStrip({ items }: { items: StripItem[] }) {
  return (
    <nav aria-label="Detail templates" className="dil-template-strip">
      <ul className="dil-template-strip__list">
        {items.map((item) => {
          const body = (
            <>
              <span className="dil-template-strip__name">
                {item.label}
                <MaterialIcon name={item.locked ? "lock" : "edit"} />
                <span className="dil-sr-only">
                  {item.locked ? "Read only" : "You can edit this"}
                </span>
              </span>
              <span className="dil-template-strip__meta">
                {item.reach} · {recordCountText(item.count)}
              </span>
            </>
          );
          return (
            <li
              className={`dil-template-strip__item${item.current ? " is-current" : ""}`}
              key={item.type}
            >
              {item.href ? (
                <a
                  aria-current={item.current ? "page" : undefined}
                  className="dil-template-strip__link"
                  href={item.href}
                >
                  {body}
                </a>
              ) : (
                <span className="dil-template-strip__link">{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
