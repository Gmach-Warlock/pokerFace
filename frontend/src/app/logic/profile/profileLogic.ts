import type { NextLevelXpType } from "../../types/profileTypes";
import { xpMap, locationRewardsMap } from "../../assets/profile/profileAssets";

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
  // 1. Find the next goal (Total XP needed for next level)
  const nextLevelTotal =
    Object.values(xpMap).find((xp) => xp > currentTotalXp) ?? 1000000;

  // 2. Find the previous goal (To know where this level started)
  // We look for the last value that is LESS than or equal to our current XP
  const values = Object.values(xpMap);
  const currentIndex = values.findIndex((xp) => xp > currentTotalXp) - 1;
  const currentLevelStart = currentIndex >= 0 ? values[currentIndex] : 0;

  // 3. Calculate the "Gap"
  const xpIntoLevel = currentTotalXp - currentLevelStart;
  const xpRequiredForLevel = nextLevelTotal - currentLevelStart;

  // 4. Final Math
  const xpRemaining = nextLevelTotal - currentTotalXp;
  const progressPercentage = (xpIntoLevel / xpRequiredForLevel) * 100;

  return {
    xpRemaining, // "50 XP to go!"
    progressPercentage, // "75%" (Great for your UI width)
    nextLevelTotal, // The big goal
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

const LEVEL_THRESHOLDS: NextLevelXpType[] = [
  5, 20, 45, 80, 125, 180, 245, 320, 405, 500,
];
