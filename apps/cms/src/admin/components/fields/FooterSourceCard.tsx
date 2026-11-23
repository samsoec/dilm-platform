import Link from "next/link";
import type { UIFieldServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { documentTenant, loadLayoutSources } from "../../data/layout";

type Kind = "brand" | "contact";

async function logoUrl(
  { payload, req }: Pick<UIFieldServerProps, "payload" | "req">,
  media: unknown,
): Promise<{ url?: string; alt?: string } | undefined> {
  if (media && typeof media === "object" && "url" in media) {
    return media as { url?: string; alt?: string };
  }
  if (typeof media !== "number" && typeof media !== "string") return undefined;
  try {
    return (await payload.findByID({
      collection: "media",
      id: media,
      depth: 0,
      overrideAccess: false,
      user: req.user,
    })) as { url?: string; alt?: string };
  } catch {
    return undefined;
  }
}

export async function FooterSourceCard({
  clientProps,
  data,
  payload,
  req,
}: UIFieldServerProps & { clientProps?: { kind?: Kind } }) {
  const kind: Kind = clientProps?.kind ?? "brand";
  const sources = await loadLayoutSources(
    payload,
    req.user,
    documentTenant(data),
  );
  const href = sources
    ? formatAdminURL({
        adminRoute: payload.config.routes.admin,
        path: `/collections/tenant-settings/${sources.id}?tab=${kind === "brand" ? "brand" : "contact"}`,
      })
    : undefined;
  const edit = href && (
    <Link href={href} prefetch={false}>
      Edit in Company settings →
    </Link>
  );

  if (kind === "brand") {
    const logo = await logoUrl(
      { payload, req },
      sources?.brand?.logoOnDark ?? sources?.brand?.logoOnLight,
    );
    return (
      <div className="dil-source-card">
        <span className="dil-source-card__label">Company logo</span>
        {logo?.url ? (
          <img
            alt={logo.alt ?? ""}
            className="dil-source-card__logo"
            src={logo.url}
          />
        ) : (
          <span className="dil-source-card__missing">
            No logo yet · missing
          </span>
        )}
        {edit}
      </div>
    );
  }

  const rows: [string, string | null | undefined][] = [
    ["Phone", sources?.contactPhone],
    ["Email", sources?.contactEmail],
    ["Address", sources?.brand?.address],
  ];
  return (
    <div className="dil-source-card">
      <dl className="dil-source-card__rows">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              {value?.trim() ? (
                value
              ) : (
                <span className="dil-source-card__missing">Missing</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {edit}
    </div>
  );
}
