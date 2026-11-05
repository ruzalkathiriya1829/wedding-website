import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { invitation, type InvitationEvent } from "@/content/invitation";
import { askAboutEvent } from "@/lib/event-assistant.functions";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./primitives";

const events: InvitationEvent[] = invitation.celebrations.days.flatMap((d): InvitationEvent[] => d.events);

async function toDataUrl(src: string): Promise<string | undefined> {
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : undefined);
      r.onerror = () => resolve(undefined);
      r.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

export function EventAssistant() {
  const ask = useServerFn(askAboutEvent);
  const [selected, setSelected] = useState(events[0]?.title ?? "");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  if (events.length === 0) return null;
  const current = events.find((e) => e.title === selected);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const imageDataUrl = current?.image ? await toDataUrl(current.image) : undefined;
      const res = await ask({
        data: { eventTitle: selected, question, ...(imageDataUrl ? { imageDataUrl } : {}) },
      });
      setAnswer(res.answer);
      setError(res.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-paper px-5 py-16" aria-label="Ask about a celebration">
      <SectionHeading title="Ask About a Celebration" subtitle="Choose an event and ask anything about it." />
      <Reveal className="mx-auto mt-10 max-w-md">
        <div className="rounded-[1.4rem] bg-gold-foil p-[2px] shadow-soft">
          <div className="bg-paper rounded-[1.3rem] px-5 py-8">
            <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Choose an event">
              {events.map((ev) => (
                <button
                  key={ev.title}
                  type="button"
                  role="radio"
                  aria-checked={selected === ev.title}
                  onClick={() => {
                    setSelected(ev.title);
                    setAnswer(null);
                    setError(null);
                  }}
                  className={cn(
                    "rounded-full border border-sea-deep px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition",
                    selected === ev.title ? "bg-sea-deep text-primary-foreground" : "text-sea-deep hover:bg-muted",
                  )}
                >
                  {ev.title}
                </button>
              ))}
            </div>
            {current?.image && (
              <img
                src={current.image}
                alt={`Illustration for ${current.title}`}
                loading="lazy"
                className="mx-auto mt-6 h-40 w-auto rounded-lg object-contain"
              />
            )}
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
              <label htmlFor="event-question" className="sr-only">
                Your question
              </label>
              <textarea
                id="event-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={400}
                rows={3}
                placeholder="e.g. What time should I arrive? What is the couple wearing in the drawing?"
                className="w-full resize-none rounded-xl border border-gold/60 bg-card px-4 py-3 font-display text-lg text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="mx-auto flex items-center gap-2 rounded-full bg-sea-deep px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                {loading ? "Thinking…" : "Ask"}
              </button>
            </form>
            <div aria-live="polite">
              {answer && (
                <p className="mt-6 rounded-xl bg-muted px-4 py-4 font-display text-lg italic leading-relaxed text-ink">
                  {answer}
                </p>
              )}
              {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
