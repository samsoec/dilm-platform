import type { GlobalConfig } from "payload";

import { ConsentLogs } from "./ConsentLogs";
import { CvSubmissions } from "./CvSubmissions";
import { Documents } from "./Documents";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IrDocuments } from "./IrDocuments";
import { Media } from "./Media";
import { Pages } from "./Pages";
import { Routes } from "./Routes";
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
  Documents,
  CvSubmissions,
  Header,
  Footer,
  Pages,
  SharedPages,
  Routes,
];

export const globals: GlobalConfig[] = [];
