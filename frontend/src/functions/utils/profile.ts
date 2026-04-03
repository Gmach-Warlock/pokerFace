import { xpMap } from "../../app/assets/profileAssets";

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
