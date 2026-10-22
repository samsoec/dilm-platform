import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { testUser } from "../testing";
import {
  eraseResume,
  RESUME_DELETE_FAILED,
  RESUME_LINK_ISSUED,
  RESUME_LINK_SECONDS,
  resumeFileName,
  resumeLinkHandler,
  type ResumeStorage,
} from "./resume";

const DOC = {
  id: 7,
  submissionId: "5b6f3c1e-0000-4000-8000-000000000001",
  tenant: 2,
  resumeFileKey: "resumes/duniakimia/5b6f3c1e.pdf",
};

function storage(overrides: Partial<ResumeStorage> = {}): ResumeStorage {
  return {
    head: vi.fn().mockResolvedValue({ contentType: "application/pdf" }),
    presign: vi.fn().mockResolvedValue("https://s3.example/signed"),
    remove: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function setup(
  user: object | null,
  {
    find = () => Promise.resolve(DOC),
    store = storage(),
  }: { find?: () => Promise<unknown>; store?: ResumeStorage } = {},
) {
  const logger = { info: vi.fn(), error: vi.fn() };
  const req = {
    user,
    routeParams: { id: "7" },
    payload: { findByID: vi.fn(find), logger },
  } as unknown as PayloadRequest;
  const handle = () => resumeLinkHandler(() => store)(req);
  return { handle, logger, store, req };
}

describe("GET /api/cv-submissions/:id/resume", () => {
  it("gives an editor a 60-second link, uncached", async () => {
    const { handle, store, req } = setup(testUser(["tenant-editor"], [2]));
    const response = await handle();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({
      url: "https://s3.example/signed",
      expiresInSeconds: 60,
    });
    expect(store.presign).toHaveBeenCalledWith({
      key: DOC.resumeFileKey,
      contentType: "application/pdf",
      fileName: "5b6f3c1e.pdf",
      expiresInSeconds: RESUME_LINK_SECONDS,
    });
    expect(req.payload.findByID).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false, id: "7" }),
    );
  });

  it("lets a Super Admin open any company's résumé", async () => {
    const { handle } = setup(testUser(["super-admin"]));
    expect((await handle()).status).toBe(200);
  });

  it("refuses a Tenant Viewer without loading the record", async () => {
    const { handle, req } = setup(testUser(["tenant-viewer"], [2]));
    expect((await handle()).status).toBe(403);
    expect(req.payload.findByID).not.toHaveBeenCalled();
  });

  it("refuses a signed-out caller", async () => {
    const { handle } = setup(null);
    expect((await handle()).status).toBe(401);
  });

  it("answers 404 when read access hides another company's record", async () => {
    const { handle } = setup(testUser(["tenant-editor"], [3]), {
      find: () =>
        Promise.reject(Object.assign(new Error("nf"), { status: 404 })),
    });
    expect((await handle()).status).toBe(404);
  });

  it("answers 403 when the record belongs to a company the editor lacks", async () => {
    const { handle, store } = setup(testUser(["tenant-editor"], [3]));
    expect((await handle()).status).toBe(403);
    expect(store.presign).not.toHaveBeenCalled();
  });

  it("answers 410 once the lifecycle rule has removed the object", async () => {
    const store = storage({ head: vi.fn().mockResolvedValue(undefined) });
    const { handle, logger } = setup(testUser(["tenant-editor"], [2]), {
      store,
    });
    expect((await handle()).status).toBe(410);
    expect(store.presign).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("answers 502 and logs when storage fails", async () => {
    const store = storage({
      head: vi.fn().mockRejectedValue(new Error("boom")),
    });
    const { handle, logger } = setup(testUser(["tenant-editor"], [2]), {
      store,
    });
    expect((await handle()).status).toBe(502);
    expect(logger.error).toHaveBeenCalled();
  });

  it("logs one line per issued link with ids only", async () => {
    const { handle, logger } = setup(testUser(["tenant-editor"], [2]));
    await handle();
    expect(logger.info).toHaveBeenCalledTimes(1);
    const line = logger.info.mock.calls[0][0];
    expect(line).toEqual({
      event: RESUME_LINK_ISSUED,
      userId: 99,
      submissionId: DOC.submissionId,
      tenant: 2,
      issuedAt: expect.any(String),
    });
  });
});

describe("resumeFileName", () => {
  it("keeps the base name and strips anything unsafe", () => {
    expect(resumeFileName('resumes/dku/Budi Santoso (CV)".pdf')).toBe(
      "Budi_Santoso_CV_.pdf",
    );
    expect(resumeFileName("resumes/dku/")).toBe("resume");
    expect(resumeFileName("a/../.hidden")).toBe("hidden");
  });
});

describe("eraseResume", () => {
  const run = (store: ResumeStorage) => {
    const logger = { error: vi.fn() };
    const hook = eraseResume(() => store);
    return {
      logger,
      result: hook({
        doc: DOC,
        req: { payload: { logger } },
      } as unknown as Parameters<typeof hook>[0]),
    };
  };

  it("deletes the résumé object with the application", async () => {
    const store = storage();
    await run(store).result;
    expect(store.remove).toHaveBeenCalledWith(DOC.resumeFileKey);
  });

  it("logs a failed delete with an alarm event and rethrows it", async () => {
    const failure = new Error("denied");
    const { logger, result } = run(
      storage({ remove: vi.fn().mockRejectedValue(failure) }),
    );
    await expect(result).rejects.toBe(failure);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: RESUME_DELETE_FAILED,
        submissionId: DOC.submissionId,
      }),
    );
  });
});
