"use client";

import {
  FieldLabel,
  useField,
  useForm,
  useFormFields,
  useModal,
} from "@payloadcms/ui";
import type { RadioFieldClientComponent } from "payload";
import { useId, useState } from "react";

import { linkTarget, type LinkValue } from "../../layoutEditor";
import { ConfirmDialog } from "../kit/ConfirmDialog";
import { SegmentedControl } from "../kit/SegmentedControl";

type NavType = "link" | "dropdown";

const OPTIONS = [
  { value: "link", label: "Single link" },
  { value: "dropdown", label: "Dropdown" },
] as const;

export const NavTypeField: RadioFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const fieldPath = path ?? field.name;
  const row = fieldPath.slice(0, fieldPath.lastIndexOf("."));
  const { value, setValue } = useField<NavType>({ path: fieldPath });
  const { removeFieldRow } = useForm();
  const linkType = useFormFields(
    ([fields]) => fields[`${row}.link.type`]?.value as LinkValue["type"],
  );
  const internalPath = useFormFields(
    ([fields]) => fields[`${row}.link.internalPath`]?.value as string | null,
  );
  const externalUrl = useFormFields(
    ([fields]) => fields[`${row}.link.externalUrl`]?.value as string | null,
  );
  const linkLabel = useFormFields(
    ([fields]) => fields[`${row}.link.label`]?.value as string | undefined,
  );
  const label = useFormFields(
    ([fields]) => fields[`${row}.label`]?.value as string | undefined,
  );
  const childCount = useFormFields(
    ([fields]) => fields[`${row}.children`]?.rows?.length ?? 0,
  );
  const dispatch = useFormFields(([, dispatchFields]) => dispatchFields);
  const link: LinkValue = {
    type: linkType,
    internalPath,
    externalUrl,
    label: linkLabel,
  };
  const { openModal } = useModal();
  const slug = `dil-nav-type-${useId().replace(/:/g, "")}`;
  const [pending, setPending] = useState<NavType>();
  const current: NavType = value ?? "link";
  const title = (current === "link" ? link.label : label) || "this item";

  const apply = (next: NavType) => {
    const carried = current === "link" ? link.label : label;
    if (next === "dropdown") {
      dispatch({ type: "UPDATE", path: `${row}.label`, value: carried ?? "" });
      dispatch({
        type: "UPDATE",
        path: `${row}.link.internalPath`,
        value: null,
      });
      dispatch({
        type: "UPDATE",
        path: `${row}.link.externalUrl`,
        value: null,
      });
    } else {
      dispatch({
        type: "UPDATE",
        path: `${row}.link.label`,
        value: carried ?? "",
      });
      for (let index = childCount - 1; index >= 0; index -= 1) {
        removeFieldRow({ path: `${row}.children`, rowIndex: index });
      }
    }
    setValue(next);
  };

  const choose = (next: NavType) => {
    if (next === current) return;
    const hasContent =
      current === "link" ? Boolean(linkTarget(link)) : childCount > 0;
    if (!hasContent) {
      apply(next);
      return;
    }
    setPending(next);
    openModal(slug);
  };

  return (
    <div className="field-type dil-nav-type">
      <FieldLabel label={field.label} path={fieldPath} />
      <SegmentedControl
        disabled={readOnly}
        label="Type"
        onChange={choose}
        options={OPTIONS}
        value={current}
      />
      {pending && (
        <ConfirmDialog
          body={
            <p>
              {pending === "dropdown"
                ? `Its link to ${linkTarget(link)} will be removed.`
                : `Its ${childCount} dropdown ${childCount === 1 ? "link" : "links"} will be removed.`}{" "}
              The label stays. Nothing goes live until you save.
            </p>
          }
          cancelLabel={
            pending === "dropdown" ? "Keep as link" : "Keep as dropdown"
          }
          confirmLabel={
            pending === "dropdown" ? "Make dropdown" : "Make single link"
          }
          icon="swap_horiz"
          onConfirm={() => apply(pending)}
          slug={slug}
          title={`Make “${title}” ${pending === "dropdown" ? "a dropdown" : "a single link"}?`}
          tone="discard"
        />
      )}
    </div>
  );
};
