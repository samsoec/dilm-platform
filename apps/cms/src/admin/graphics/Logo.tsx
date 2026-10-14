import { PRODUCT_NAME } from "../brand";
import { Mark } from "./Mark";

export function Logo() {
  return (
    <span className="dil-logo">
      <Mark size={20} />
      {PRODUCT_NAME}
    </span>
  );
}
