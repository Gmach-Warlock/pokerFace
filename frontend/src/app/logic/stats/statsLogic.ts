import type {
  PlayerInterface,
  SessionStatsInterface,
} from "../../interfaces/matchInterfaces";
import type { MatchLocationType } from "../../types/worldMapTypes";
import type { LifetimeStatsInterface } from "../../interfaces/profileInterfaces";

export const calculateHandResults = (
  player: PlayerInterface,
  winnerIds: string[],
  totalPot: number,
): PlayerInterface["stats"] => {
  const playerId = player.general.id ?? "";
  const isWinner = winnerIds.includes(playerId);
  const isTie = isWinner && winnerIds.length > 1;

  // Calculate share of the pot
  const share = isTie
    ? Math.floor(totalPot / winnerIds.length)
    : isWinner
      ? totalPot
      : 0;

  // The 'cost' of this hand (the chips the player put in this round)
  const amountInvested = player.state.currentBet;
  const netProfit = share - amountInvested;

  const currentLifetime = player.stats.lifetime;
  const currentSession = player.stats.session;

  // Update logic for nested Lifetime stats
  const updatedLifetime: LifetimeStatsInterface = {
    ...currentLifetime,
    matches: {
      ...currentLifetime.matches,
      hand: {
        handsPlayed: currentLifetime.matches.hand.handsPlayed + 1,
        handsWon: isWinner
          ? currentLifetime.matches.hand.handsWon + 1
          : currentLifetime.matches.hand.handsWon,
        handsLost: !isWinner
          ? currentLifetime.matches.hand.handsLost + 1
          : currentLifetime.matches.hand.handsLost,
        handsTied: isTie
          ? currentLifetime.matches.hand.handsTied + 1
          : currentLifetime.matches.hand.handsTied,
      },
      streak: {
        currentWinStreak: isWinner
          ? currentLifetime.matches.streak.currentWinStreak + 1
          : 0,
        currentLossStreak: !isWinner
          ? currentLifetime.matches.streak.currentLossStreak + 1
          : 0,
        longestWinStreak: isWinner
          ? Math.max(
              currentLifetime.matches.streak.longestWinStreak,
              currentLifetime.matches.streak.currentWinStreak + 1,
            )
          : currentLifetime.matches.streak.longestWinStreak,
      },
      monetary: {
        ...currentLifetime.matches.monetary,
        totalProfit: currentLifetime.matches.monetary.totalProfit + netProfit,
        biggestPotWon: isWinner
          ? Math.max(currentLifetime.matches.monetary.biggestPotWon, share)
          : currentLifetime.matches.monetary.biggestPotWon,
        biggestLoss: !isWinner
          ? Math.max(
              currentLifetime.matches.monetary.biggestLoss,
              amountInvested,
            )
          : currentLifetime.matches.monetary.biggestLoss,
        totalBuyIn:
          currentLifetime.matches.monetary.totalBuyIn + amountInvested,
        totalCashOut: currentLifetime.matches.monetary.totalCashOut + share,
      },
      various: {
        ...currentLifetime.matches.various,
        // Increment VPIP if the player put money in (excluding blinds logic if handled elsewhere)
        vpipCount:
          amountInvested > 0
            ? currentLifetime.matches.various.vpipCount + 1
            : currentLifetime.matches.various.vpipCount,
        // Add more logic here for bluffs and showdowns as you build the engine
      },
    },
  };

  return {
    session: currentSession, // You can apply similar logic here or keep it simplified
    lifetime: updatedLifetime,
  };
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

/**
 * Pure function to calculate the next state of a single SessionStatsInterface block.
 */
export const getUpdatedStatsBlock = (
  stats: SessionStatsInterface,
  outcome: {
    isWinner: boolean;
    isTie: boolean;
    share: number;
    totalPot: number;
  },
): SessionStatsInterface => {
  const { isWinner, isTie, share, totalPot } = outcome;
  const updated = { ...stats };

  updated.handsPlayed += 1;

  if (isTie) {
    updated.handsTied += 1;
    updated.lastHandResult = "tie";
    updated.totalSessionProfit += share;
  } else if (isWinner) {
    updated.handsWon += 1;
    updated.currentWinStreak += 1;
    updated.currentLossStreak = 0;
    updated.lastHandResult = "win";
    updated.biggestPotWon = Math.max(updated.biggestPotWon, totalPot);
    updated.totalSessionProfit += share; // share is totalPot in a solo win
  } else {
    updated.handsLost += 1;
    updated.currentLossStreak += 1;
    updated.currentWinStreak = 0;
    updated.lastHandResult = "loss";
  }

  updated.longestWinStreak = Math.max(
    updated.longestWinStreak,
    updated.currentWinStreak,
  );

  return updated;
};
