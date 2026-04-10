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
  if (player.state.isFolded) {
    return `${player.general.name} folds`;
  }

  if (player.state.isAllIn) {
    return `${player.general.name} is ALL IN!`;
  }

  switch (actionType) {
    case "raise":
      return `${player.general.name} raises to $${match.currentHand.currentBetOnTable}`;
    case "call":
      return `${player.general.name} calls $${amount}`;
    case "check":
      return `${player.general.name} checks`;
    default:
      return "";
  }
};
