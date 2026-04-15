import type {
  LifetimeStatsInterface,
  SessionStatsInterface,
} from "../../../interfaces/profileInterfaces";

export const syncSessionToLifetime = (
  lifetime: LifetimeStatsInterface,
  session: SessionStatsInterface,
): LifetimeStatsInterface => {
  // Calculate potential new all-time high balance
  const currentTotalProfit =
    lifetime.matches.monetary.totalProfit + session.monetary.totalProfit;

  return {
    ...lifetime,
    matches: {
      ...lifetime.matches,
      // 1. Update Monetary Nest
      monetary: {
        ...lifetime.matches.monetary,
        totalProfit: currentTotalProfit,
        allTimeHighBalance: Math.max(
          lifetime.matches.monetary.allTimeHighBalance,
          currentTotalProfit,
        ),
        biggestPotWon: Math.max(
          lifetime.matches.monetary.biggestPotWon,
          session.monetary.biggestPotWon,
        ),
        biggestLoss: Math.max(
          lifetime.matches.monetary.biggestLoss,
          session.monetary.biggestLoss,
        ),
        totalBuyIn:
          lifetime.matches.monetary.totalBuyIn + session.monetary.totalBuyIn,
        totalCashOut:
          lifetime.matches.monetary.totalCashOut +
          session.monetary.totalCashOut,
      },
      // 2. Update Various Nest (Behavioral)
      various: {
        ...lifetime.matches.various,
        vpipCount:
          lifetime.matches.various.vpipCount + session.activity.vpipCount,
        pfrCount: lifetime.matches.various.pfrCount + session.activity.pfrCount,
        bluffsAttempted:
          lifetime.matches.various.bluffsAttempted +
          session.activity.bluffsAttempted,
        bluffsSucceeded:
          lifetime.matches.various.bluffsSucceeded +
          session.activity.bluffsSucceeded,
      },
      // 3. Update Hand Nest (Win/Loss/Tie)
      hand: {
        ...lifetime.matches.hand,
        handsPlayed: lifetime.matches.hand.handsPlayed + session.hands.played,
        handsWon: lifetime.matches.hand.handsWon + session.hands.won,
        handsLost: lifetime.matches.hand.handsLost + session.hands.lost,
        handsTied: lifetime.matches.hand.handsTied + session.hands.tied,
      },
    },
  };
};
