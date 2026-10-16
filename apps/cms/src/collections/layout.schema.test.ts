import { describe, expect, it } from "vitest";

import { schemaShape } from "../schemaShape";
import { applyMultiTenant } from "../testing";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

describe("header and footer data shape (DILM-61)", () => {
  it.each(["header", "footer"])(
    "keeps every %s data path, so the editor restyle needs no migration",
    async (slug) => {
      const collection = (
        await applyMultiTenant([Users, Tenants, Header, Footer])
      )(slug);
      expect(schemaShape(collection.fields).sort()).toMatchSnapshot();
    },
  );
});
