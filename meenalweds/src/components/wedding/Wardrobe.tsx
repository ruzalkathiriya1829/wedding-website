import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { media } from "./media";
import { SectionHeading } from "./primitives";

const LOOKS = [
  { event: "Phoolon Ki Haldi", theme: "Colour Pop", image: media.wardrobeHaldi },
  { event: "Sagai & Sangeet", theme: "Glitz & Glam", image: media.wardrobeNight },
  { event: "Anand Karaj", theme: "Pastels", image: media.wardrobeLaavanPhere },
  { event: "Varmala & Vedi", theme: "Royal Traditionals", image: media.wardrobeSaatVachan },
  { event: "After Party", theme: "Casuals", image: media.wardrobeAfterParty },
];

export function Wardrobe() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = slideRefs.current[i];
    if (!track || !el) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
    setActive(i);
  };

  return (
    <section id="wardrobe" className="bg-sea-wash py-20">
      <SectionHeading
        title="The Wedding Wardrobe"
        subtitle="Outfit ideas are only a guide. Come dressed in what feels best to you and enjoy every moment with us!"
      />
      <div className="relative mx-auto mt-10 max-w-md">
        <div role="region" aria-roledescription="carousel" aria-label="Wardrobe looks" className="relative">
          <div ref={trackRef} className="scrollbar-none snap-x snap-mandatory overflow-x-auto pb-4">
            <div className="flex px-[8%]" style={{ width: "max-content" }}>
              {LOOKS.map((look, i) => (
                <div
                  key={look.event}
                  ref={(el) => {
                    slideRefs.current[i] = el;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${LOOKS.length}`}
                  className="w-[min(84vw,23rem)] shrink-0 snap-center px-1.5"
                >
                  <div className="azulejo-border m-2 overflow-hidden rounded-lg bg-card p-3 text-center shadow-soft sm:p-4">
                    <div className="flex h-24 flex-col items-center justify-center px-1">
                      <h3 className="font-display text-2xl leading-tight text-ink">{look.event}</h3>
                      <p className="text-gold-foil mt-1 font-script text-3xl">{look.theme}</p>
                    </div>
                    <div className="mt-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-paper">
                      <img
                        src={look.image}
                        alt={`${look.event} wardrobe — ${look.theme}`}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous look"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/60 bg-background text-gold-deep shadow-sm transition-colors hover:bg-gold-light/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            {LOOKS.map((look, i) => (
              <button
                key={look.event}
                type="button"
                aria-label={`Go to ${look.event}`}
                aria-current={active === i}
                onClick={() => goTo(i)}
                className="inline-flex h-8 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gold-light/40"
              >
                <span
                  aria-hidden="true"
                  className={cn("h-2 rounded-full transition-all", active === i ? "w-5 bg-gold-foil" : "w-2 bg-gold/40")}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next look"
            disabled={active === LOOKS.length - 1}
            onClick={() => goTo(active + 1)}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/60 bg-background text-gold-deep shadow-sm transition-colors hover:bg-gold-light/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
