import type {
  CardInterface,
  MatchInterface,
  MatchPhaseInterface,
  PhaseInstruction,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../../types/matchTypes";
import { calculateCardsNeeded } from "../evaluators/evaluators";

/**
 * DETERMINES THE NEXT PLAYER INDEX
 * Accounts for folded players and all-ins.
 */
export const getNextActivePlayerIndex = (
  players: PlayerInterface[],
  currentIndex: number,
) => {
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
) => {
  // player.state.currentBet is what they've already put in this round
  const alreadyBet = player.state.currentBet || 0;
  const amountToCall = currentMaxBet - alreadyBet;

  if (type === "call") {
    if (player.profile.money < amountToCall) {
      return { valid: false, reason: "Insufficient funds to call" };
    }
  }

  if (type === "raise") {
    // A raise must at least be higher than the current max bet
    // If currentMaxBet is 10, and I want to raise to 20, my 'amount' is 20.
    if (amount <= currentMaxBet) {
      return {
        valid: false,
        reason: "Raise must be higher than the current bet",
      };
    }

    const totalCost = amount - alreadyBet;
    if (player.profile.money < totalCost) {
      return { valid: false, reason: "Insufficient funds to raise that much" };
    }
  }

  return { valid: true };
};

/**
 * UPDATES PLAYER AND POT
 * Returns the new values without mutating the original objects.
 */
export const resolveBetState = (
  player: PlayerInterface,
  targetAmount: number,
  currentPot: number,
) => {
  const alreadyBet = player.state.currentBet || 0;

  // How much NEW money is being added to the pot?
  // targetAmount is the TOTAL they want to have on the table (e.g., 20)
  const addition = targetAmount - alreadyBet;

  const isAllIn = addition >= player.profile.money;
  const finalAddition = Math.min(addition, player.profile.money);

  return {
    newPlayerMoney: player.profile.money - finalAddition,
    newPlayerBet: alreadyBet + finalAddition,
    newPot: currentPot + finalAddition,
    isAllIn,
  };
};

// Helper to handle player-specific card distribution
export const distributeToPlayer = (
  player: PlayerInterface,
  idx: number,
  config: PhaseInstruction,
  deck: CardInterface[],
  currentPhase: MatchPhaseInterface,
) => {
  // Clean discards
  player.state.hand = player.state.hand.filter((c) => !c.isDiscarded);

  const cardsNeeded = calculateCardsNeeded(
    currentPhase.type,
    currentPhase.phase,
    player.state.hand.length,
  );

  for (let i = 0; i < cardsNeeded; i++) {
    const card = deck.pop();
    if (card) {
      player.state.hand.push({
        ...card,
        side: player.general.type === "human" ? "face-up" : config.side,
        currentLocation: `p${idx + 1}`,
        isDiscarded: false,
      });
    }
  }
};

// Helper for community cards
export const distributeToBoard = (state: MatchInterface, count: number) => {
  if (state.general.matchType === "holdem" && state.variantSpecifics) {
    for (let i = 0; i < count; i++) {
      const card = state.currentHand.deck.pop();
      if (card) {
        state.variantSpecifics.holdemSpecifics.communityCards.push({
          ...card,
          side: "face-up",
          currentLocation: "board",
          isDiscarded: false,
        });
      }
    }
  }
};
