import {
  FOOTER_SECTIONS,
  type FooterSection,
  sectionId,
} from "../../layoutEditor";

export function SectionLabel({
  section,
}: {
  section: FooterSection["anchor"];
}) {
  const { anchor, number, title } = FOOTER_SECTIONS.find(
    (candidate) => candidate.anchor === section,
  )!;
  return (
    <h2 className="dil-section-label" id={sectionId(anchor)}>
      <span className="dil-section-label__number">{number}</span>
      {title}
    </h2>
  );
}
