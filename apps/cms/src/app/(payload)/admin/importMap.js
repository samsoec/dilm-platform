import { WatchTenantCollection as WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { TenantField as TenantField_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { AssignTenantFieldTrigger as AssignTenantFieldTrigger_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { ApplicantCell as ApplicantCell_7d689808f13b47761e1d62f9f1b09ab3 } from '../../../admin/components/cells/ApplicantCell'
import { StatusPill as StatusPill_9934788374c7dcc43b168cee27281175 } from '../../../admin/components/cells/StatusPill'
import { EmailsCell as EmailsCell_de9a1a0984bb6486b79db023ef9c2b31 } from '../../../admin/components/cells/EmailsCell'
import { SyncCell as SyncCell_13a9042bb703672b7e066a238d36fdc6 } from '../../../admin/components/cells/SyncCell'
import { CvLegend as CvLegend_d18e2a144d657f22f115d8084e621594 } from '../../../admin/components/lists/CvLegend'
import { StatusTabs as StatusTabs_c467731604d0d3674e06a5e6b3537a04 } from '../../../admin/components/lists/StatusTabs'
import { ListIntro as ListIntro_3758f5318f3bce3eb36c93ddfc96aba0 } from '../../../admin/components/lists/ListIntro'
import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { Avatar as Avatar_5599fe28f2b3157f52fea861e6ba12e6 } from '../../../admin/graphics/Avatar'
import { AdminNav as AdminNav_61caf5a364251c10976dd7df6a186775 } from '../../../admin/components/nav/AdminNav'
import { Icon as Icon_48a75e37b0630d5b8c8066e180c0e6ef } from '../../../admin/graphics/Icon'
import { Logo as Logo_88541c286955dbac4d90fb5ed606381c } from '../../../admin/graphics/Logo'
import { TopBarActions as TopBarActions_4c8de44916aff9faf4c4d2c3f1ea8046 } from '../../../admin/components/topbar/TopBarActions'
import { GlobalViewRedirect as GlobalViewRedirect_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { LoginFootnote as LoginFootnote_fe03b3a75690de7b47667ac8353bb056 } from '../../../admin/components/login/LoginFootnote'
import { LoginIntro as LoginIntro_8a7a25ec3456ee26918acab06c86f8c2 } from '../../../admin/components/login/LoginIntro'
import { TenantSelector as TenantSelector_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { TenantSelectionProvider as TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { ShellCrumbs as ShellCrumbs_2655bbb4d61960264c14c8889231a4e5 } from '../../../admin/components/topbar/ShellCrumbs'
import { LoginScreen as LoginScreen_22f500d6dd68e64c5e8155425d1d2e99 } from '../../../admin/components/login/LoginScreen'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'

/** @type import('payload').ImportMap */
export const importMap = {
  "@payloadcms/plugin-multi-tenant/client#WatchTenantCollection": WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a,
  "@payloadcms/plugin-multi-tenant/client#TenantField": TenantField_1d0591e3cf4f332c83a86da13a0de59a,
  "@payloadcms/plugin-multi-tenant/client#AssignTenantFieldTrigger": AssignTenantFieldTrigger_1d0591e3cf4f332c83a86da13a0de59a,
  "/admin/components/cells/ApplicantCell#ApplicantCell": ApplicantCell_7d689808f13b47761e1d62f9f1b09ab3,
  "/admin/components/cells/StatusPill#StatusPill": StatusPill_9934788374c7dcc43b168cee27281175,
  "/admin/components/cells/EmailsCell#EmailsCell": EmailsCell_de9a1a0984bb6486b79db023ef9c2b31,
  "/admin/components/cells/SyncCell#SyncCell": SyncCell_13a9042bb703672b7e066a238d36fdc6,
  "/admin/components/lists/CvLegend#CvLegend": CvLegend_d18e2a144d657f22f115d8084e621594,
  "/admin/components/lists/StatusTabs#StatusTabs": StatusTabs_c467731604d0d3674e06a5e6b3537a04,
  "/admin/components/lists/ListIntro#ListIntro": ListIntro_3758f5318f3bce3eb36c93ddfc96aba0,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#LexicalDiffComponent": LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "/admin/graphics/Avatar#Avatar": Avatar_5599fe28f2b3157f52fea861e6ba12e6,
  "/admin/components/nav/AdminNav#AdminNav": AdminNav_61caf5a364251c10976dd7df6a186775,
  "/admin/graphics/Icon#Icon": Icon_48a75e37b0630d5b8c8066e180c0e6ef,
  "/admin/graphics/Logo#Logo": Logo_88541c286955dbac4d90fb5ed606381c,
  "/admin/components/topbar/TopBarActions#TopBarActions": TopBarActions_4c8de44916aff9faf4c4d2c3f1ea8046,
  "@payloadcms/plugin-multi-tenant/rsc#GlobalViewRedirect": GlobalViewRedirect_d6d5f193a167989e2ee7d14202901e62,
  "/admin/components/login/LoginFootnote#LoginFootnote": LoginFootnote_fe03b3a75690de7b47667ac8353bb056,
  "/admin/components/login/LoginIntro#LoginIntro": LoginIntro_8a7a25ec3456ee26918acab06c86f8c2,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelector": TenantSelector_d6d5f193a167989e2ee7d14202901e62,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider": TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62,
  "/admin/components/topbar/ShellCrumbs#ShellCrumbs": ShellCrumbs_2655bbb4d61960264c14c8889231a4e5,
  "/admin/components/login/LoginScreen#LoginScreen": LoginScreen_22f500d6dd68e64c5e8155425d1d2e99,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24
}
