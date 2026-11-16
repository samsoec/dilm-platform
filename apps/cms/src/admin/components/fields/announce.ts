export function announce(message: string) {
  let region = document.getElementById("dil-row-announcer");
  if (!region) {
    region = document.createElement("div");
    region.id = "dil-row-announcer";
    region.className = "dil-sr-only";
    region.setAttribute("aria-live", "assertive");
    document.body.append(region);
  }
  region.textContent = message;
}
