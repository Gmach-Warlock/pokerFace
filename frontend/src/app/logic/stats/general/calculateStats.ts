import { areaXpGuide } from "../../../assets/profile/xpAssets";
import type { HandResultsInterface } from "../../../interfaces/matchInterfaces";
import type { MatchLocationType } from "../../../types/worldMapTypes";

export const calculateXp = (location: MatchLocationType): number => {
  const areaXp = areaXpGuide[location] || 100;

  return areaXp;
};
export const calculatePlei = (
  summary: HandResultsInterface["playerSummaries"][0],
): number => {
  let plei = 0;

  if (summary.netProfit > 0) {
    plei += 1;
  }

  if (summary.handRankValue >= 7) {
    plei += 5;
  }

  return plei;
};

const XP_THRESHOLDS = [0, 5, 20, 45, 80, 125, 180, 245, 320, 405, 500];

export const checkLevelUp = (currentLevel: number, totalXp: number) => {
  let newLevel = currentLevel;

  while (
    XP_THRESHOLDS[newLevel] !== undefined &&
    totalXp >= XP_THRESHOLDS[newLevel]
  ) {
    newLevel++;
  }

  return {
    didLevelUp: newLevel > currentLevel,
    newLevel: newLevel,
    unlockedItems: [], // You can map level integers to Item IDs here later
  };
};
