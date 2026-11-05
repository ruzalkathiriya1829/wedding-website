import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Celebrations } from "@/components/wedding/Celebrations";
import { Countdown } from "@/components/wedding/Countdown";
import { EventAssistant } from "@/components/wedding/EventAssistant";
import { Journey } from "@/components/wedding/Journey";
import { media } from "@/components/wedding/media";
import { OpeningFilm } from "@/components/wedding/OpeningFilm";
import { Wave } from "@/components/wedding/primitives";
import { Blessings, Farewell, MusicToggle, NoteFromUs, Welcome } from "@/components/wedding/Sections";
import { Wardrobe } from "@/components/wedding/Wardrobe";
import { invitation } from "@/content/invitation";

const { title: TITLE, description: DESCRIPTION } = invitation.meta;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const play = () => audioRef.current?.play().catch(() => {});
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  };

  // Sections without content in the invitation file stay hidden.
  const showNote = Boolean(invitation.noteFromUs);
  const showWardrobe = Boolean(invitation.wardrobe);
  const showTravel = Boolean(invitation.travel);

  return (
    <>
      <audio ref={audioRef} src={media.music} preload="auto" loop />
      <main className="w-full overflow-x-hidden">
        <OpeningFilm onOpen={play} />
        <Welcome />
        <Countdown />
        <Wave flip />
        <Blessings />
        <Wave />
        <Celebrations />
        <Wave flip />
        <EventAssistant />
        <Wave />
        {showNote && (
          <>
            <NoteFromUs />
            <Wave />
          </>
        )}
        {showWardrobe && (
          <>
            <Wardrobe />
            <Wave flip />
          </>
        )}
        {showTravel && (
          <>
            <Journey />
            <Wave />
          </>
        )}
        <Farewell />
      </main>
      <MusicToggle playing={playing} onToggle={toggle} />
    </>
  );
}
