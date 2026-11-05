import { cookies } from "next/headers";
import type { ComponentType } from "react";
import type {
  UIFieldServerProps,
  TextFieldServerProps,
  TextareaFieldServerProps,
  UploadFieldClient,
  UploadFieldServerProps,
} from "payload";

import { hasTenantAccess, type RoleHolder } from "../../../access";
import { localization } from "../../../localization";
import { localeCodes } from "../../../pathCompute";
import {
  blankEditorData,
  loadNewPageEditor,
  loadPageEditor,
  type PageEditorData,
} from "../../data/pageEditor";
import { selectedTenantID } from "../../data/sidebar";
import { Banner } from "../kit/Banner";
import { MediaPickerField } from "../media/MediaPickerField";
import { companyInitials } from "../ir/irEditor";
import type { PageCollection } from "../pages/pagesModel";
import { PagesRetry } from "../pages/PagesRetry";
import { EditorActions } from "./EditorChrome";
import { EditorHeader } from "./EditorHeader";
import { EditorSidebar } from "./EditorSidebar";
import { SectionsPanel, TabMarks } from "./EditorTabs";
import { ForwardNote, SlugFallbackNote } from "./PageSettings";
import { SeoPreview, SeoTextField } from "./SeoFields";
import { relationId } from "./urls";
import type { UrlSeed } from "./useEditorUrls";

const Picker = MediaPickerField as ComponentType<Record<string, unknown>>;

type Props = Pick<
  UIFieldServerProps,
  "payload" | "req" | "id" | "collectionSlug" | "data"
>;

type Loaded = { data: PageEditorData; failed: boolean };

async function loadFor({
  payload,
  req,
  id,
  collectionSlug,
  data,
}: Props): Promise<Loaded> {
  const collection = collectionSlug as PageCollection;
  const user = req.user;
  if (!user) return { data: blankEditorData(collection), failed: true };
  try {
    if (id !== undefined) {
      return {
        data: await loadPageEditor(
          payload,
          user,
          collection,
          String(id),
          String(req.locale ?? localization.defaultLocale),
        ),
        failed: false,
      };
    }
    const owned = relationId(data?.tenant);
    const cookie = (await cookies()).get("payload-tenant")?.value;
    const tenant =
      owned && hasTenantAccess(user as RoleHolder, owned)
        ? owned
        : selectedTenantID(user as RoleHolder, cookie);
    return {
      data: await loadNewPageEditor(
        payload,
        user,
        collection,
        tenant === undefined ? null : String(tenant),
        relationId(data?.parent),
      ),
      failed: false,
    };
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the page editor" });
    return { data: blankEditorData(collection), failed: true };
  }
}

function seedOf(data: PageEditorData, parentId?: string): UrlSeed {
  return {
    collection: data.collection,
    domain: data.company?.domain,
    parentId,
    parentPaths: data.parentPaths,
    slugs: data.slugs,
  };
}

function parentOf(props: Props): string | undefined {
  return relationId(props.data?.parent);
}

function tenantOf(data: PageEditorData) {
  return data.company
    ? { id: data.company.id, domain: data.company.domain }
    : null;
}

export async function HeaderField(props: UIFieldServerProps) {
  const { data, failed } = await loadFor(props);
  return (
    <>
      {failed && (
        <Banner
          action={<PagesRetry />}
          className="dil-editor-banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load the page details. You can still edit the page.
        </Banner>
      )}
      <EditorHeader
        collection={data.collection}
        seed={seedOf(data, parentOf(props))}
        status={data.status}
        tenant={tenantOf(data)}
        untitled="Untitled page"
      />
    </>
  );
}

export async function ActionsField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  return (
    <EditorActions
      ancestors={data.ancestors}
      initials={companyInitials(data.company?.name)}
      seed={seedOf(data, parentOf(props))}
    />
  );
}

export async function TabMarksField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  return <TabMarks defaults={data.seoDefaults} sections={data.sections} />;
}

export async function SectionsPanelField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  return <SectionsPanel sections={data.sections} />;
}

export async function ForwardNoteField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  return (
    <ForwardNote
      seed={seedOf(data, parentOf(props))}
      childCount={data.children}
    />
  );
}

export async function SlugNote(props: TextFieldServerProps) {
  const { data } = await loadFor(props);
  return <SlugFallbackNote seed={seedOf(data, parentOf(props))} />;
}

export async function SeoTitleField(props: TextFieldServerProps) {
  const { data } = await loadFor(props);
  return (
    <SeoTextField
      defaults={data.seoDefaults}
      kind="title"
      label="Search title"
      path={props.path}
    />
  );
}

export async function SeoDescriptionField(props: TextareaFieldServerProps) {
  const { data } = await loadFor(props);
  return (
    <SeoTextField
      defaults={data.seoDefaults}
      kind="description"
      label="Description"
      path={props.path}
    />
  );
}

export async function SeoImageField(props: UploadFieldServerProps) {
  const { data } = await loadFor(props);
  const filename = data.seoDefaults.image?.filename;
  return (
    <Picker
      chooseLabel="Choose image"
      emptyLabel={filename ? `Default: ${filename}` : undefined}
      field={props.clientField as UploadFieldClient}
      path={props.path}
      readOnly={props.readOnly}
    />
  );
}

export async function SeoPreviewField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  return (
    <SeoPreview
      defaults={data.seoDefaults}
      seed={seedOf(data, parentOf(props))}
    />
  );
}

export async function SidebarField(props: UIFieldServerProps) {
  const { data } = await loadFor(props);
  const code = String(props.req.locale ?? localization.defaultLocale);
  const other = localeCodes().find((locale) => locale !== code);
  const names = new Intl.DisplayNames(["en"], { type: "language" });
  return (
    <EditorSidebar
      childCount={data.children}
      collection={data.collection}
      inMenu={data.inMenu}
      languageName={names.of(code) ?? code}
      links={data.links}
      liveSince={data.liveSince}
      otherLanguage={
        other ? { code: other, label: names.of(other) ?? other } : null
      }
      savedAt={data.savedAt}
      savedBy={data.savedBy}
      status={data.status}
      tenant={tenantOf(data)}
      translation={data.translation}
      versions={data.versions}
    />
  );
}
