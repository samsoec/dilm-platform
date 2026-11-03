import type { GlobalConfig } from "payload";

import { Categories } from "./Categories";
import { ConsentLogs } from "./ConsentLogs";
import { CvSubmissions } from "./CvSubmissions";
import { DetailTemplates } from "./DetailTemplates";
import { Documents } from "./Documents";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IrDocuments } from "./IrDocuments";
import { Jobs } from "./Jobs";
import { Media } from "./Media";
import { Pages } from "./Pages";
import { Posts } from "./Posts";
import { Products } from "./Products";
import { RefreshStatus } from "./RefreshStatus";
import { Routes } from "./Routes";
import { SharedDetailTemplates } from "./SharedDetailTemplates";
import { SharedPages } from "./SharedPages";
import { SiteMessages } from "./SiteMessages";
import { SiteRouting } from "./SiteRouting";
import { Solutions } from "./Solutions";
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
  Documents,
  CvSubmissions,
  Header,
  Footer,
  SiteMessages,
  Pages,
  SharedPages,
  Products,
  Solutions,
  Jobs,
  Posts,
  Categories,
  DetailTemplates,
  SharedDetailTemplates,
  Routes,
  RefreshStatus,
];

export const globals: GlobalConfig[] = [SiteRouting];
