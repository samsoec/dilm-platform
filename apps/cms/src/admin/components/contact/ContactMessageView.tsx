import type { DocumentViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { submittedText } from "../application/application";
import { MaterialIcon } from "../MaterialIcon";
import { ContactEraseCard } from "./ContactEraseCard";
import { deliveryDetail, LOCALE_NAMES } from "./contact";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function ContactMessageView({
  doc,
  initPageResult,
  payload,
}: DocumentViewServerProps) {
  const user = initPageResult.req.user;
  const listPath = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: "/collections/contact-submissions",
  });
  const name = text(doc.fullName);
  const company = text(doc.company);
  const email = text(doc.workEmail);
  const phone = text(doc.phone);
  const locale = text(doc.locale);

  const delivery = [
    {
      key: "team",
      heading: "Team email",
      at: doc.teamNotifiedAt,
      sent: "The team was notified",
      waiting: "Notification is queued and hasn't been sent yet.",
    },
    {
      key: "sender",
      heading: "Sender email",
      at: doc.senderNotifiedAt,
      sent: "The sender was emailed a confirmation",
      waiting: "Confirmation is queued and hasn't been sent yet.",
    },
  ];

  return (
    <div className="dil-app">
      <div className="dil-app__main">
        <nav aria-label="Contact message list" className="dil-app__nav">
          <a className="dil-app__back" href={listPath}>
            <MaterialIcon name="arrow_back" />
            Contact messages
          </a>
        </nav>
        <header className="dil-app__header">
          <div>
            <h1 className="dil-app__name">{name}</h1>
            <p className="dil-app__applied">
              Sent {submittedText(doc.submittedAt)} · {company}
            </p>
          </div>
        </header>

        <section className="dil-app-card">
          <header className="dil-app-card__header">
            <h2>Message</h2>
            <span className="dil-app-card__tag">
              <MaterialIcon name="lock" />
              Read-only
            </span>
          </header>
          <dl className="dil-app-card__list">
            <dt>Name</dt>
            <dd>{name}</dd>
            <dt>Company</dt>
            <dd>{company}</dd>
            <dt>Work email</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>{phone || "Not given"}</dd>
            <dt>Message</dt>
            <dd className="dil-contact__message">{text(doc.message)}</dd>
            <dt>Language</dt>
            <dd>{LOCALE_NAMES[locale] ?? locale}</dd>
            <dt>Submitted</dt>
            <dd>{submittedText(doc.submittedAt)} (Asia/Jakarta)</dd>
          </dl>
        </section>

        <section className="dil-app-card">
          <header className="dil-app-card__header">
            <h2>Delivery</h2>
            <span className="dil-app-card__tag">
              <MaterialIcon name="settings" />
              Managed by the system
            </span>
          </header>
          <div className="dil-app-delivery">
            {delivery.map((cell) => {
              const sent = Boolean(submittedText(cell.at));
              return (
                <div className="dil-app-delivery__cell" key={cell.key}>
                  <span className="dil-app-delivery__heading">
                    {cell.heading}
                  </span>
                  <span
                    className={`dil-app-delivery__state dil-app-delivery__state--${sent ? "ok" : "warn"}`}
                  >
                    <MaterialIcon name={sent ? "check_circle" : "schedule"} />
                    {sent ? "Sent" : "Pending"}
                  </span>
                  <span className="dil-app-delivery__detail">
                    {deliveryDetail(cell.at, cell.sent, cell.waiting)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="dil-app__side">
        <section className="dil-app-panel dil-app-panel--record">
          <h2 className="dil-app-panel__title">Record</h2>
          <p className="dil-app-record__id">
            ID <code>{text(doc.submissionId)}</code>
          </p>
        </section>
        {isSuperAdmin(user as RoleHolder) && (
          <ContactEraseCard
            company={company}
            id={doc.id as number | string}
            name={name}
            returnHref={listPath}
          />
        )}
      </aside>
    </div>
  );
}
