import { PRODUCT_NAME } from "../brand";
import { Mark } from "./Mark";

// TODO(DILM-57): replace the text with the DIL Group wordmark once the design partner supplies it (TRD-UI §13 #1).
export function Logo() {
  return (
    <span className="dil-logo">
      <Mark size={20} />
      {PRODUCT_NAME}
    </span>
  );
}
