import type { ViewDescriptionServerProps } from "payload";

import { MaterialIcon } from "../MaterialIcon";

type ListIntroNote = { icon: "info"; text: string };

const NOTES: Record<string, ListIntroNote> = {
  "cv-submissions": {
    icon: "info",
    text: "No Create button: records come from the website.",
  },
};

export function ListIntro({
  collectionSlug,
  description,
}: ViewDescriptionServerProps) {
  const note = collectionSlug ? NOTES[collectionSlug] : undefined;
  return (
    <div className="dil-list-intro">
      {typeof description === "string" && (
        <p className="dil-list-intro__text">{description}</p>
      )}
      {note && (
        <p className="dil-list-intro__note">
          <MaterialIcon name={note.icon} />
          {note.text}
        </p>
      )}
    </div>
  );
}
