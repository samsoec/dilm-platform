import { Banner } from "../kit/Banner";

export function DomainWarning() {
  return (
    <Banner className="dil-company-field__warning" tone="warning">
      Changing the slug or domain affects the live site and its links. Check
      with the website team first.
    </Banner>
  );
}
