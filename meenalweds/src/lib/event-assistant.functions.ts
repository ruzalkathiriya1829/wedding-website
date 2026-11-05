import { createServerFn } from "@tanstack/react-start";
import { invitation, type InvitationEvent } from "@/content/invitation";

const MAX_QUESTION = 400;
const MAX_IMAGE_CHARS = 1_500_000;

type Input = { eventTitle: string; question: string; imageDataUrl?: string };

function findEvent(title: string) {
  for (const day of invitation.celebrations.days) {
    const ev = (day.events as InvitationEvent[]).find((e) => e.title === title);
    if (ev) return { ...ev, day: day.label };
  }
  return null;
}

export const askAboutEvent = createServerFn({ method: "POST" })
  .inputValidator((input: Input) => {
    const question = String(input?.question ?? "").trim();
    if (!question) throw new Error("Please type a question.");
    if (question.length > MAX_QUESTION) throw new Error("Question is too long.");
    const img = input.imageDataUrl;
    const imageDataUrl =
      typeof img === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(img) && img.length <= MAX_IMAGE_CHARS
        ? img
        : undefined;
    return { eventTitle: String(input?.eventTitle ?? ""), question, imageDataUrl };
  })
  .handler(async ({ data }) => {
    const ev = findEvent(data.eventTitle);
    if (!ev) return { answer: null, error: "Please choose an event." };

    const details = [
      `Event: ${ev.title} (${ev.day})`,
      `Date: ${ev.date}`,
      `Timings: ${ev.times.join("; ")}`,
      ev.venue && `Venue: ${ev.venue}`,
      ev.host && ev.host,
      ev.note && `Note: ${ev.note}`,
      `Couple: ${invitation.couple.groom} & ${invitation.couple.bride}`,
      `Wedding: ${invitation.welcome.dates}, ${invitation.welcome.venue}, ${invitation.welcome.city}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "You are a warm, gracious concierge for a Sikh wedding invitation. Answer guests' questions about the chosen celebration using only the event details provided and the attached illustration. If something is not in the details (dress code, parking, menu, etc.), say kindly that it hasn't been shared yet and suggest asking the family. When describing the illustration, note it is an artistic drawing of the couple. Keep answers to 2-4 short sentences, in the guest's language.",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: `Event details:\n${details}\n\nGuest question: ${data.question}` },
              ...(data.imageDataUrl
                ? [{ type: "input_image" as const, image_url: data.imageDataUrl, detail: "low" as const }]
                : []),
            ],
          },
        ],
      });
      const answer = res.output
        .flatMap((item) => (item.type === "message" ? item.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("")
        .trim();
      return { answer: answer || null, error: answer ? null : "No answer came back. Please try again." };
    } catch (err) {
      console.error("askAboutEvent failed", err);
      if (err instanceof GatewayError && err.code === "rate_limited")
        return { answer: null, error: "Lots of guests are asking right now. Please try again in a moment." };
      return { answer: null, error: "Sorry, I couldn't answer just now. Please try again." };
    }
  });
