import { PROFILE_READERS } from "./profileReaders";

export function ProfileUsedBy() {
  return (
    <div className="dil-profile-used">
      <span className="field-label">Used by</span>
      <ul className="dil-profile-used__list">
        {PROFILE_READERS.map((reader) => (
          <li key={reader}>{reader}</li>
        ))}
      </ul>
    </div>
  );
}
