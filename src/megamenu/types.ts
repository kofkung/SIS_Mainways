/**
 * Domain types for the Mega Menu.
 *
 * The menu is three levels deep:
 *   Level 1  NavLink        (top nav items)            -> MenuColumn
 *   Level 2  MenuCategory   (product families)         -> SubMenu
 *   Level 3  MenuGroup      (sub-family groupings)     -> ProductPreview items
 *
 * A leaf product lives inside a group and is what the ProductPreview panel
 * highlights when hovered.
 */

/** A single product card. `img` is optional so groups without imagery degrade gracefully. */
export interface Product {
  model: string;
  name: string;
  desc: string;
  url: string;
  img?: string;
}

/** Level 3: a named sub-family that groups related products together. */
export interface MenuGroup {
  id: string;
  name: string;
  /** Optional short tagline shown above the product list. */
  tagline?: string;
  products: Product[];
}

/**
 * Level 2: a top-level product family.
 * `blurb` powers the ProductPreview fallback when no product is hovered.
 */
export interface MenuCategory {
  id: string;
  label: string;
  blurb?: string;
  groups: MenuGroup[];
}

/** Optional metadata describing the whole menu (used for the preview header). */
export interface MenuMeta {
  /** Accent label shown in the panel header, e.g. "Products". */
  title: string;
  /** Supporting line under the title. */
  subtitle?: string;
}

/**
 * Level 1: a top navigation entry.
 * - Simple links (no children) set `href`.
 * - Mega-menu triggers set `categories` (and optionally `meta`).
 */
export interface NavLink {
  id: string;
  label: string;
  href?: string;
  categories?: MenuCategory[];
  meta?: MenuMeta;
}

/** The full menu payload consumed by <Navbar/>. */
export interface MenuData {
  links: NavLink[];
}
