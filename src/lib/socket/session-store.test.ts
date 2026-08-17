import { describe, expect, it } from "vitest";
import { computeNextStatus, INACTIVITY_THRESHOLD_MS } from "./session-store";

describe("computeNextStatus", () => {
  it("keeps an active session active when well within the threshold", () => {
    const now = 100_000;
    expect(computeNextStatus("active", now - 1_000, now)).toBe("active");
  });

  it("flips an active session to inactive once past the threshold", () => {
    const now = 100_000;
    expect(computeNextStatus("active", now - INACTIVITY_THRESHOLD_MS - 1, now)).toBe("inactive");
  });

  it("does not flip to inactive exactly at the threshold boundary", () => {
    const now = 100_000;
    expect(computeNextStatus("active", now - INACTIVITY_THRESHOLD_MS, now)).toBe("active");
  });

  it("leaves an already-inactive session inactive (reactivation only happens via new field-update)", () => {
    const now = 100_000;
    expect(computeNextStatus("inactive", now - 1_000, now)).toBe("inactive");
  });

  it("never moves a submitted session out of submitted, no matter how stale", () => {
    const now = 100_000;
    expect(computeNextStatus("submitted", now - INACTIVITY_THRESHOLD_MS * 10, now)).toBe("submitted");
  });
});
