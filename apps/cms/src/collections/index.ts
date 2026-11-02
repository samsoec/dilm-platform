import type { GlobalConfig } from "payload";

import { ConsentLogs } from "./ConsentLogs";
import { CvSubmissions } from "./CvSubmissions";
import { Documents } from "./Documents";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IrDocuments } from "./IrDocuments";
import { Media } from "./Media";
import { Pages } from "./Pages";
import { Products } from "./Products";
import { Routes } from "./Routes";
import { SharedPages } from "./SharedPages";
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
  Pages,
  SharedPages,
  Products,
  Solutions,
  Routes,
];

export const globals: GlobalConfig[] = [];
