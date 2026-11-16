import { describe, expect, it } from "vitest";

import { SiteMessages } from "../collections/SiteMessages";
import { findField, subfields } from "../testing";
import {
  bannerText,
  COOKIE_LINK_NOT_LIVE,
  COOKIE_LINK_OTHER_COMPANY,
  cookiePolicyCheck,
  cookiePolicyCheckLine,
  firstLinkedPageId,
  policyVersionChanged,
  policyVersionWarning,
  POLICY_VERSION_HINT,
  siteMessagesViewerNotice,
} from "./siteMessages";
import { savedToast, viewerNotice } from "./components/document/liveSave";

const body = {
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Read our " },
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: { relationTo: "pages", value: 7 },
            },
            children: [{ type: "text", text: "Cookie Policy" }],
          },
          { type: "text", text: "." },
        ],
      },
    ],
  },
};

describe("site messages screen", () => {
  it("writes the MS-02 warning with the previous version and domain", () => {
    expect(policyVersionWarning("2026-03", "duniakimia.com")).toBe(
      "Was 2026-03. After you save, every visitor to duniakimia.com sees the banner again and analytics pause until they choose.",
    );
  });

  it("only flags a changed policy version", () => {
    expect(policyVersionChanged("2026-03", "2026-03 ").changed).toBe(false);
    expect(policyVersionChanged("2026-03", "2026-04")).toEqual({
      was: "2026-03",
      changed: true,
    });
  });

  it("writes the MS-03 notice for viewers", () => {
    expect(viewerNotice("site-messages", "Dunia Kimia Utama")).toBe(
      "You can view site messages. Editors of Dunia Kimia Utama and Super Admins can change them.",
    );
    expect(siteMessagesViewerNotice(undefined)).toContain("this company");
  });

  it("names the saved toast and the check line", () => {
    expect(savedToast("site-messages", 3, "x.com").title).toBe(
      "Site messages saved · version 3.",
    );
    expect(cookiePolicyCheckLine("/en/cookie-policy")).toBe(
      "Links to Cookie Policy (/en/cookie-policy)",
    );
  });

  it("reads the linked page and the plain banner text", () => {
    expect(firstLinkedPageId(body)).toBe("7");
    expect(bannerText(body)).toBe("Read our Cookie Policy.");
    expect(firstLinkedPageId(null)).toBeUndefined();
  });

  it("puts the hint on the policy version field", () => {
    const banner = subfields(findField(SiteMessages.fields, "cookieBanner"));
    const field = banner.find((f) => "name" in f && f.name === "policyVersion");
    expect(
      (field as { admin?: { description?: string } }).admin?.description,
    ).toBe(POLICY_VERSION_HINT);
  });

  describe("cookie policy check", () => {
    const here = { siteDomain: "duniakimia.com", locale: "en" };
    const page = (extra: object) => ({
      id: 7,
      path: "/en/cookie-policy",
      _status: "published",
      tenant: { id: 1, name: "Dunia", domain: "duniakimia.com" },
      ...extra,
    });

    it("confirms a live page of this company", () => {
      expect(cookiePolicyCheck(page({}), here)).toEqual({
        ok: true,
        text: "Links to Cookie Policy (/en/cookie-policy)",
      });
    });

    it("warns for a draft, trashed or unreadable page", () => {
      for (const doc of [
        page({ _status: "draft" }),
        page({ deletedAt: "2026-01-01" }),
        null,
      ]) {
        expect(cookiePolicyCheck(doc, here)).toEqual({
          ok: false,
          text: COOKIE_LINK_NOT_LIVE,
        });
      }
    });

    it("warns without the path for another company's page", () => {
      const other = page({ tenant: { id: 2, domain: "likutelaga.com" } });
      expect(cookiePolicyCheck(other, here)).toEqual({
        ok: false,
        text: COOKIE_LINK_OTHER_COMPANY,
      });
    });
  });
});
