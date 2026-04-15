import type {
  PlayerInterface,
  HandResultsInterface,
} from "../../../interfaces/matchInterfaces";
import type { HandSettlement } from "../../../interfaces/profileInterfaces";
import {
  calculateXp,
  calculatePlei,
  checkLevelUp,
} from "../../stats/general/calculateStats";

export const generateSettlement = (
  player: PlayerInterface,
  summary: HandResultsInterface["playerSummaries"][0],
): HandSettlement => {
  const xpGained = calculateXp(summary); // Separate math helper
  const pleiGained = calculatePlei(summary);
  const newXpTotal = player.profile.xp + xpGained;

  const levelData = checkLevelUp(player.profile.level, newXpTotal);

  return {
    playerId: player.general.id,
    statsDelta: {
      netProfit: summary.netProfit,
      xpGained,
      pleiGained,
      wonHand: summary.netProfit > 0,
      isBluff: summary.wasBluff,
    },
    levelUp: levelData,
  };
};
