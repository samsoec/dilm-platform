import { cookies } from "next/headers";
import type { ViewDescriptionServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { Banner } from "../kit/Banner";
import { Tag } from "../kit/Tag";
import { IrEditNote, ListOnly } from "../ir/IrEditorParts";
import { mediaIntro } from "../media/media";
import { MaterialIcon } from "../MaterialIcon";
import { TitleTag } from "./TitleTag";

type ListIntroNote = { icon: "info"; text: string };

const NOTES: Record<string, ListIntroNote> = {
  "cv-submissions": {
    icon: "info",
    text: "No Create button: records come from the website.",
  },
};

async function tenantDomain({
  payload,
  user,
}: ViewDescriptionServerProps): Promise<string | undefined> {
  if (!user) return undefined;
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (tenant === undefined) return undefined;
  const { docs } = await payload.find({
    collection: "tenants",
    where: { id: { equals: tenant } },
    select: { domain: true },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  return docs[0]?.domain || undefined;
}

async function ConsentIntro(props: ViewDescriptionServerProps) {
  const domain = (await tenantDomain(props)) ?? "the company website";
  return (
    <div className="dil-list-intro">
      <TitleTag>
        <Tag icon="lock">Read-only · UU PDP audit trail</Tag>
      </TitleTag>
      <p className="dil-list-intro__text">
        Written by the system each time a visitor submits a form on {domain}.
        Nobody can add, edit or delete them, including Super Admins.
      </p>
      <Banner
        className="dil-list-intro__banner"
        icon="shield"
        title="No IP address is ever stored."
        tone="info"
      >
        Each record keeps only the time, consent type, policy version and the
        record it belongs to.
      </Banner>
    </div>
  );
}

async function MediaIntro(props: ViewDescriptionServerProps) {
  const domain = (await tenantDomain(props)) ?? "the company website";
  return (
    <div className="dil-list-intro">
      <p className="dil-list-intro__text">{mediaIntro(domain)}</p>
    </div>
  );
}

const BANNERS: Record<string, { title: string; text: string }> = {
  "ir-documents": {
    title: "Goes live within minutes.",
    text: "Saving a document clears the website cache, which keeps disclosures inside the POJK 31/2015 two-business-day window.",
  },
};

export async function ListIntro(props: ViewDescriptionServerProps) {
  return (
    <>
      <ListOnly>
        <ListIntroBody {...props} />
      </ListOnly>
      {props.collectionSlug === "ir-documents" && (
        <IrEditNote domain={await tenantDomain(props)} />
      )}
    </>
  );
}

function ListIntroBody(props: ViewDescriptionServerProps) {
  const { collectionSlug, description } = props;
  if (collectionSlug === "consent-logs") return <ConsentIntro {...props} />;
  if (collectionSlug === "media") return <MediaIntro {...props} />;
  const note = collectionSlug ? NOTES[collectionSlug] : undefined;
  const banner = collectionSlug ? BANNERS[collectionSlug] : undefined;
  return (
    <div className="dil-list-intro">
      {typeof description === "string" && (
        <p className="dil-list-intro__text">{description}</p>
      )}
      {banner && (
        <Banner
          className="dil-list-intro__banner"
          icon="bolt"
          title={banner.title}
          tone="info"
        >
          {banner.text}
        </Banner>
      )}
      {note && (
        <p className="dil-list-intro__note">
          <MaterialIcon name={note.icon} />
          {note.text}
        </p>
      )}
    </div>
  );
}
