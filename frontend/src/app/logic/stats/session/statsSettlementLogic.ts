import type {
  PlayerInterface,
  HandResultsInterface,
} from "../../../interfaces/matchInterfaces";
import type { HandSettlement } from "../../../interfaces/profileInterfaces";
import type { MatchLocationType } from "../../../types/worldMapTypes";
import {
  calculateXp,
  calculatePlei,
  checkLevelUp,
} from "../general/calculateStats";

export const generateSettlement = (
  player: PlayerInterface,
  summary: HandResultsInterface["playerSummaries"][0],
  matchLocation: MatchLocationType,
): HandSettlement => {
  const xpGained = calculateXp(matchLocation);
  const pleiGained = calculatePlei(summary);
  const startXp = player.profile.xp;
  const endXp = startXp + xpGained;

  const levelData = checkLevelUp(player.profile.level, endXp);

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
