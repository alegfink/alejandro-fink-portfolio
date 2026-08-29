export const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

type ProgressWindow = Readonly<{ start: number; end: number }>;

export type BenefitsIntroTiming = Readonly<{
  answerEnter: ProgressWindow;
  upperPhraseExit: ProgressWindow;
  lowerPhraseExit: ProgressWindow;
  answerExit: ProgressWindow;
  proofEnter: ProgressWindow;
  firstItemGate: ProgressWindow;
}>;

const wideBenefitsIntroTiming: BenefitsIntroTiming = {
  answerEnter: { start: .005, end: .045 },
  upperPhraseExit: { start: .055, end: .11 },
  lowerPhraseExit: { start: .11, end: .175 },
  answerExit: { start: .16, end: .2 },
  proofEnter: { start: .17, end: .215 },
  firstItemGate: { start: .245, end: .265 },
};

const narrowBenefitsIntroTiming: BenefitsIntroTiming = {
  answerEnter: { start: .005, end: .045 },
  upperPhraseExit: { start: .05, end: .105 },
  lowerPhraseExit: { start: .105, end: .17 },
  answerExit: { start: .155, end: .195 },
  proofEnter: { start: .165, end: .21 },
  firstItemGate: { start: .235, end: .255 },
};

export function getBenefitsIntroTiming(isNarrow: boolean) {
  return isNarrow ? narrowBenefitsIntroTiming : wideBenefitsIntroTiming;
}

export function getBenefitsKineticOpacity(
  progress: number,
  phraseIndex: 0 | 1,
  wordIndex: number,
  wordCount: number,
  letterIndex: number,
  letterCount: number,
  isNarrow: boolean,
) {
  const timing = getBenefitsIntroTiming(isNarrow);
  const window = phraseIndex === 0 ? timing.upperPhraseExit : timing.lowerPhraseExit;
  const phraseProgress = clampProgress((progress - window.start) / Math.max(.0001, window.end - window.start));
  const safeWordCount = Math.max(1, wordCount);
  const safeWordIndex = Math.min(safeWordCount - 1, Math.max(0, wordIndex));
  const wordOverlap = .12;
  const wordWindow = 1 / (safeWordCount - (safeWordCount - 1) * wordOverlap);
  const wordStart = safeWordIndex * wordWindow * (1 - wordOverlap);
  const wordProgress = clampProgress((phraseProgress - wordStart) / wordWindow);
  const safeLetterCount = Math.max(1, letterCount);
  const sequenceProgress = safeLetterCount === 1
    ? 0
    : Math.min(1, Math.max(0, letterIndex / (safeLetterCount - 1)));
  const letterStagger = .16;
  const fadeStart = sequenceProgress * letterStagger;
  const normalized = clampProgress((wordProgress - fadeStart) / (1 - letterStagger));
  const eased = normalized * normalized * (3 - 2 * normalized);

  return 1 - eased;
}

export function getProjectStoryIndex(progress: number, projectCount: number) {
  if (projectCount <= 1) return 0;
  return Math.min(projectCount - 1, Math.floor(clampProgress(progress) * projectCount));
}

export function getReadableHorizontalProgress(rawProgress: number, cardCount: number) {
  if (cardCount <= 1) return 0;

  const edgeProgress = clampProgress((rawProgress - 0.06) / 0.82);
  const stopCount = cardCount - 1;
  const position = edgeProgress * stopCount;
  const stopIndex = Math.min(stopCount - 1, Math.floor(position));
  const localProgress = edgeProgress === 1 ? 1 : position - stopIndex;
  const transitionProgress = clampProgress((localProgress - 0.22) / 0.56);
  const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);

  return edgeProgress === 1 ? 1 : (stopIndex + easedProgress) / stopCount;
}

export function getHorizontalStoryScrollProgress(cardIndex: number, cardCount: number) {
  if (cardCount <= 1) return 0;
  const safeIndex = Math.min(cardCount - 1, Math.max(0, cardIndex));
  return 0.06 + 0.82 * (safeIndex / (cardCount - 1));
}
