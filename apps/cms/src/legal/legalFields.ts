import type { DateFieldValidation, FieldHook } from "payload";

import {
  checkLastUpdated,
  layoutFingerprint,
  nextStamp,
  tocEntries,
} from "./legalText";

export const validateLastUpdated: DateFieldValidation = (value) =>
  checkLastUpdated(value);

export const stampTextHook: FieldHook = ({
  data,
  previousSiblingDoc,
  previousValue,
  siblingData,
}) =>
  nextStamp({
    previousStamp: previousValue,
    previousDate: (previousSiblingDoc as { lastUpdated?: unknown } | undefined)
      ?.lastUpdated,
    date: (siblingData as { lastUpdated?: unknown } | undefined)?.lastUpdated,
    current: layoutFingerprint(
      (data as { layout?: unknown } | undefined)?.layout,
    ),
  });

export const tocAnchorsHook: FieldHook = ({ previousValue, siblingData }) => {
  const row = siblingData as
    { body?: unknown; showTableOfContents?: unknown } | undefined;
  if (row?.showTableOfContents !== true) return [];
  if (row.body === undefined) return previousValue ?? [];
  return tocEntries(row.body);
};
