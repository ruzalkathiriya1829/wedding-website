import { ChevronDown, MapPin, Plane, Ship, TrainFront, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./primitives";

type Route = { id: string; label: string; icon: LucideIcon; body: ReactNode };

const ROUTES: Route[] = [
  {
    id: "air",
    label: "By Air",
    icon: Plane,
    body: (
      <>
        <p className="mb-2">
          <strong className="text-ink">1. Manohar International Airport, Mopa (GOX)</strong> — ~40 km (approx. 50 mins
          drive). Best for most domestic flights.
        </p>
        <p className="mb-2">
          <strong className="text-ink">2. Dabolim Airport, South Goa (GOI)</strong> — ~35 km (approx. 45 mins drive).
        </p>
        <p className="text-xs italic text-gold-deep">
          Prepaid airport taxis are readily available at both airports to the Ribandar ferry terminal.
        </p>
      </>
    ),
  },
  {
    id: "train",
    label: "By Train",
    icon: TrainFront,
    body: (
      <>
        <p className="mb-2">
          <strong className="text-ink">1. Karmali Railway Station (KRMI)</strong> — ~10 km (Closest station, ~15 mins
          to the ferry).
        </p>
        <p className="mb-2">
          <strong className="text-ink">2. Thivim Railway Station (THVM)</strong> — ~25 km (approx. 40 mins).
        </p>
        <p className="mb-2">
          <strong className="text-ink">3. Madgaon Junction (MAO)</strong> — ~40 km (approx. 50 mins).
        </p>
        <p className="text-xs italic text-gold-deep">
          Station taxis are available directly to the Ribandar or Old Goa ferry jetty.
        </p>
      </>
    ),
  },
  {
    id: "road",
    label: "By Road & Ferry",
    icon: Ship,
    body: (
      <>
        <p className="mb-2">
          <strong className="text-ink">The Scenic Ferry Crossing:</strong> Divar Island is connected by
          round-the-clock roll-on/roll-off government car ferries across the Mandovi river (free for pedestrians and
          cars, every 15 mins).
        </p>
        <p className="mb-2">
          <strong className="text-ink">Ferry Terminals:</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5 text-xs">
          <li>
            <strong>Ribandar Ferry Wharf</strong> (from Panjim side) — 5 mins ferry ride to Divar Island.
          </li>
          <li>
            <strong>Old Goa Ferry Wharf</strong> (from Old Goa churches) — 5 mins ferry ride.
          </li>
        </ul>
        <p className="mt-2 text-xs italic text-gold-deep">
          You can drive your car straight onto the ferry and drive off directly onto the island!
        </p>
      </>
    ),
  },
];

export function Journey() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-paper px-5 py-20">
      <SectionHeading
        title="Your Journey to Our Celebration"
        subtitle="Every beautiful journey deserves a wonderful destination. Here’s everything you need to know to reach us."
      />
      <Reveal className="mx-auto mt-8 max-w-md text-center">
        <MapPin aria-hidden="true" className="mx-auto h-5 w-5 text-bougainvillea" />
        <p className="mt-2 font-display text-2xl text-ink">Mercure Goa Devaaya Resort</p>
        <p className="font-display italic text-muted-foreground">Divar Island, Goa</p>
      </Reveal>
      <Reveal className="mx-auto mt-8 max-w-md">
        <div className="overflow-hidden rounded-3xl border border-gold/60 bg-card/80 shadow-soft">
          {ROUTES.map((r, i) => {
            const isOpen = open === r.id;
            const Icon = r.icon;
            return (
              <div key={r.id} className={cn("px-5", i < ROUTES.length - 1 && "border-b")}>
                <h3 className="flex">
                  <button
                    type="button"
                    id={`journey-${r.id}-trigger`}
                    aria-expanded={isOpen}
                    aria-controls={`journey-${r.id}`}
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className="flex flex-1 cursor-pointer items-center justify-between py-4 text-left text-sm font-medium"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-sea-light text-sea-deep">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="font-sans text-sm uppercase tracking-[0.3em] text-ink">{r.label}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`journey-${r.id}`}
                  role="region"
                  aria-labelledby={`journey-${r.id}-trigger`}
                  hidden={!isOpen}
                  className="overflow-hidden text-sm"
                >
                  <div className="px-5 pb-5 pt-2 font-display text-sm leading-relaxed text-muted-foreground">
                    {r.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <a
          href="https://maps.app.goo.gl/th6YPhvhdKZBwiU97?g_st=ic"
          target="_blank"
          rel="noopener noreferrer"
          className="sheen bg-gold-foil mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground shadow-gold"
        >
          <MapPin aria-hidden="true" className="h-4 w-4" />
          Get Directions to the Resort
        </a>
      </Reveal>
    </section>
  );
}
