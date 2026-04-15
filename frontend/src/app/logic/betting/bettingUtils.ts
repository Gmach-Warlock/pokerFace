import type {
  PlayerInterface,
  BetValidationResultInterface,
  ChipMapInterface,
} from "../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../types/matchTypes";

export const deductChipsFromDraft = (
  player: PlayerInterface,
  amount: number,
): void => {
  const chips = player.state.chips;
  const chipValues: { color: keyof ChipMapInterface; val: number }[] = [
    { color: "black", val: 100 },
    { color: "blue", val: 25 },
    { color: "green", val: 10 },
    { color: "red", val: 5 },
    { color: "white", val: 1 },
  ];

  let remaining = amount;

  // 1. Exact deduction
  for (const { color, val } of chipValues) {
    if (remaining <= 0) break;
    const count = Math.min(chips[color], Math.floor(remaining / val));
    chips[color] -= count;
    remaining -= count * val;
  }

  // 2. Break a chip if needed
  if (remaining > 0) {
    for (const { color, val } of [...chipValues].reverse()) {
      if (chips[color] > 0 && val > remaining) {
        chips[color] -= 1;
        let change = val - remaining;

        for (const chipToReturn of chipValues) {
          const count = Math.floor(change / chipToReturn.val);
          if (count > 0) {
            chips[chipToReturn.color] += count;
            change -= count * chipToReturn.val;
          }
        }
        remaining = 0;
        break;
      }
    }
  }
};

export const deductChipsFromPlayer = (
  player: PlayerInterface,
  amount: number,
): PlayerInterface => {
  // Create a deep copy to avoid direct mutation
  const updatedPlayer: PlayerInterface = JSON.parse(JSON.stringify(player));
  const chips = updatedPlayer.state.chips;

  const chipValues: { color: keyof ChipMapInterface; val: number }[] = [
    { color: "black", val: 100 },
    { color: "blue", val: 25 },
    { color: "green", val: 10 },
    { color: "red", val: 5 },
    { color: "white", val: 1 },
  ];

  let remaining = amount;

  for (const { color, val } of chipValues) {
    if (remaining <= 0) break;

    const available = chips[color];
    if (available > 0) {
      const amountToTake = Math.min(available, Math.floor(remaining / val));
      chips[color] -= amountToTake;
      remaining -= amountToTake * val;
    }
  }

  if (remaining > 0) {
    const reverseValues = [...chipValues].reverse();
    for (const { color, val } of reverseValues) {
      if (chips[color] > 0 && val > remaining) {
        // Take 1 chip
        chips[color] -= 1;
        const changeValue = val - remaining;

        let changeToDistribute = changeValue;
        for (const chipToReturn of chipValues) {
          const count = Math.floor(changeToDistribute / chipToReturn.val);
          if (count > 0) {
            chips[chipToReturn.color] += count;
            changeToDistribute -= count * chipToReturn.val;
          }
        }

        remaining = 0;
        break;
      }
    }
  }

  updatedPlayer.state.currentBet += amount;

  const totalRemaining = chipValues.reduce(
    (acc, { color, val }) => acc + chips[color] * val,
    0,
  );
  if (totalRemaining === 0) {
    updatedPlayer.state.isAllIn = true;
  }

  return updatedPlayer;
};

export const getNextActivePlayerIndex = (
  players: PlayerInterface[],
  currentIndex: number,
): number => {
  const startSearchingFrom = (currentIndex + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    const nextIdx = (startSearchingFrom + i) % players.length;
    const p = players[nextIdx];

    if (!p.state.isFolded && !p.state.isAllIn) {
      return nextIdx;
    }
  }
  return currentIndex;
};

export const validateBetAction = (
  player: PlayerInterface,
  amount: number,
  currentMaxBet: number,
  type: BettingActionType,
): BetValidationResultInterface => {
  const amountToCall = currentMaxBet - (player.state.currentBet || 0);

  if (type === "call" && player.profile.money < amountToCall) {
    return { valid: false, reason: "Insufficient funds to call" };
  }

  if (type === "raise" && amount <= currentMaxBet) {
    return { valid: false, reason: "Raise must be higher than current bet" };
  }

  return { valid: true };
};

export const resolveBetState = (
  player: PlayerInterface,
  amount: number,
  currentPot: number,
) => {
  const isAllIn = amount >= player.profile.money;
  const finalAmount = Math.min(amount, player.profile.money);

  return {
    newPlayerMoney: player.profile.money - finalAmount,
    newPlayerBet: (player.state.currentBet || 0) + finalAmount,
    newPot: currentPot + finalAmount,
    isAllIn,
  };
};
