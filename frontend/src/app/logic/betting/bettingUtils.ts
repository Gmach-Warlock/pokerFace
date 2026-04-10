import type {
  PlayerInterface,
  BetValidationResultInterface,
} from "../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../types/matchTypes";

/**
 * DETERMINES THE NEXT PLAYER INDEX
 * Accounts for folded players and all-ins.
 */
export const getNextActivePlayerIndex = (
  players: PlayerInterface[],
  currentIndex: number,
): number => {
  const startSearchingFrom = (currentIndex + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    const nextIdx = (startSearchingFrom + i) % players.length;
    const p = players[nextIdx];

    // Skip if folded or all-in
    if (!p.state.isFolded && !p.state.isAllIn) {
      return nextIdx;
    }
  }
  return currentIndex; // No other active players
};

/**
 * CALCULATES BET VALIDATION
 * Pure math to ensure a player can actually make the move.
 */
export const validateBetAction = (
  player: PlayerInterface,
  amount: number,
  currentMaxBet: number,
  type: BettingActionType,
): BetValidationResultInterface => {
  const amountToCall = currentMaxBet - (player.state.currentBet || 0);

  if (type === "call" && player.account.totalMoney < amountToCall) {
    return { valid: false, reason: "Insufficient funds to call" };
  }

  // Note: For a 'raise', 'amount' usually represents the total new bet
  // on the table from this player.
  if (type === "raise" && amount <= currentMaxBet) {
    return { valid: false, reason: "Raise must be higher than current bet" };
  }

  return { valid: true };
};

/**
 * UPDATES PLAYER AND POT
 * Returns the new values without mutating the original objects.
 */
export const resolveBetState = (
  player: PlayerInterface,
  amount: number,
  currentPot: number,
) => {
  const isAllIn = amount >= player.account.totalMoney;
  const finalAmount = Math.min(amount, player.account.totalMoney);

  return {
    newPlayerMoney: player.account.totalMoney - finalAmount,
    newPlayerBet: (player.state.currentBet || 0) + finalAmount,
    newPot: currentPot + finalAmount,
    isAllIn,
  };
};
