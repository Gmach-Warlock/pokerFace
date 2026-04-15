import type {
  CardInterface,
  MatchInterface,
  MatchPhaseInterface,
  PhaseInstruction,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../../types/matchTypes";
import { calculateCardsNeeded } from "../evaluators/evaluators";

export const getNextActivePlayerIndex = (
  players: PlayerInterface[],
  currentIndex: number,
) => {
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

export const distributeToPlayer = (
  player: PlayerInterface,
  idx: number,
  config: PhaseInstruction,
  deck: CardInterface[],
  currentPhase: MatchPhaseInterface,
) => {
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

export const resolveBetState = (
  player: PlayerInterface,
  targetAmount: number,
  currentPot: number,
) => {
  const alreadyBet = player.state.currentBet || 0;
  const desiredAddition = targetAmount - alreadyBet;

  // Handle All-In: Player can't put in more than they have
  const isAllIn = desiredAddition >= player.profile.money;
  const finalAddition = isAllIn ? player.profile.money : desiredAddition;

  return {
    newPlayerMoney: player.profile.money - finalAddition,
    newPlayerBet: alreadyBet + finalAddition,
    newPot: currentPot + finalAddition,
    isAllIn,
    finalAddition,
  };
};

export const validateBetAction = (
  player: PlayerInterface,
  amount: number,
  currentMaxBet: number,
  type: BettingActionType,
) => {
  const alreadyBet = player.state.currentBet || 0;
  const amountToCall = currentMaxBet - alreadyBet;

  if (type === "call") {
    if (player.profile.money < amountToCall) {
      return { valid: false, reason: "Insufficient funds to call" };
    }
  }

  if (type === "raise") {
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
