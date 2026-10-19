import { TENANT_SLUGS, type TenantSlug } from "@dilm/shared-types";

import {
  CV_STATUSES,
  EXTERNAL_SYNC_STATUSES,
} from "../collections/CvSubmissions";
import type { CvSubmission } from "../payload-types";

export const CV_SAMPLE_PREFIX = "seed-cv-";

export type CvSample = Omit<
  CvSubmission,
  "id" | "tenant" | "createdAt" | "updatedAt"
> & { tenantSlug: TenantSlug };

type Status = (typeof CV_STATUSES)[number];
type SyncStatus = (typeof EXTERNAL_SYNC_STATUSES)[number];

export const SYNC_CASES: { status: SyncStatus; attempts: number }[] = [
  { status: "pending", attempts: 0 },
  { status: "synced", attempts: 1 },
  { status: "synced", attempts: 3 },
  { status: "failed", attempts: 1 },
  { status: "failed", attempts: 5 },
];

export const EMAIL_CASES = [
  { applicant: false, recruiter: false },
  { applicant: true, recruiter: false },
  { applicant: false, recruiter: true },
  { applicant: true, recruiter: true },
] as const;

const FIRST_NAMES = [
  "Rani",
  "Budi",
  "Siti",
  "Agus",
  "Dewi",
  "Hendra",
  "Putri",
  "Rizky",
  "Ayu",
  "Fajar",
  "Intan",
  "Yoga",
  "Nadia",
  "Bayu",
  "Larasati",
  "Arief",
];

const LAST_NAMES = [
  "Saputra",
  "Hartono",
  "Wulandari",
  "Pratama",
  "Lestari",
  "Gunawan",
  "Santoso",
  "Nugroho",
  "Kusuma",
  "Halim",
  "Siregar",
  "Simanjuntak",
  "Wibowo",
];

const POSITIONS: Record<TenantSlug, string[]> = {
  indoacid: [
    "Process Engineer",
    "Plant Operator",
    "QHSE Officer",
    "Maintenance Technician",
    "Sales Executive",
  ],
  duniakimia: [
    "Chemist",
    "Laboratory Analyst",
    "Supply Chain Planner",
    "Regulatory Affairs Specialist",
    "Key Account Manager",
  ],
  likutelaga: [
    "Production Supervisor",
    "Quality Control Analyst",
    "Warehouse Coordinator",
    "Finance Staff",
    "Sustainability Officer",
  ],
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type EdgeCase = {
  key: string;
  applicantName: string;
  email?: string;
  phone?: string;
  position?: string;
  age: number;
  status: Status;
  sync: { status: SyncStatus; attempts: number };
  applicant: boolean;
  recruiter: boolean;
};

const EDGE_CASES: EdgeCase[] = [
  {
    key: "just-now",
    applicantName: "Citra Maharani",
    age: 2 * MINUTE,
    status: "received",
    sync: { status: "pending", attempts: 0 },
    applicant: false,
    recruiter: false,
  },
  {
    key: "long-name",
    applicantName:
      "Raden Mas Muhammad Iskandar Wirjosandjojo Hadikusumo Prawirodirdjo",
    age: 3 * DAY,
    status: "reviewed",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "single-name",
    applicantName: "Sukarno",
    age: 5 * DAY,
    status: "received",
    sync: { status: "synced", attempts: 2 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "apostrophe",
    applicantName: "Maria D'Souza",
    age: 8 * DAY,
    status: "shortlisted",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "accents",
    applicantName: "José Ramírez Nuñez",
    age: 12 * DAY,
    status: "rejected",
    sync: { status: "failed", attempts: 2 },
    applicant: true,
    recruiter: false,
  },
  {
    key: "long-email",
    applicantName: "Kurniawati Purnamasari",
    email:
      "kurniawati.purnamasari.applications.2026.chemical.engineering@subdomain.example.com",
    age: 20 * DAY,
    status: "received",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "long-position",
    applicantName: "Teguh Prasetyo",
    position:
      "Senior Process Safety Engineer – Sulphuric Acid & Downstream Derivatives Plant (Rotating Shift)",
    age: 30 * DAY,
    status: "shortlisted",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "many-retries",
    applicantName: "Wahyu Hidayat",
    age: 45 * DAY,
    status: "received",
    sync: { status: "failed", attempts: 12 },
    applicant: true,
    recruiter: false,
  },
  {
    key: "international-phone",
    applicantName: "Lim Wei Ling",
    phone: "+65 6123 4567",
    age: 90 * DAY,
    status: "reviewed",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
  {
    key: "year-old",
    applicantName: "Bambang Sutrisno",
    age: 365 * DAY,
    status: "rejected",
    sync: { status: "synced", attempts: 1 },
    applicant: true,
    recruiter: true,
  },
];

function emailFor(name: string, id: string): string {
  const local = name
    .normalize("NFD")
    .replace(/[^\w\s]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".");
  return `${local}.${id.slice(-4)}@example.com`;
}

function phoneFor(index: number): string {
  return `+62 812 ${String(3000 + index).padStart(4, "0")} ${String(
    1000 + ((index * 37) % 9000),
  ).padStart(4, "0")}`;
}

function iso(time: number): string {
  return new Date(time).toISOString();
}

function sample(
  tenantSlug: TenantSlug,
  id: string,
  index: number,
  fields: {
    applicantName: string;
    email?: string;
    phone?: string;
    position: string;
    submittedAt: number;
    status: Status;
    sync: { status: SyncStatus; attempts: number };
    applicant: boolean;
    recruiter: boolean;
  },
): CvSample {
  const submissionId = `${CV_SAMPLE_PREFIX}${tenantSlug}-${id}`;
  return {
    tenantSlug,
    submissionId,
    applicantName: fields.applicantName,
    email: fields.email ?? emailFor(fields.applicantName, submissionId),
    phone: fields.phone ?? phoneFor(index),
    position: fields.position,
    resumeFileKey: `${CV_SAMPLE_PREFIX}resumes/${tenantSlug}/${id}.pdf`,
    submittedAt: iso(fields.submittedAt),
    status: fields.status,
    applicantNotifiedAt: fields.applicant
      ? iso(fields.submittedAt + MINUTE)
      : null,
    recruiterNotifiedAt: fields.recruiter
      ? iso(fields.submittedAt + 2 * MINUTE)
      : null,
    externalSyncStatus: fields.sync.status,
    externalSyncAttempts: fields.sync.attempts,
    externalSyncTriedAt:
      fields.sync.attempts > 0 ? iso(fields.submittedAt + 3 * MINUTE) : null,
  };
}

export function cvSamples(now: Date = new Date()): CvSample[] {
  const end = now.getTime();
  return TENANT_SLUGS.flatMap((tenantSlug, tenantIndex) => {
    const positions = POSITIONS[tenantSlug];
    const matrix = CV_STATUSES.flatMap((status) =>
      SYNC_CASES.flatMap((sync) =>
        EMAIL_CASES.map((emails) => ({ status, sync, ...emails })),
      ),
    ).map((combo, index) => {
      const seed = tenantIndex * 7 + index;
      const name = `${FIRST_NAMES[seed % FIRST_NAMES.length]} ${
        LAST_NAMES[(seed * 5) % LAST_NAMES.length]
      }`;
      return sample(tenantSlug, String(index + 1).padStart(3, "0"), seed, {
        applicantName: name,
        position: positions[index % positions.length],
        submittedAt: end - (index * 29 * HOUR + tenantIndex * 3 * HOUR),
        ...combo,
      });
    });
    const edges = EDGE_CASES.map((edge, index) =>
      sample(tenantSlug, edge.key, 500 + tenantIndex * 20 + index, {
        ...edge,
        position: edge.position ?? positions[index % positions.length],
        submittedAt: end - edge.age,
      }),
    );
    return [...matrix, ...edges];
  });
}
