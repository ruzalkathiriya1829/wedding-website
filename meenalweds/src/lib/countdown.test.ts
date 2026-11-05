import { describe, expect, it } from "vitest";
import { WEDDING_START, getCountdown } from "./countdown";

describe("wedding countdown", () => {
  it("targets 10 January 2027 at 11:30 AM India time", () => {
    expect(new Date(WEDDING_START).toISOString()).toBe("2027-01-10T06:00:00.000Z");
  });

  it("counts down exactly one day, one hour, one minute and one second", () => {
    const now = WEDDING_START - (86_400_000 + 3_600_000 + 60_000 + 1000);
    expect(getCountdown(now)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  it("shows zero once the celebration has started", () => {
    expect(getCountdown(WEDDING_START + 5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
