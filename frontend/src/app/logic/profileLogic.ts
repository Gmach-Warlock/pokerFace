import type { NextLevelXpType } from "../types/profileTypes";

const LEVEL_THRESHOLDS: NextLevelXpType[] = [
  5, 20, 45, 80, 125, 180, 245, 320, 405, 500,
];

export const checkLevelUp = (currentLevel: number, currentXp: number) => {
  const requiredXp = LEVEL_THRESHOLDS[currentLevel - 1] ?? 999999;

  if (currentXp >= requiredXp) {
    return {
      didLevelUp: true,
      newLevel: currentLevel + 1,
      nextThreshold: LEVEL_THRESHOLDS[currentLevel] ?? null,
    };
  }

  return {
    didLevelUp: false,
    newLevel: currentLevel,
    nextThreshold: requiredXp,
  };
};
