export const LOCKED_ACCOUNT_MESSAGE =
  "Too many attempts. This account is locked for up to 10 minutes, or ask a Super Admin to unlock it.";

export const LOGIN_TRANSLATIONS = {
  en: { error: { userLocked: LOCKED_ACCOUNT_MESSAGE } },
};

export const LOGIN_COMPONENTS = {
  beforeLogin: ["/admin/components/login/LoginIntro#LoginIntro"],
  afterLogin: ["/admin/components/login/LoginFootnote#LoginFootnote"],
  views: {
    login: { Component: "/admin/components/login/LoginScreen#LoginScreen" },
  },
};

export const GROUP_ENTITIES_LOGO = {
  src: "/brand/dil-group-entities.png",
  alt: "Dunia Kimia Utama, Indonesian Acids Industry and Liku Telaga",
  width: 482,
  height: 80,
};
