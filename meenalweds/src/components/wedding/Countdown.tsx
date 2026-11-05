import { useCallback, useEffect, useRef, useState } from "react";
import { invitation } from "@/content/invitation";
import { getCountdown, type CountdownParts } from "@/lib/countdown";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./primitives";

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function ScratchCover({ revealed, onReveal }: { revealed: boolean; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const cleared = useRef(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || cleared.current) return;
    canvas.width = canvas.offsetWidth || 340;
    canvas.height = canvas.offsetHeight || 150;
    const { width: w, height: h } = canvas;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, readToken("--gold-light"));
    grad.addColorStop(0.3, readToken("--gold"));
    grad.addColorStop(0.7, readToken("--gold"));
    grad.addColorStop(1, readToken("--gold-deep"));
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = readToken("--card");
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.fillStyle = readToken("--ink");
    ctx.font = 'italic 20px "Cormorant Garamond", serif';
    ctx.fillText("Scratch to Reveal", w / 2, h / 2 - 6);
    ctx.font = '600 10.5px "Jost", sans-serif';
    ctx.letterSpacing = "3px";
    ctx.fillText("THE COUNTDOWN", w / 2, h / 2 + 16);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(paint, 300);
    document.fonts?.ready.then(paint).catch(() => {});
    window.addEventListener("resize", paint);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", paint);
    };
  }, [paint]);

  useEffect(() => {
    if (revealed) cleared.current = true;
  }, [revealed]);

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearedPx = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clearedPx += 16;
    if (clearedPx / (data.length / 4) > 0.35) onReveal();
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || cleared.current) return;
    const r = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - r.left, clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();
    checkProgress();
  };

  return (
    <canvas
      ref={canvasRef}
      aria-label="Scratch to reveal the countdown"
      className={cn(
        "absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700",
        revealed && "pointer-events-none opacity-0",
      )}
      onPointerDown={(e) => {
        drawing.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        scratch(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => drawing.current && scratch(e.clientX, e.clientY)}
      onPointerUp={() => (drawing.current = false)}
      onPointerCancel={() => (drawing.current = false)}
    />
  );
}

const LABELS: { key: keyof CountdownParts; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function Countdown() {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const tick = () => setParts(getCountdown(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-sea-wash relative py-20">
      <SectionHeading title={invitation.countdown.heading} subtitle={invitation.countdown.subtitle} />
      <div className="mx-auto mt-10 max-w-md px-5">
        <div className="relative overflow-hidden rounded-3xl border border-gold/60 bg-card/70 px-3 py-8 shadow-soft">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            {LABELS.map(({ key, label }) => {
              const value = parts ? (key === "days" ? String(parts[key]) : String(parts[key]).padStart(2, "0")) : "--";
              return (
                <div key={key} className="flex min-w-0 flex-1 flex-col items-center">
                  <div className="relative aspect-square w-full max-w-24 rounded-full bg-gold-foil p-[3px] shadow-gold">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-card shadow-[inset_0_2px_8px_color-mix(in_oklab,var(--gold-deep)_25%,transparent)]">
                      <span className="font-display text-[clamp(1.4rem,7vw,2.4rem)] font-semibold tabular-nums text-ink">
                        {value}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-[0.58rem] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
          <ScratchCover revealed={revealed} onReveal={() => setRevealed(true)} />
        </div>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mx-auto mt-3 block cursor-pointer text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground underline-offset-4 hover:underline"
          >
            Reveal without scratching
          </button>
        )}
      </div>
    </section>
  );
}
