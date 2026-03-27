import type { CardInterface, HandType } from "../types";
import { cardRankValues } from "../assets";

export interface EvaluatedHand {
  rankValue: number;
  handType: HandType;
  displayName: string;
  strength: number;
}

export const evaluateHand = (cards: CardInterface[]): EvaluatedHand => {
  if (!cards || cards.length === 0) {
    return {
      rankValue: 0,
      handType: "tbd",
      displayName: "Waiting for cards...",
      strength: 0,
    };
  }
  // 1. Get numeric values using your cardRankValues asset
  const numericValues = cards
    .map((c) => cardRankValues[c.value])
    .sort((a, b) => b - a);

  // 2. Map frequencies
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

  // --- The Evaluation Logic ---

  // Four of a Kind
  if (frequencies[0].count === 4) {
    return {
      rankValue: 7,
      handType: "four-of-a-kind",
      displayName: `Four of a Kind, ${getCardName(frequencies[0].val)}`,
      strength: 80 + (frequencies[0].val / 14) * 10,
    };
  }

  // Full House (Three of one, Two of another)
  if (frequencies[0].count === 3 && frequencies[1]?.count === 2) {
    return {
      rankValue: 6,
      handType: "full-house",
      displayName: `Full House, ${getCardName(frequencies[0].val)} over ${getCardName(frequencies[1].val)}`,
      strength: 70 + (frequencies[0].val / 14) * 10,
    };
  }

  // Three of a Kind
  if (frequencies[0].count === 3) {
    return {
      rankValue: 3,
      handType: "three-of-a-kind",
      displayName: `Three of a Kind, ${getCardName(frequencies[0].val)}`,
      strength: 40 + (frequencies[0].val / 14) * 10,
    };
  }

  // Two Pair
  if (frequencies[0].count === 2 && frequencies[1]?.count === 2) {
    return {
      rankValue: 2,
      handType: "two-pair",
      displayName: `${getCardName(frequencies[0].val).replace("s", "")}s and ${getCardName(frequencies[1].val).replace("s", "")}s`,
      strength: 25 + (frequencies[0].val / 14) * 10,
    };
  }

  // One Pair (Like your 6s!)
  if (frequencies[0].count === 2) {
    const pairVal = frequencies[0].val;
    return {
      rankValue: 1,
      handType: "pair",
      displayName: `Pair of ${getCardName(pairVal)}`,
      strength: (pairVal / 14) * 100,
    };
  }

  // High Card
  const highVal = numericValues[0];
  return {
    rankValue: 0,
    handType: "single-high",
    displayName: `${getCardName(highVal).replace("s", "")} High`,
    strength: (highVal / 14) * 100,
  };
};
