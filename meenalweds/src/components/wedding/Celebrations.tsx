import { MapPin } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { invitation, type InvitationEvent } from "@/content/invitation";
import { Ornament, Reveal, SectionHeading } from "./primitives";

function DayLabel({ day }: { day: string }) {
  return (
    <Reveal className="mb-6 text-center">
      <p className="text-gold-foil inline-block px-4 py-3 font-script text-5xl leading-[1.5]">{day}</p>
      <Ornament className="mt-2" />
    </Reveal>
  );
}

const ART_PETALS = Array.from({ length: 9 }, (_, i) => ({
  left: (i * 41 + 7) % 95,
  duration: 7 + (i % 4) * 1.5,
  delay: 2 + i * 0.9,
  drift: (i % 2 ? -1 : 1) * (20 + i * 6),
}));
const ART_SPARKS = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 37 + 11) % 90,
  top: (i * 23 + 8) % 70,
  delay: 2.5 + i * 0.5,
}));

function AnimatedArt({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const visible = inView && loaded;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (imgRef.current?.complete) setLoaded(true);
    const io = new IntersectionObserver((e) => e[0]?.isIntersecting && setInView(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("art-frame sheen relative -mx-6 -mb-10 mt-8 overflow-hidden", visible && "is-visible")}
    >
      <div className="art-breathe">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={720}
          height={960}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="art-img block aspect-[3/4] w-full"
        />
      </div>
      {visible && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {ART_PETALS.map((p, i) => (
            <span
              key={`p${i}`}
              className="petal absolute top-0 block h-3 w-2.5"
              style={
                {
                  left: `${p.left}%`,
                  animation: `art-petal ${p.duration}s linear ${p.delay}s infinite`,
                  "--drift": `${p.drift}px`,
                } as CSSProperties
              }
            />
          ))}
          {ART_SPARKS.map((s, i) => (
            <span
              key={`s${i}`}
              className="absolute block h-1.5 w-1.5 rounded-full bg-gold"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animation: `sparkle 3.5s ease-in-out ${s.delay}s infinite` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: InvitationEvent }) {
  return (
    <article aria-label={event.title}>
      <Reveal>
        <div className="rounded-[1.4rem] bg-gold-foil p-[2px] shadow-soft">
          <div className="bg-paper relative w-full overflow-hidden rounded-[1.3rem] px-6 py-10 text-center">
            <h3 className="text-gold-foil inline-block px-2 py-2 font-script text-5xl leading-[1.3]">{event.title}</h3>
            <p className="mt-3 font-display text-xl italic text-sea-deep">{event.date}</p>
            {event.times.map((t) => (
              <p key={t} className="mt-1 font-display text-lg text-ink">
                {t}
              </p>
            ))}
            {event.venue && (
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-sea-deep">{event.venue}</p>
            )}
            {event.note && <p className="mt-3 font-display text-base italic text-muted-foreground">{event.note}</p>}
            {event.host && (
              <>
                <Ornament className="my-5" />
                <p className="font-display text-lg italic text-gold-deep">{event.host}</p>
              </>
            )}
            {event.image && <AnimatedArt src={event.image} alt={`Illustration for ${event.title}`} />}
          </div>
        </div>
      </Reveal>
      {event.directionsUrl && (
        <a
          href={event.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-sea-deep px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-sea-deep transition hover:bg-sea-deep hover:text-primary-foreground"
        >
          <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
          Get Directions
        </a>
      )}
    </article>
  );
}

export function Celebrations() {
  const { heading, subtitle, days } = invitation.celebrations;
  if (days.length === 0) return null;
  return (
    <section className="bg-sea-wash relative py-16">
      <SectionHeading title={heading} subtitle={subtitle || undefined} />
      <div className="mx-auto mt-12 flex max-w-md flex-col gap-20 px-5">
        {days.map((day) => (
          <div key={day.label} className="flex flex-col gap-14">
            {day.events.map((ev, i) => (
              <div key={ev.title}>
                {i === 0 && <DayLabel day={day.label} />}
                <EventCard event={ev} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
