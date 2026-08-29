export const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

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
