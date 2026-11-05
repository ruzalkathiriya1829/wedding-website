import gmLogo from "@/assets/wedding/gm-logo.png.asset.json";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center gap-3 text-gold", className)}>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold" />
      <svg width="34" height="18" viewBox="0 0 34 18" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M17 2c3 4 3 10 0 14-3-4-3-10 0-14z" />
        <path d="M2 9c5-3 10-3 15 0-5 3-10 3-15 0zM32 9c-5-3-10-3-15 0 5 3 10 3 15 0z" />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}

/** Section divider: a thin gold ornament band (cream-and-gold style). */
export function Wave({ className }: { flip?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("bg-paper w-full py-2", className)}>
      <Ornament />
    </div>
  );
}

/** Fades content up when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/** Couple's initials in the gold-foil script, framed like the original crest. */
export function Monogram({ initials, className }: { initials: readonly [string, string]; className?: string }) {
  return (
    <img
      src={gmLogo.url}
      alt={`${initials[0]} & ${initials[1]} monogram`}
      width={1024}
      height={1024}
      className={cn("mx-auto block aspect-square object-contain", className)}
    />
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string | undefined }) {
  return (
    <Reveal className="mx-auto max-w-xl px-6 text-center">
      <h2 className="text-gold-foil text-4xl font-medium leading-tight sm:text-5xl">{title}</h2>
      <Ornament className="my-5" />
      {subtitle && <p className="font-display text-lg italic leading-relaxed text-muted-foreground">{subtitle}</p>}
    </Reveal>
  );
}
