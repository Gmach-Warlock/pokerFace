import { locationRewardsMap } from "../../assets/profile/profileAssets";
import { LEVEL_THRESHOLDS } from "../../assets/profile/xpAssets";

export const calculateRewards = (location: string, playerLevel: number) => {
  const config = locationRewardsMap[location] || locationRewardsMap.shelter;

  // Example Scaling Logic:
  // If the player is much higher level than the zone, they get less XP.
  // If they are in a high-level zone, the reward is fat.
  const levelDiff = Math.max(1, playerLevel);
  const scaledXp = Math.floor(config.xpBase / (levelDiff * 0.5));

  return {
    xp: scaledXp,
    plei: config.pleiBase,
  };
};

export const calculateXpProgress = (currentTotalXp: number) => {
  // Find where the player currently sits in the array
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(
    (xp) => xp > currentTotalXp,
  );

  // Handle Max Level case
  if (nextLevelIndex === -1) {
    return {
      xpRemaining: 0,
      progressPercentage: 100,
      nextLevelTotal: currentTotalXp,
    };
  }

  const nextLevelTotal = LEVEL_THRESHOLDS[nextLevelIndex];
  const currentLevelStart =
    nextLevelIndex > 0 ? LEVEL_THRESHOLDS[nextLevelIndex - 1] : 0;

  const xpIntoLevel = currentTotalXp - currentLevelStart;
  const xpRequiredForLevel = nextLevelTotal - currentLevelStart;

  return {
    xpRemaining: nextLevelTotal - currentTotalXp,
    progressPercentage: Math.min(100, (xpIntoLevel / xpRequiredForLevel) * 100),
    nextLevelTotal,
  };
};

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
