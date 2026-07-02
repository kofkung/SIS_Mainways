import { useCallback, useEffect, useRef } from "react";

/**
 * Open/close a hover-driven menu with a small close delay so the pointer can
 * travel across the gap between the trigger and the panel without the menu
 * snapping shut. `onOpenGuard` lets the caller suppress spurious opens
 * (e.g. when the menu is already open for another trigger).
 */
export function useHoverIntent(
  onOpen: () => void,
  onClose: () => void,
  { openDelay = 60, closeDelay = 140 }: { openDelay?: number; closeDelay?: number } = {},
) {
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>( null);

  const clear = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const requestOpen = useCallback(() => {
    clear();
    openTimer.current = setTimeout(onOpen, openDelay);
  }, [clear, onOpen, openDelay]);

  const requestClose = useCallback(() => {
    clear();
    closeTimer.current = setTimeout(onClose, closeDelay);
  }, [clear, onClose, closeDelay]);

  // Clean up any pending timers on unmount.
  useEffect(() => clear, [clear]);

  return { requestOpen, requestClose, cancelPending: clear };
}

/**
 * Calls `handler` when a pointer/touch event lands outside `ref`.
 * Used to dismiss the mega menu when clicking elsewhere on the page.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}

/**
 * Runs `handler` on Escape. Returns `false` when handled so callers can
 * chain keyboard logic (e.g. only restore focus when we actually closed).
 */
export function useEscape(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handler();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}
