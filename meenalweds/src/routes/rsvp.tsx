import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Ornament, SectionHeading } from "@/components/wedding/primitives";
import { invitation } from "@/content/invitation";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const TITLE = "RSVP - Gurjyot & Meenal Wedding, 9-10 January 2027";
const DESC = "Confirm your attendance for Gurjyot & Meenal's wedding celebrations in Raipur.";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RsvpPage,
});

const eventTitles = invitation.celebrations.days.flatMap((d) => d.events.map((e) => e.title));

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z.string().trim().max(30).optional(),
  attending: z.boolean(),
  guests: z.number().int().min(0).max(20),
  events: z.array(z.string()).max(10),
  message: z.string().trim().max(500).optional(),
});

const field =
  "w-full rounded-xl border border-gold/60 bg-card px-4 py-3 font-display text-lg text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

function RsvpPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [events, setEvents] = useState<string[]>(eventTitles);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (attending === null) return setError("Please let us know if you can attend.");
    const parsed = schema.safeParse({
      name,
      phone: phone || undefined,
      attending,
      guests: attending ? guests : 0,
      events: attending ? events : [],
      message: message || undefined,
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check your details.");
    setStatus("sending");
    const { error: dbError } = await supabase.from("rsvps").insert({
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      attending: parsed.data.attending,
      guests: parsed.data.guests,
      events: parsed.data.events,
      message: parsed.data.message ?? null,
    });
    if (dbError) {
      setStatus("idle");
      return setError("Sorry, we couldn't send your RSVP. Please try again.");
    }
    setStatus("done");
  };

  return (
    <main className="bg-paper min-h-screen px-5 py-16">
      <SectionHeading title="RSVP" subtitle={`Kindly let the families know if you can join ${invitation.couple.groom} & ${invitation.couple.bride}.`} />
      <div className="mx-auto mt-10 max-w-md rounded-[1.4rem] bg-gold-foil p-[2px] shadow-soft">
        <div className="bg-paper rounded-[1.3rem] px-6 py-8">
          {status === "done" ? (
            <div className="text-center">
              <p className="text-gold-foil inline-block px-2 py-2 font-script text-5xl leading-[1.3]">Thank you</p>
              <p className="mt-3 font-display text-lg italic text-ink">
                {attending ? "We can't wait to celebrate with you!" : "You'll be missed. Thank you for letting us know."}
              </p>
              <Ornament className="my-6" />
              <Link to="/" className="text-xs uppercase tracking-[0.25em] text-sea-deep underline-offset-4 hover:underline">
                Back to the invitation
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.25em] text-sea-deep">Your name</span>
                <input className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.25em] text-sea-deep">Phone (optional)</span>
                <input className={field} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
              </label>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-xs uppercase tracking-[0.25em] text-sea-deep">Will you attend?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: true, l: "Joyfully accept" },
                    { v: false, l: "Regretfully decline" },
                  ].map((o) => (
                    <button
                      key={o.l}
                      type="button"
                      aria-pressed={attending === o.v}
                      onClick={() => setAttending(o.v)}
                      className={cn(
                        "rounded-full border border-sea-deep px-3 py-2.5 text-[0.65rem] uppercase tracking-[0.15em] transition",
                        attending === o.v ? "bg-sea-deep text-primary-foreground" : "text-sea-deep hover:bg-muted",
                      )}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </fieldset>
              {attending && (
                <>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.25em] text-sea-deep">Number of guests (including you)</span>
                    <input
                      className={field}
                      type="number"
                      min={1}
                      max={20}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    />
                  </label>
                  <fieldset>
                    <legend className="mb-2 text-xs uppercase tracking-[0.25em] text-sea-deep">Events you'll attend</legend>
                    <div className="flex flex-col gap-2">
                      {eventTitles.map((t) => (
                        <label key={t} className="flex items-center gap-3 font-display text-lg text-ink">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[var(--gold)]"
                            checked={events.includes(t)}
                            onChange={(e) =>
                              setEvents((cur) => (e.target.checked ? [...cur, t] : cur.filter((x) => x !== t)))
                            }
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.25em] text-sea-deep">Blessings or a message (optional)</span>
                <textarea className={cn(field, "resize-none")} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
              </label>
              {error && <p className="text-center text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mx-auto mt-2 rounded-full bg-sea-deep px-8 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send RSVP"}
              </button>
            </form>
          )}
        </div>
      </div>
      <p className="mt-8 text-center">
        <Link to="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold-deep">
          ← Back to the invitation
        </Link>
      </p>
    </main>
  );
}
