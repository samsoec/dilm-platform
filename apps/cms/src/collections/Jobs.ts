import {
  readPublishedOrMembers,
  trashByEditorsDeleteBySuperAdmins,
} from "../access";
import { collectionLabels } from "../admin/labels";
import { navGroup } from "../admin/navGroups";
import { withTrashedBy } from "../fields/authoring";
import { jobBodyField } from "../fields/jobBody";
import { jobAddressFields } from "../fields/recordFields";
import { lockStructure } from "../fields/structure";
import { withUpdatedBy } from "../fields/updatedBy";
import { JOB_STATUSES, jobSuggestionsHandler } from "../jobs";
import {
  beginLiveChange,
  revalidateOnDelete,
  revalidateOnLiveChange,
} from "../publishRevalidation";
import { stubRevalidator } from "../revalidation";
import { removeRoutes, syncRoutes } from "../routeIndex";
import { requireBase } from "../siteRouting";
import { withTenantAccess } from "../tenancy";
import { PAGE_VERSIONS_PER_DOCUMENT } from "./Pages";

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: { en: "Entry", id: "Pemula" } },
  { value: "mid", label: { en: "Mid", id: "Menengah" } },
  { value: "senior", label: { en: "Senior", id: "Senior" } },
  { value: "lead", label: { en: "Lead", id: "Pemimpin" } },
];

export const JOB_TYPES = [
  { value: "full-time", label: { en: "Full-time", id: "Penuh waktu" } },
  { value: "part-time", label: { en: "Part-time", id: "Paruh waktu" } },
  { value: "contract", label: { en: "Contract", id: "Kontrak" } },
  { value: "internship", label: { en: "Internship", id: "Magang" } },
];

export const todayAsPostedDate = () => new Date().toISOString();

export const Jobs = withTenantAccess(
  withTrashedBy(
    withUpdatedBy({
      slug: "jobs",
      labels: collectionLabels("jobs"),
      access: {
        read: readPublishedOrMembers,
        delete: trashByEditorsDeleteBySuperAdmins,
      },
      versions: { drafts: true, maxPerDoc: PAGE_VERSIONS_PER_DOCUMENT },
      trash: true,
      hooks: {
        beforeChange: [requireBase("jobs"), beginLiveChange],
        afterChange: [syncRoutes, revalidateOnLiveChange(stubRevalidator)],
        afterDelete: [revalidateOnDelete(stubRevalidator)],
        beforeDelete: [removeRoutes],
      },
      endpoints: [
        {
          path: "/suggestions",
          method: "get",
          handler: jobSuggestionsHandler,
        },
      ],
      admin: {
        group: navGroup("content"),
        useAsTitle: "title",
        defaultColumns: [
          "title",
          "department",
          "status",
          "closingDate",
          "_status",
          "updatedAt",
        ],
        listSearchableFields: ["title", "department", "location", "slug"],
      },
      defaultSort: "order",
      custom: { nav: { icon: "work", order: 6 } },
      fields: [
        ...jobAddressFields(),
        ...lockStructure([
          {
            name: "title",
            label: "Title",
            type: "text",
            localized: true,
            required: true,
          },
          {
            name: "summary",
            label: "Summary",
            type: "textarea",
            localized: true,
          },
          {
            name: "department",
            label: "Department",
            type: "text",
            localized: true,
          },
          {
            name: "experienceLevel",
            label: "Experience level",
            type: "select",
            options: EXPERIENCE_LEVELS,
          },
          {
            name: "jobType",
            label: "Job type",
            type: "select",
            options: JOB_TYPES,
          },
          {
            name: "location",
            label: "Location",
            type: "text",
            localized: true,
            admin: {
              description: "For example Jakarta, Indonesia.",
            },
          },
          {
            name: "postedDate",
            label: "Posted date",
            type: "date",
            defaultValue: todayAsPostedDate,
            admin: { date: { pickerAppearance: "dayOnly" } },
          },
          {
            name: "closingDate",
            label: "Closing date",
            type: "date",
            timezone: {
              required: true,
              defaultTimezone: "Asia/Jakarta",
              supportedTimezones: [
                { label: "WIB (Jakarta)", value: "Asia/Jakarta" },
                { label: "WITA (Makassar)", value: "Asia/Makassar" },
                { label: "WIT (Jayapura)", value: "Asia/Jayapura" },
              ],
            },
            admin: {
              date: { pickerAppearance: "dayAndTime", timeIntervals: 15 },
              description:
                "Optional. The job leaves the listings at exactly this date and time, in the time zone chosen beside it (WIB by default). Its page stays reachable without the application form.",
            },
          },
          {
            name: "status",
            label: "Listing status",
            type: "select",
            enumName: "jobs_listing_status",
            required: true,
            defaultValue: "open",
            options: JOB_STATUSES.map((value) => ({
              value,
              label: value === "open" ? "Open" : "Closed",
            })),
            admin: {
              description:
                "Closed jobs leave the Career listing and job sections. Their page stays reachable, without the application form, so shared links still work.",
            },
          },
          jobBodyField({ name: "body", label: "Body" }),
        ]),
      ],
    }),
  ),
);
