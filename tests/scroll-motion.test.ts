import { describe, expect, it } from "vitest";
import {
  getHorizontalStoryScrollProgress,
  getProjectStoryIndex,
  getReadableHorizontalProgress,
} from "../lib/scroll-motion";

describe("scroll motion", () => {
  it("moves through all project slides across the shorter story", () => {
    expect(getProjectStoryIndex(0, 6)).toBe(0);
    expect(getProjectStoryIndex(0.5, 6)).toBe(3);
    expect(getProjectStoryIndex(1, 6)).toBe(5);
  });

  it("keeps capability cards readable at each scroll stop", () => {
    expect(getReadableHorizontalProgress(0.06, 4)).toBeCloseTo(0);
    expect(getReadableHorizontalProgress(getHorizontalStoryScrollProgress(1, 4), 4)).toBeCloseTo(1 / 3);
    expect(getReadableHorizontalProgress(0.88, 4)).toBeCloseTo(1);
  });

  it("maps direct drag stops back into the vertical story", () => {
    expect(getHorizontalStoryScrollProgress(0, 4)).toBeCloseTo(0.06);
    expect(getHorizontalStoryScrollProgress(2, 4)).toBeCloseTo(0.6066667);
    expect(getHorizontalStoryScrollProgress(3, 4)).toBeCloseTo(0.88);
  });
});
