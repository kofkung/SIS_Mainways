import { ChevronRightIcon } from "./icons";
import type { MenuCategory } from "./types";

interface MenuColumnProps {
  category: MenuCategory;
  /** id of the currently active group (drives which SubMenu renders). */
  activeGroupId: string;
  /** Switch the active group on hover/focus. */
  onActivateGroup: (groupId: string) => void;
}

/**
 * Level 2: the vertical list of groups within a category. Hovering or
 * focusing a group makes it active, which drives the adjacent SubMenu and
 * the ProductPreview. Rendered both inside the desktop MegaMenu and as the
 * expandable body of the mobile accordion.
 */
export function MenuColumn({ category, activeGroupId, onActivateGroup }: MenuColumnProps) {
  return (
    <ul className="flex flex-col gap-0.5" role="list">
      {category.groups.map((group) => {
        const active = group.id === activeGroupId;
        return (
          <li key={group.id}>
            <button
              type="button"
              aria-pressed={active}
              onMouseEnter={() => onActivateGroup(group.id)}
              onFocus={() => onActivateGroup(group.id)}
              className={[
                "group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors",
                active
                  ? "bg-mm-blue-soft text-mm-blue-strong"
                  : "text-mm-ink hover:bg-mm-surface-alt",
              ].join(" ")}
            >
              <span
                className={[
                  "h-7 w-1 rounded-full transition-colors",
                  active ? "bg-mm-blue" : "bg-transparent",
                ].join(" ")}
                aria-hidden="true"
              />
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-semibold leading-tight">{group.name}</span>
                {group.tagline && (
                  <span className="text-xs font-normal text-mm-muted">{group.tagline}</span>
                )}
              </span>
              <ChevronRightIcon
                className={[
                  "h-4 w-4 shrink-0 transition-transform",
                  active ? "text-mm-blue" : "text-mm-muted group-hover:translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
