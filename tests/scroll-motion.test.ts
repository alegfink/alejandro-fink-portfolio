import { describe, expect, it } from "vitest";
import {
  getBenefitsIntroTiming,
  getBenefitsKineticOpacity,
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

  it.each([false, true])("exits the benefits headline from top to bottom (narrow: %s)", (isNarrow) => {
    const timing = getBenefitsIntroTiming(isNarrow);
    const pauseBetweenPhrases = (timing.upperPhraseExit.end + timing.lowerPhraseExit.start) / 2;

    expect(timing.upperPhraseExit.end).toBeLessThanOrEqual(timing.lowerPhraseExit.start);
    expect(timing.answerEnter.end).toBeLessThan(timing.upperPhraseExit.start);
    expect(getBenefitsKineticOpacity(pauseBetweenPhrases, 0, 0, 2, 0, 1, isNarrow)).toBe(0);
    expect(getBenefitsKineticOpacity(pauseBetweenPhrases, 1, 0, 2, 0, 1, isNarrow)).toBe(1);
    expect(timing.proofEnter.start).toBeLessThanOrEqual(timing.lowerPhraseExit.end);
  });

  it("removes each phrase word by word on wide viewports", () => {
    const timing = getBenefitsIntroTiming(false);
    const midpoint = (timing.upperPhraseExit.start + timing.upperPhraseExit.end) / 2;
    const firstWord = getBenefitsKineticOpacity(midpoint, 0, 0, 2, 0, 1, false);
    const secondWord = getBenefitsKineticOpacity(midpoint, 0, 1, 2, 0, 1, false);

    expect(firstWord).toBeLessThan(secondWord);
  });

  it("keeps every glyph in a mobile phrase on the same reversible progress", () => {
    const timing = getBenefitsIntroTiming(true);
    const midpoint = (timing.upperPhraseExit.start + timing.upperPhraseExit.end) / 2;
    const firstLetter = getBenefitsKineticOpacity(midpoint, 0, 0, 2, 0, 10, true);
    const lastLetter = getBenefitsKineticOpacity(midpoint, 0, 1, 2, 9, 10, true);
    const reversedToMidpoint = getBenefitsKineticOpacity(midpoint, 0, 0, 2, 0, 10, true);

    expect(firstLetter).toBeCloseTo(lastLetter);
    expect(reversedToMidpoint).toBeCloseTo(firstLetter);
  });
});
