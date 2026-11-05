import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import goldenTemple from "@/assets/golden-temple.jpg";
import { invitation } from "@/content/invitation";
import { media } from "./media";
import { Monogram, Ornament, Reveal, SectionHeading, Wave } from "./primitives";

const { couple, welcome, closing } = invitation;

export function Welcome() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoVisible, setLogoVisible] = useState(false);
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries[0]?.isIntersecting && setLogoVisible(true), {
      threshold: 0.08,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="welcome" className="bg-paper relative overflow-hidden pb-6 pt-20">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
        <div
          ref={logoRef}
          className={cn(
            "sheen relative w-64 rounded-full transition-opacity duration-[1400ms] sm:w-80",
            logoVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <Monogram initials={couple.initials} className="w-full text-[16rem] sm:text-[20rem]" />
        </div>
        <Reveal delay={700}>
          <p className="mt-6 font-display text-2xl italic text-sea-deep">{welcome.kicker}</p>
          <p className="mt-2 whitespace-nowrap font-display text-[clamp(1.6rem,8vw,2.25rem)] leading-[1.4] text-ink">
            {couple.groom}{" "}
            <span className="text-gold-foil inline-block px-1 py-1 font-script text-[1.3em] leading-[1.3]">weds</span>{" "}
            {couple.bride}
          </p>
          <Ornament className="my-6" />
          <p className="font-display text-2xl tracking-wide text-ink">{welcome.dates}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-sea-deep">{welcome.venue}</p>
          <p className="mt-1 font-display text-lg italic text-muted-foreground">{welcome.city}</p>
        </Reveal>
      </div>
      <Wave className="mt-14" />
    </section>
  );
}

export function Blessings() {
  const { heading, cards } = invitation.families;
  if (cards.length === 0) return null;
  return (
    <section className="bg-paper px-4 py-16">
      <SectionHeading title={heading} />
      <div className="mx-auto mt-10 flex max-w-lg flex-col gap-10">
        {cards.map((card, i) => (
          <Reveal key={i}>
            <div className="rounded-[1.75rem] bg-gold-foil p-[2px] shadow-soft">
              <div className="bg-paper rounded-[1.65rem] px-6 py-10 text-center">
                <p className="font-display text-lg italic leading-relaxed text-ink">{card.lead}</p>
                <p className="text-gold-foil mt-5 inline-block px-2 py-2 font-script text-4xl leading-[1.3] sm:text-5xl">
                  {card.name}
                </p>
                {card.partner && (
                  <>
                    <p className="mt-2 font-display text-xl italic text-sea-deep">with</p>
                    <p className="text-gold-foil inline-block px-2 py-2 font-script text-4xl leading-[1.3] sm:text-5xl">
                      {card.partner.name}
                    </p>
                    <p className="mt-2 font-display text-base italic text-muted-foreground">{card.partner.parents}</p>
                  </>
                )}
                {card.details && card.details.length > 0 && (
                  <>
                    <Ornament className="my-6" />
                    {card.details.map((d, j) => (
                      <p
                        key={d}
                        className={
                          j === 0
                            ? "font-display text-2xl tracking-wide text-ink"
                            : "mt-3 text-xs uppercase tracking-[0.3em] text-sea-deep"
                        }
                      >
                        {d}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Polaroid({ src, alt, caption, className }: { src: string; alt: string; caption: string; className?: string }) {
  return (
    <figure className={cn("rounded-sm bg-card p-2 pb-8 shadow-soft", className)}>
      <img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full bg-paper object-contain" />
      <figcaption className="mt-2 text-center font-script text-xl text-gold-deep">{caption}</figcaption>
    </figure>
  );
}

export function NoteFromUs() {
  return (
    <section className="bg-paper relative overflow-hidden px-5 py-20">
      <SectionHeading title="A Note From Us" />
      <div className="relative mx-auto mt-10 flex max-w-md items-start justify-between">
        <Reveal className="w-[46%] max-w-[200px] -rotate-3">
          <Polaroid src={media.brideChildhood} alt="Harshita little bride" caption="Harshita" />
        </Reveal>
        <svg
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 z-10 w-16 -translate-x-1/2 text-gold"
          viewBox="0 0 80 60"
        >
          <path
            d="M2 40 C 20 5, 30 55, 40 25 C 50 55, 60 5, 78 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </svg>
        <Heart
          aria-hidden="true"
          className="animate-float absolute left-1/2 top-[44%] z-10 h-6 w-6 -translate-x-1/2 fill-bougainvillea text-bougainvillea"
        />
        <Reveal delay={200} className="mt-8 w-[46%] max-w-[200px] rotate-3">
          <Polaroid src={media.groomChildhood} alt="Rajveer little groom" caption="Rajveer" />
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-14 w-[78%] max-w-xs rotate-1">
        <figure className="rounded-sm bg-card p-3 pb-10 shadow-soft">
          <img
            src={media.coupleRecent}
            alt="Rajveer and Harshita today"
            loading="lazy"
            className="aspect-[4/5] w-full bg-paper object-contain"
          />
          <figcaption className="mt-3 text-center font-script text-2xl text-gold-deep">Us</figcaption>
        </figure>
      </Reveal>
      <Reveal className="mx-auto mt-12 max-w-md text-center font-display text-lg italic leading-relaxed text-ink">
        <p>
          You’ve been a part of our stories, our milestones, and our memories, and now we’re so happy to have you here
          as we start this new chapter together. This celebration feels extra special because it’s being shared with
          the people who have meant so much along the way. We cannot wait to see you there!
        </p>
      </Reveal>
    </section>
  );
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  duration: 10 + (i % 5) * 2,
  delay: i * 1.3,
  drift: (i % 2 === 0 ? -1 : 1) * (30 + i * 4),
}));
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  top: (i * 29) % 100,
  duration: 3 + (i % 4),
  delay: i * 0.4,
}));

export function Farewell() {
  return (
    <section className="bg-paper relative overflow-hidden px-6 pb-28 pt-20 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {PETALS.map((p, i) => (
          <span
            key={`p${i}`}
            className="petal absolute top-0 block h-3 w-2.5"
            style={
              {
                left: `${p.left}%`,
                animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
                "--drift": `${p.drift}px`,
              } as CSSProperties
            }
          />
        ))}
        {SPARKLES.map((s, i) => (
          <span
            key={`s${i}`}
            className="absolute block h-1.5 w-1.5 rounded-full bg-gold"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="relative mx-auto max-w-md">
        <Reveal>
          <Monogram initials={couple.initials} className="animate-float w-44 text-[11rem]" />
          <Ornament className="my-8" />
          <p className="text-gold-foil font-display font-bold uppercase leading-snug">
            <span className="block text-[clamp(0.8rem,4.2vw,1.4rem)] tracking-[0.12em]">{closing.regards}</span>
            {closing.families.map((name) => (
              <span
                key={name}
                className="mt-3 block text-[clamp(0.95rem,4.2vw,1.25rem)] font-extrabold tracking-[0.08em]"
              >
                {name}
              </span>
            ))}
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <Link
            to="/rsvp"
            className="mx-auto inline-flex rounded-full bg-sea-deep px-8 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-primary-foreground shadow-gold transition hover:opacity-90"
          >
            RSVP — Confirm Attendance
          </Link>
        </Reveal>
        {invitation.contacts.length > 0 && (
          <Reveal className="mt-12">
            <p className="text-gold-foil font-display text-2xl font-semibold uppercase tracking-[0.2em]">POC</p>
            <ul className="mt-3 space-y-1.5 font-display text-lg text-ink">
              {invitation.contacts.map((c) => (
                <li key={c.phone}>
                  {c.name} –{" "}
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-sea-deep underline-offset-4 hover:underline">
                    {c.phone}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <a
          href="https://www.shubhamantran.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Designed by Shubhamantran"
          className="mx-auto mt-16 flex w-fit flex-col items-center text-muted-foreground/70 transition hover:text-gold-deep"
        >
          <span className="text-[0.6rem] uppercase">Designed by</span>
          <img src={media.designerLogo} alt="Shubhamantran" loading="lazy" className="-mt-3 h-32 w-32 object-contain" />
        </a>
      </div>
      <video
        src={media.templeLoop}
        poster={goldenTemple}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Sri Harmandir Sahib, the Golden Temple"
        className="relative mt-10 -mb-28 h-[60svh] w-[calc(100%+3rem)] -mx-6 max-w-none object-cover object-bottom"
      />
    </section>
  );
}

export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Play / Pause Music"
      className="fixed bottom-6 right-6 z-40 flex cursor-pointer items-center gap-3 rounded-full border border-gold/60 bg-card/90 px-4 py-2.5 shadow-gold backdrop-blur-md transition-all hover:scale-105"
    >
      <span aria-hidden="true" className="flex h-3.5 items-end gap-1">
        {[0, 0.2, 0.4, 0.1].map((d, i) => (
          <span
            key={i}
            className="h-3.5 w-0.5 origin-bottom rounded-full bg-gold-deep"
            style={{
              animation: playing ? `music-bar 0.9s ease-in-out ${d}s infinite` : "none",
              transform: playing ? undefined : "scaleY(0.35)",
            }}
          />
        ))}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink">
        {playing ? "Pause Music" : "Play Music"}
      </span>
    </button>
  );
}
