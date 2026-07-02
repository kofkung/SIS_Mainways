import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { MenuCategory, Product } from "./types";
import { ArrowRightIcon, ExternalLinkIcon, SparkIcon } from "./icons";

interface ProductPreviewProps {
  category: MenuCategory;
  /** When set, this product is highlighted; otherwise the category blurb is shown. */
  product: Product | null;
  /** Sets the keyed height of the crossfade so the panel doesn't jump. */
  panelId: string;
}

/**
 * Right-hand preview panel. Shows a featured product card when a product is
 * hovered in the SubMenu, crossfading between them via Framer Motion's
 * `AnimatePresence`. Falls back to the category blurb when nothing is hovered.
 */
export function ProductPreview({ category, product, panelId }: ProductPreviewProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <aside
      className="mm-scroll relative hidden w-[360px] shrink-0 overflow-y-auto border-l border-mm-line bg-mm-surface-alt p-7 xl:block"
      aria-label={`${category.label} preview`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {product ? (
          <motion.div
            key={`product-${panelId}-${product.model}`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={transition}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mm-blue">
                Featured
              </span>
              <span className="rounded-full bg-mm-blue-soft px-2.5 py-0.5 text-[11px] font-semibold text-mm-blue-strong">
                {category.label}
              </span>
            </div>

            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4"
            >
              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-mm-line bg-white">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.model}
                    loading="lazy"
                    className="h-full w-full object-contain p-5"
                  />
                ) : (
                  <span className="grid h-16 w-16 place-items-center rounded-xl bg-mm-blue-soft text-2xl font-bold text-mm-blue">
                    {category.label.charAt(0)}
                  </span>
                )}
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-mm-ink/5 p-1.5 text-mm-ink-soft opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold leading-tight text-mm-ink">{product.model}</h4>
                <p className="text-sm font-medium text-mm-ink-soft">{product.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-mm-muted">{product.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-mm-blue group-hover:gap-2.5">
                  View details
                  <ArrowRightIcon className="h-4 w-4 transition-all" />
                </span>
              </div>
            </a>
          </motion.div>
        ) : (
          <motion.div
            key={`blurb-${panelId}`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={transition}
            className="flex h-full flex-col"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mm-blue">
              {category.label}
            </span>

            <div className="mt-4 grid place-items-center">
              <div className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl border border-mm-line bg-white">
                <SparkIcon className="h-10 w-10 text-mm-blue/30" />
              </div>
            </div>

            <h4 className="mt-5 text-lg font-bold leading-snug text-mm-ink">
              {category.label}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-mm-ink-soft">
              {category.blurb ?? `Explore the ${category.label} range.`}
            </p>

            <a
              href="#all"
              className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-mm-blue"
            >
              Browse all {category.label}
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
