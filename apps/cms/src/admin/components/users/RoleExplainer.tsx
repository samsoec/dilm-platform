import { ROLE_LABELS } from "../../../access";
import { MaterialIcon } from "../MaterialIcon";

const ROLES = [
  {
    role: "super-admin",
    text: "Everything, on all three sites. The only role that manages users, tenants and system fields like a site's domain.",
  },
  {
    role: "tenant-editor",
    text: "Reads and edits content on their assigned sites. Can't see Administration.",
  },
  {
    role: "tenant-viewer",
    text: "Reads content on their assigned sites. Can't save anything.",
  },
] as const;

const MATRIX = [
  { label: "Manage users & companies", allowed: [true, false, false] },
  { label: "Edit content", allowed: [true, true, false] },
  { label: "Read content", allowed: [true, true, true] },
  { label: "Edit domain & slug", allowed: [true, false, false] },
];

export function RoleExplainer() {
  return (
    <>
      <p className="dil-list-footer">
        5 wrong passwords in a row lock an account for 10 minutes. Super Admins
        can unlock it sooner.
      </p>
      <aside aria-labelledby="dil-roles-title" className="dil-roles">
        <h2 className="dil-roles__title" id="dil-roles-title">
          What each role can do
        </h2>
        {ROLES.map(({ role, text }) => (
          <section className="dil-roles__card" key={role}>
            <span className={`dil-role-chip dil-role-chip--${role}`}>
              {ROLE_LABELS[role]}
            </span>
            <p>{text}</p>
          </section>
        ))}
        <table className="dil-roles__matrix">
          <thead>
            <tr>
              <th scope="col">
                <span className="dil-sr-only">Permission</span>
              </th>
              <th scope="col" title="Super Admin">
                SA
              </th>
              <th scope="col" title="Tenant Editor">
                TE
              </th>
              <th scope="col" title="Tenant Viewer">
                TV
              </th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map(({ label, allowed }) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {allowed.map((yes, index) => (
                  <td key={index}>
                    {yes ? (
                      <MaterialIcon name="check" />
                    ) : (
                      <span aria-hidden>–</span>
                    )}
                    <span className="dil-sr-only">{yes ? "Yes" : "No"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </>
  );
}
