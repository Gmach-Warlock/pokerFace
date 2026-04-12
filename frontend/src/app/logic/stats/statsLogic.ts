import type { PlayerInterface } from "../../interfaces/matchInterfaces";
import type { MatchLocationType } from "../../types/worldMapTypes";
import type {
  LifetimeStatsInterface,
  SessionStatsInterface,
} from "../../interfaces/profileInterfaces";

export const calculateHandResults = (
  player: PlayerInterface,
  winnerIds: string[],
  totalPot: number,
): PlayerInterface["stats"] => {
  const playerId = player.general.id ?? "";
  const isWinner = winnerIds.includes(playerId);
  const isTie = isWinner && winnerIds.length > 1;

  const share = isTie
    ? Math.floor(totalPot / winnerIds.length)
    : isWinner
      ? totalPot
      : 0;

  const amountInvested = player.state.currentBet;
  const netProfit = share - amountInvested;
  const currentLifetime = player.stats.lifetime;
  const currentSession = player.stats.session;
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

        vpipCount:
          amountInvested > 0
            ? currentLifetime.matches.various.vpipCount + 1
            : currentLifetime.matches.various.vpipCount,
      },
    },
  };

  return {
    session: currentSession,
    lifetime: updatedLifetime,
  };
};

export const calculateGainedXp = (
  currentLevel: number,
  location: MatchLocationType,
  isWinner: boolean,
): number => {
  const baseReward = isWinner ? 100 : 20;

  const multipliers: Partial<Record<MatchLocationType, number>> = {
    shelter: 1,
    halls: 2,
    "neon-alley-club": 5,
    zenith: 25,
  };

  const locMult = multipliers[location] || 1;

  const levelPenalty = currentLevel > 20 && location === "shelter" ? 0.1 : 1;

  return Math.floor(baseReward * locMult * levelPenalty);
};

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

  updated.hands.played += 1;

  if (isTie) {
    updated.hands.tied += 1;
    updated.log.lastHandResult = "tie";
    updated.monetary.totalProfit += share;
  } else if (isWinner) {
    updated.hands.won += 1;
    updated.streak.currentWin += 1;
    updated.streak.currentLoss = 0;
    updated.log.lastHandResult = "win";
    updated.monetary.biggestPotWon = Math.max(
      updated.monetary.biggestPotWon,
      totalPot,
    );
    updated.monetary.totalProfit += share; // share is totalPot in a solo win
  } else {
    updated.hands.lost += 1;
    updated.streak.currentLoss += 1;
    updated.streak.currentWin = 0;
    updated.log.lastHandResult = "loss";
  }

  updated.streak.longestWin = Math.max(
    updated.streak.longestWin,
    updated.streak.currentWin,
  );

  return updated;
};
