import type {
  PlayerInterface,
  MatchInterface,
} from "../../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../../types/matchTypes";

export const generateBettingMessage = (
  player: PlayerInterface,
  match: MatchInterface,
  actionType: BettingActionType,
  amount: number,
): string => {
  if (player.currentMatch.isFolded) {
    return `${player.name} folds`;
  }

  if (player.currentMatch.isAllin) {
    return `${player.name} is ALL IN!`;
  }

  switch (actionType) {
    case "raise":
      return `${player.name} raises to $${match.currentBetOnTable}`;
    case "call":
      return `${player.name} calls $${amount}`;
    case "check":
      return `${player.name} checks`;
    default:
      return "";
  }
};
