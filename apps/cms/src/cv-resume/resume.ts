import type {
  CollectionAfterDeleteHook,
  Payload,
  PayloadHandler,
} from "payload";

import {
  hasTenantAccess,
  isTenantEditorOrAbove,
  type RoleHolder,
} from "../access";
import type { CvSubmission } from "../payload-types";

export const RESUME_LINK_SECONDS = 60;

export const RESUME_LINK_ISSUED = "cv-resume-link-issued";
export const RESUME_DELETE_FAILED = "cv-resume-delete-failed";

export interface ResumeStorage {
  head(key: string): Promise<{ contentType?: string } | undefined>;
  presign(input: {
    key: string;
    contentType?: string;
    fileName: string;
    expiresInSeconds: number;
  }): Promise<string>;
  remove(key: string): Promise<void>;
}

export type ResumeStorageFor = (payload: Payload) => ResumeStorage;

export function resumeFileName(key: string): string {
  const base = key.split("/").pop() ?? "";
  const clean = base
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/^[._]+/, "")
    .slice(0, 100);
  return clean || "resume";
}

function reply(
  status: number,
  body: Record<string, unknown>,
  cacheable = false,
): Response {
  return Response.json(body, {
    status,
    headers: cacheable ? undefined : { "Cache-Control": "no-store" },
  });
}

function tenantOf(doc: CvSubmission): number | string | undefined {
  const { tenant } = doc;
  if (tenant === null || tenant === undefined) return undefined;
  return typeof tenant === "object" ? tenant.id : tenant;
}

function errorStatus(error: unknown): number | undefined {
  return (error as { status?: number } | null)?.status;
}

export function resumeLinkHandler(
  storageFor: ResumeStorageFor,
): PayloadHandler {
  return async (req) => {
    const { user, payload } = req;
    if (!user) return reply(401, { message: "Sign in to open a résumé." });
    if (!isTenantEditorOrAbove(user as RoleHolder)) {
      return reply(403, { message: "You can't open résumés." });
    }
    const id = req.routeParams?.id;
    if (typeof id !== "string" && typeof id !== "number") {
      return reply(404, { message: "Application not found." });
    }

    let doc: CvSubmission;
    try {
      doc = await payload.findByID({
        collection: "cv-submissions",
        id,
        depth: 0,
        overrideAccess: false,
        user,
      });
    } catch (error) {
      const status = errorStatus(error);
      if (status === 403) return reply(403, { message: "Not allowed." });
      if (status === 404) {
        return reply(404, { message: "Application not found." });
      }
      throw error;
    }
    const tenant = tenantOf(doc);
    if (tenant === undefined || !hasTenantAccess(user as RoleHolder, tenant)) {
      return reply(403, { message: "Not allowed." });
    }

    const storage = storageFor(payload);
    try {
      const object = await storage.head(doc.resumeFileKey);
      if (!object) {
        return reply(410, {
          message: "Résumé removed after the retention period.",
        });
      }
      const url = await storage.presign({
        key: doc.resumeFileKey,
        contentType: object.contentType,
        fileName: resumeFileName(doc.resumeFileKey),
        expiresInSeconds: RESUME_LINK_SECONDS,
      });
      payload.logger.info({
        event: RESUME_LINK_ISSUED,
        userId: user.id,
        submissionId: doc.submissionId,
        tenant,
        issuedAt: new Date().toISOString(),
      });
      return reply(200, { url, expiresInSeconds: RESUME_LINK_SECONDS });
    } catch (error) {
      payload.logger.error({
        err: error,
        event: "cv-resume-link-failed",
        submissionId: doc.submissionId,
      });
      return reply(502, { message: "Couldn't prepare the link." });
    }
  };
}

export function eraseResume(
  storageFor: ResumeStorageFor,
): CollectionAfterDeleteHook<CvSubmission> {
  return async ({ doc, req: { payload } }) => {
    try {
      await storageFor(payload).remove(doc.resumeFileKey);
    } catch (error) {
      payload.logger.error({
        err: error,
        event: RESUME_DELETE_FAILED,
        submissionId: doc.submissionId,
        resumeFileKey: doc.resumeFileKey,
      });
      throw error;
    }
  };
}
