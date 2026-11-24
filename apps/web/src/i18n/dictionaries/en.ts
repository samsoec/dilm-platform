export const en = {
  nav: {
    skipToContent: "Skip to content",
    home: "Home",
    language: "Language",
  },
  errors: {
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist.",
    genericTitle: "Something went wrong",
    retry: "Try again",
  },
  form: {
    submit: "Submit",
    required: "This field is required",
  },
} as const;

export type DictionaryShape<T> = {
  [K in keyof T]: T[K] extends string ? string : DictionaryShape<T[K]>;
};

export type Dictionary = DictionaryShape<typeof en>;
