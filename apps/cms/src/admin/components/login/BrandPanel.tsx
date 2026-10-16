import { PRODUCT_NAME } from "../../brand";
import { Mark } from "../../graphics/Mark";
import { LOGIN_TENANTS } from "../../login";

export function BrandPanel() {
  return (
    <aside className="dil-login__brand">
      <div className="dil-login__product">
        <Mark size={20} />
        {PRODUCT_NAME}
      </div>
      <div className="dil-login__pitch">
        <p className="dil-login__headline">
          One place for all three company websites.
        </p>
        <p className="dil-login__lede">
          Sign in once, then pick which site you&apos;re working on from the
          sidebar.
        </p>
      </div>
      <ul aria-label="Company websites" className="dil-login__tenants">
        {LOGIN_TENANTS.map(({ slug, name, monogram, color }) => (
          <li className="dil-login__tenant" key={slug}>
            <span
              aria-hidden="true"
              className="dil-login__monogram"
              style={{ background: color }}
            >
              {monogram}
            </span>
            {name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
