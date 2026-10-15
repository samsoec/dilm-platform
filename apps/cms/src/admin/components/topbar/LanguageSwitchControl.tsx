"use client";

import { Link, useLocale } from "@payloadcms/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { useId } from "react";

import { localeHref } from "./topbar";

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export function LanguageSwitchControl({ locales }: { locales: string[] }) {
  const { code: current } = useLocale();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const labelId = useId();

  return (
    <div className="dil-lang">
      <span className="dil-lang__label" id={labelId}>
        Content language
      </span>
      <div aria-labelledby={labelId} className="dil-lang__options" role="group">
        {locales.map((code) => {
          const name = languageNames.of(code) ?? code;
          return code === current ? (
            <span
              aria-current="true"
              className="dil-lang__option dil-lang__option--active"
              key={code}
              lang={code}
              title={name}
            >
              {code.toUpperCase()}
            </span>
          ) : (
            <Link
              className="dil-lang__option"
              href={localeHref(pathname, search, code)}
              hrefLang={code}
              key={code}
              lang={code}
              prefetch={false}
              title={`Edit the ${name} content`}
            >
              {code.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
