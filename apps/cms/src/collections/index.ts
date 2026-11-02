import type { GlobalConfig } from "payload";

import { ConsentLogs } from "./ConsentLogs";
import { CvSubmissions } from "./CvSubmissions";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IrDocuments } from "./IrDocuments";
import { Media } from "./Media";
import { Pages } from "./Pages";
import { SharedPages } from "./SharedPages";
import { TenantSettings } from "./TenantSettings";
import { Tenants } from "./Tenants";
import { Users } from "./Users";

export const collections = [
  Users,
  Tenants,
  TenantSettings,
  Media,
  ConsentLogs,
  IrDocuments,
  CvSubmissions,
  Header,
  Footer,
  Pages,
  SharedPages,
];

export const globals: GlobalConfig[] = [];
