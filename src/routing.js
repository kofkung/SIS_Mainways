export const ROUTES = ["home", "about", "services", "projects", "products", "contact"];

export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function buildRoutePath(base, param = null) {
  const root = base === "home" ? "" : `/${base}`;
  if (!param) return root || "/";

  const encodedParam = String(param)
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${root}/${encodedParam}` || "/";
}

export function parseLocation(locationLike = window.location) {
  const legacyHash = locationLike.hash.replace(/^#/, "").trim();
  if (legacyHash) {
    const legacyParts = legacyHash.split("/");
    const legacyBase = legacyParts.shift();
    if (ROUTES.includes(legacyBase)) {
      return {
        base: legacyBase,
        param: legacyParts.length ? safeDecode(legacyParts.join("/")) : null,
        legacy: true,
      };
    }
  }

  const pathParts = locationLike.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => safeDecode(segment));
  const base = pathParts.shift() || "home";

  if (!ROUTES.includes(base)) {
    return { base: "not-found", param: null, legacy: false };
  }

  return {
    base,
    param: pathParts.length ? pathParts.join("/") : null,
    legacy: false,
  };
}

export function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
