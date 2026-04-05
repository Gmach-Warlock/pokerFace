import type {
  PlayerInterface,
  SessionStatsInterface,
} from "../interfaces/matchInterfaces";
import type { MatchLocationType } from "../types/worldMapTypes";

export const calculateHandResults = (
  player: PlayerInterface,
  winnerIds: string[],
  totalPot: number,
): SessionStatsInterface => {
  const currentStats = { ...player.currentMatch.sessionStats };
  const isWinner = winnerIds.includes(player.id ?? "");
  const isTie = isWinner && winnerIds.length > 1;

  currentStats.handsPlayed += 1;

  if (isTie) {
    currentStats.handsTied += 1;
    currentStats.lastHandResult = "tie";
    // Each winner gets a share
    const share = Math.floor(totalPot / winnerIds.length);
    currentStats.totalSessionProfit += share;
  } else if (isWinner) {
    currentStats.handsWon += 1;
    currentStats.currentWinStreak += 1;
    currentStats.currentLossStreak = 0;
    currentStats.lastHandResult = "win";
    currentStats.biggestPotWon = Math.max(currentStats.biggestPotWon, totalPot);
    currentStats.totalSessionProfit += totalPot;
  } else {
    currentStats.handsLost += 1;
    currentStats.currentLossStreak += 1;
    currentStats.currentWinStreak = 0;
    currentStats.lastHandResult = "loss";
  }

  currentStats.longestWinStreak = Math.max(
    currentStats.longestWinStreak,
    currentStats.currentWinStreak,
  );

  return currentStats;
};

export const calculateGainedXp = (
  currentLevel: number,
  location: MatchLocationType,
  isWinner: boolean,
): number => {
  const baseReward = isWinner ? 100 : 20;

  // Location Multipliers (The "Work" Factor)
  const multipliers: Partial<Record<MatchLocationType, number>> = {
    shelter: 1, // Great for Level 1-10
    halls: 2, // Great for Level 10-20
    "neon-alley-club": 5, // Necessary for Level 30+
    zenith: 25, // The only way to move the bar at Level 80+
  };

  const locMult = multipliers[location] || 1;

  // Diminishing Returns Logic
  // If you are Level 50 playing in "The Shelter", you get 90% less XP.
  const levelPenalty = currentLevel > 20 && location === "shelter" ? 0.1 : 1;

  return Math.floor(baseReward * locMult * levelPenalty);
};
