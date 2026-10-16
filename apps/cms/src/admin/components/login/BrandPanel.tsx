import { PRODUCT_NAME } from "../../brand";
import { Mark } from "../../graphics/Mark";
import { GROUP_ENTITIES_LOGO } from "../../login";

export function BrandPanel() {
  return (
    <aside className="dil-login__brand">
      <div className="dil-login__product">
        <Mark size={20} />
        {PRODUCT_NAME}
      </div>
      <div className="dil-login__pitch">
        <p className="dil-login__headline">
          One place for all company websites
        </p>
        <p className="dil-login__lede">
          Sign in once, then pick which site you&apos;re working on from the
          sidebar.
        </p>
      </div>
      <img
        alt={GROUP_ENTITIES_LOGO.alt}
        className="dil-login__entities"
        height={GROUP_ENTITIES_LOGO.height}
        src={GROUP_ENTITIES_LOGO.src}
        width={GROUP_ENTITIES_LOGO.width}
      />
    </aside>
  );
}
