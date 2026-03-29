import type {
  BettingActionType,
  CardInterface,
  DifficultyType,
  HandType,
  PlayerInterface,
  MatchInterface,
} from "../types";
import { cardRankValues } from "../assets";
import { evaluatePokerHand } from "../../functions/utils/utils";

export interface EvaluatedHand {
  rankValue: number;
  handType: HandType;
  displayName: string;
  strength: number;
}

export const calculateShowdown = (
  match: MatchInterface,
  isFirstMatch: boolean,
  isFirstWin: boolean,
) => {
  const activePlayers = match.players.filter((p) => !p.isFolded);
  if (activePlayers.length === 0) return;

  // 1. Evaluate all hands
  const evaluations = activePlayers.map((p) => ({
    id: p.id,
    ...evaluatePokerHand(p.currentHand),
  }));

  // 2. Determine Winner and assign to match object
  const winner = evaluations.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev,
  );

  match.winnerId = winner.id ?? ""; // Assign to the match object
  match.winningHand = winner.label;

  // 3. Reward Logic for the Hero
  const hero = match.players.find((p) => p.type === "human");

  // Check if the winner we just found is the Hero
  if (match.winnerId === hero?.id && hero) {
    const xpGained = Math.floor(match.pot * 0.1) + 50;
    const currentLevel = hero.level ?? 1;
    const currentXp = hero.xp ?? 0;

    const thresholds = [5, 20, 45, 80, 125, 180, 245, 320, 405, 500];
    const nextThreshold = thresholds[currentLevel - 1] ?? 999;

    const didLevelUp = currentXp + xpGained >= nextThreshold;

    match.rewards = {
      xp: xpGained,
      plei: match.pot,
      bonuses: [],
      isFirstMatch,
      isFirstWin,
      isLevelUp: didLevelUp,
    };
  }
};

export const evaluateHand = (cards: CardInterface[]): EvaluatedHand => {
  if (!cards || cards.length === 0) {
    return {
      rankValue: 0,
      handType: "tbd",
      displayName: "Waiting for cards...",
      strength: 0,
    };
  }

  const numericValues = cards
    .map((c) => cardRankValues[c.value])
    .sort((a, b) => b - a);

  const isFlush = new Set(cards.map((c) => c.suit)).size === 1;

  const isStraight = numericValues.every((val, index) => {
    return index === 0 || val === numericValues[index - 1] - 1;
  });

  const counts: Record<number, number> = {};
  numericValues.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

  const frequencies = Object.entries(counts)
    .map(([val, count]) => ({ val: Number(val), count }))
    .sort((a, b) => b.count - a.count || b.val - a.val);

  const getCardName = (val: number) => {
    const names: Record<number, string> = {
      11: "Jacks",
      12: "Queens",
      13: "Kings",
      14: "Aces",
    };
    return names[val] || `${val}s`;
  };

  if (isStraight && isFlush) {
    const isRoyal = numericValues[0] === 10; // Starts at 10, ends at Ace
    return {
      rankValue: isRoyal ? 9 : 8,
      handType: isRoyal ? "royal-flush" : "straight-flush",
      displayName: isRoyal
        ? "Royal Flush"
        : `Straight Flush, ${getCardName(numericValues[4])} High`,
      strength: 95 + (numericValues[4] / 14) * 5,
    };
  }

  if (frequencies[0].count === 4) {
    return {
      rankValue: 7,
      handType: "four-of-a-kind",
      displayName: `Four of a Kind, ${getCardName(frequencies[0].val)}`,
      strength: 80 + (frequencies[0].val / 14) * 10,
    };
  }

  if (frequencies[0].count === 3 && frequencies[1]?.count === 2) {
    return {
      rankValue: 6,
      handType: "full-house",
      displayName: `Full House, ${getCardName(frequencies[0].val)} over ${getCardName(frequencies[1].val)}`,
      strength: 70 + (frequencies[0].val / 14) * 10,
    };
  }

  if (frequencies[0].count === 3) {
    return {
      rankValue: 3,
      handType: "three-of-a-kind",
      displayName: `Three of a Kind, ${getCardName(frequencies[0].val)}`,
      strength: 40 + (frequencies[0].val / 14) * 10,
    };
  }

  if (frequencies[0].count === 2 && frequencies[1]?.count === 2) {
    return {
      rankValue: 2,
      handType: "two-pair",
      displayName: `${getCardName(frequencies[0].val).replace("s", "")}s and ${getCardName(frequencies[1].val).replace("s", "")}s`,
      strength: 25 + (frequencies[0].val / 14) * 10,
    };
  }

  if (frequencies[0].count === 2) {
    const pairVal = frequencies[0].val;
    return {
      rankValue: 1,
      handType: "pair",
      displayName: `Pair of ${getCardName(pairVal)}`,
      strength: (pairVal / 14) * 100,
    };
  }

  const highVal = numericValues[0];
  return {
    rankValue: 0,
    handType: "single-high",
    displayName: `${getCardName(highVal).replace("s", "")} High`,
    strength: (highVal / 14) * 100,
  };
};

export const executeTurn = (npc: PlayerInterface) => {
  const delay = npc.personality?.thinkTime || 1000;

  setTimeout(() => {
    // Dispatch the NPC's move...
    console.log(`${npc.name} finishes thinking after ${delay}ms`);
  }, delay);
};

export const getNPCAction = (
  npc: PlayerInterface,
  evaluation: EvaluatedHand,
  currentDifficulty: DifficultyType,
  currentPot: number,
  currentBet: number,
): BettingActionType => {
  const { rankValue, strength } = evaluation;

  // Logic: If there is no bet to meet, the NPC "Checks" instead of "Calls"
  const isBetActive = currentBet > 0;
  const defaultPassAction: BettingActionType = isBetActive ? "call" : "check";
  const defaultFailAction: BettingActionType = isBetActive ? "fold" : "check";

  switch (currentDifficulty) {
    case "easy":
      if (rankValue >= 2) return "raise";
      if (rankValue >= 1) return "call";
      return defaultFailAction;

    case "normal":
      if (rankValue >= 2 || strength > 70) return "raise";
      if (strength > 40) return "call";
      return defaultFailAction;

    case "hard": {
      const isTroll = npc.personality?.isTroll;
      if (isTroll && Math.random() < 0.3) return "raise";

      const potCommitment = currentPot > 500 ? 10 : 0;

      if (rankValue >= 3 || strength + potCommitment > 85) return "raise";
      if (strength + potCommitment > 50) return "call";
      return defaultFailAction;
    }

    default:
      return defaultPassAction;
  }
};

export const getAIDiscardIndices = (hand: CardInterface[]): number[] => {
  const evaluation = evaluateHand(hand);
  const { rankValue } = evaluation;

  // 1. If they have a Straight or better, they "Stand Pat" (discard nothing)
  if (rankValue >= 4) return [];

  const numericValues = hand.map((c) => cardRankValues[c.value]);
  const counts: Record<number, number> = {};
  numericValues.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

  // 2. Identify which card values are "Pairs" or "Sets"
  const keeperValues = Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([val]) => Number(val));

  // 3. Mark any card NOT in the keeperValues for discard
  // Exception: If they have nothing, keep the High Card and discard 4.
  const indicesToDiscard: number[] = [];

  hand.forEach((card, index) => {
    const val = cardRankValues[card.value];
    if (!keeperValues.includes(val)) {
      indicesToDiscard.push(index);
    }
  });

  // If discarding all 5 (total garbage hand), keep the highest single card
  if (indicesToDiscard.length === 5) {
    const highCardVal = Math.max(...numericValues);
    const highCardIndex = numericValues.indexOf(highCardVal);
    return indicesToDiscard.filter((i) => i !== highCardIndex);
  }

  return indicesToDiscard;
};
