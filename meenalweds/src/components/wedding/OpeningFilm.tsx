import { useEffect, useState } from "react";
import { media } from "./media";
import goldenTemple from "@/assets/golden-temple.jpg";
import { invitation } from "@/content/invitation";
import { cn } from "@/lib/utils";
import { Monogram, Ornament } from "./primitives";

const cover = invitation.cover;

/** Opening: Ik Onkar, Gurbani shabad and the Golden Temple, revealed after "Tap to Open". */
export function OpeningFilm({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    onOpen();
  };

  return (
    <section className="bg-paper relative h-[100svh] w-full overflow-hidden" aria-label="Opening">
      <video
        src={media.templeLoop}
        poster={goldenTemple}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Sri Harmandir Sahib, the Golden Temple"
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-bottom transition-transform duration-[4000ms] ease-out",
          opened ? "scale-100" : "scale-110",
        )}
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center px-6 pt-[9svh] text-center">
        <p
          lang="pa"
          aria-label="Ik Onkar"
          className={cn(
            "text-gold-foil font-display text-7xl leading-none transition-all delay-300 duration-[1600ms]",
            opened ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          ੴ
        </p>
        {invitation.shabad && (
          <div
            className={cn(
              "transition-all delay-[1200ms] duration-[1600ms]",
              opened ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <p lang="pa" className="mt-6 whitespace-pre-line font-display text-xl leading-relaxed text-sea-deep">
              {invitation.shabad}
            </p>
            <Ornament className="mt-5" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "bg-paper fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-[1200ms]",
          opened && "pointer-events-none opacity-0",
        )}
        aria-hidden={opened}
      >
        <div className="azulejo-border relative flex h-full max-h-[720px] w-full max-w-md flex-col items-center justify-center rounded-[2rem] bg-card/50 px-6 text-center backdrop-blur-sm">
          <Monogram initials={invitation.couple.initials} className="animate-float mb-6 w-36 text-[9rem]" />
          <p className="mb-2 text-[0.65rem] uppercase tracking-[0.45em] text-sea-deep">{cover.place}</p>
          <h1 className="text-gold-foil font-display text-4xl font-medium leading-tight">{cover.heading}</h1>
          <p className="mt-4 font-display text-lg italic text-muted-foreground">{cover.tagline}</p>
          <button
            type="button"
            onClick={handleOpen}
            tabIndex={opened ? -1 : 0}
            className="sheen bg-gold-foil animate-pulse-glow mt-10 cursor-pointer rounded-full px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-primary-foreground shadow-gold"
          >
            {cover.button}
          </button>
          <p className="mt-5 text-[0.65rem] tracking-widest text-muted-foreground">{cover.hint}</p>
        </div>
      </div>
    </section>
  );
}
