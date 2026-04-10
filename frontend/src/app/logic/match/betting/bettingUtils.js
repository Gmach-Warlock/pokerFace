/**
 * DETERMINES THE NEXT PLAYER INDEX
 * Accounts for folded players and all-ins.
 */
export const getNextActivePlayerIndex = (players, currentIndex) => {
  const startSearchingFrom = (currentIndex + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    const nextIdx = (startSearchingFrom + i) % players.length;
    const p = players[nextIdx];

    // Skip if folded or all-in
    if (!p.currentMatch.isFolded && !p.currentMatch.isAllin) {
      return nextIdx;
    }
  }
  return currentIndex; // No other active players
};

/**
 * CALCULATES BET VALIDATION
 * Pure math to ensure a player can actually make the move.
 */
export const validateBetAction = (player, amount, currentMaxBet, type) => {
  const amountToCall = currentMaxBet - (player.currentMatch.currentBet || 0);

  if (type === "call" && player.money < amountToCall) {
    return { valid: false, reason: "Insufficient funds to call" };
  }

  if (type === "raise" && amount <= currentMaxBet) {
    return { valid: false, reason: "Raise must be higher than current bet" };
  }

  return { valid: true };
};

/**
 * UPDATES PLAYER AND POT
 * Returns the new values without mutating the original objects.
 */
export const resolveBetState = (player, amount, currentPot) => {
  const isAllIn = amount >= player.money;
  const finalAmount = Math.min(amount, player.money);

  return {
    newPlayerMoney: player.money - finalAmount,
    newPlayerBet: (player.currentMatch.currentBet || 0) + finalAmount,
    newPot: currentPot + finalAmount,
    isAllIn,
  };
};
