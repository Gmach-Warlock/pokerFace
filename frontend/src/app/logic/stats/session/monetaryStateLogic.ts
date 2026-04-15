import type { SessionStatsInterface } from "../../../interfaces/profileInterfaces";

export const updateMonetaryStats = (
  currentStats: SessionStatsInterface,
  netProfit: number,
  totalBet: number,
): SessionStatsInterface => {
  const isWin = netProfit > 0;

  return {
    ...currentStats,
    monetary: {
      ...currentStats.monetary,
      totalProfit: currentStats.monetary.totalProfit + netProfit,
      totalBet: currentStats.monetary.totalBet + totalBet,
      biggestPotWon: isWin
        ? Math.max(currentStats.monetary.biggestPotWon, netProfit)
        : currentStats.monetary.biggestPotWon,
      biggestLoss: !isWin
        ? Math.max(currentStats.monetary.biggestLoss, Math.abs(netProfit))
        : currentStats.monetary.biggestLoss,
    },
  };
};
