import { invitation } from "@/content/invitation";

/** Countdown target, taken from the invitation content file. */
export const WEDDING_START = new Date(invitation.countdown.target).getTime();

export type CountdownParts = { days: number; hours: number; minutes: number; seconds: number };

export function getCountdown(now: number, target: number = WEDDING_START): CountdownParts {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}
