export type LocalizedLabel = { en: string; id: string };

export type CollectionLabels = {
  singular: LocalizedLabel;
  plural: LocalizedLabel;
};

export const COLLECTION_LABELS = {
  header: {
    singular: { en: "Header", id: "Header" },
    plural: { en: "Header", id: "Header" },
  },
  footer: {
    singular: { en: "Footer", id: "Footer" },
    plural: { en: "Footer", id: "Footer" },
  },
  "cv-submissions": {
    singular: { en: "Career application", id: "Lamaran kerja" },
    plural: { en: "Career applications", id: "Lamaran kerja" },
  },
  "consent-logs": {
    singular: { en: "Consent record", id: "Catatan persetujuan" },
    plural: { en: "Consent records", id: "Catatan persetujuan" },
  },
  "ir-documents": {
    singular: { en: "IR document", id: "Dokumen IR" },
    plural: { en: "IR documents", id: "Dokumen IR" },
  },
  documents: {
    singular: { en: "Document", id: "Dokumen" },
    plural: { en: "Documents", id: "Dokumen" },
  },
  media: {
    singular: { en: "Image", id: "Gambar" },
    plural: { en: "Media library", id: "Pustaka media" },
  },
  "tenant-settings": {
    singular: { en: "Company settings", id: "Pengaturan perusahaan" },
    plural: { en: "Company settings", id: "Pengaturan perusahaan" },
  },
  pages: {
    singular: { en: "Page", id: "Halaman" },
    plural: { en: "Pages", id: "Halaman" },
  },
  "shared-pages": {
    singular: { en: "Shared page", id: "Halaman bersama" },
    plural: { en: "Shared pages", id: "Halaman bersama" },
  },
  routes: {
    singular: { en: "Route", id: "Rute" },
    plural: { en: "Routes", id: "Rute" },
  },
  redirects: {
    singular: { en: "Redirect", id: "Pengalihan" },
    plural: { en: "Redirects", id: "Pengalihan" },
  },
  tenants: {
    singular: { en: "Company", id: "Perusahaan" },
    plural: { en: "Companies", id: "Perusahaan" },
  },
  users: {
    singular: { en: "User", id: "Pengguna" },
    plural: { en: "Users", id: "Pengguna" },
  },
} as const satisfies Record<string, CollectionLabels>;

export type LabelledSlug = keyof typeof COLLECTION_LABELS;

export function collectionLabels(slug: LabelledSlug): CollectionLabels {
  return COLLECTION_LABELS[slug];
}
