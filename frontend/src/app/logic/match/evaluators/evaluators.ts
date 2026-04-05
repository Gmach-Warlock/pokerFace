import type {
  CardInterface,
  MatchInterface,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";
import { matchPhaseMap, handRanks } from "../../../assets/match/matchAssets";
import { LEVEL_UP_REWARDS } from "../../../assets/profile/profileAssets";

export const calculateBetResults = (
  player: PlayerInterface,
  amount: number,
  currentPot: number,
) => {
  if (amount > player.money) {
    throw new Error("Insufficient chips");
  }

  return {
    newPlayerChips: player.money - amount,
    newPot: currentPot + amount,
    betConfirmed: true,
  };
};

export const calculateCardsNeeded = (
  type: string,
  phase: string,
  currentHandLength: number,
): number => {
  const config = matchPhaseMap[type]?.[phase];

  if (!config) return 0;

  if (config.cards === "variable") {
    return 5 - currentHandLength;
  }

  if (config.target === "board") {
    return 0;
  }

  if (typeof config.cards === "number") {
    if (currentHandLength < config.cards) {
      return config.cards - currentHandLength;
    }
  }

  return 0;
};
export const calculateShowdown = (
  match: MatchInterface,
  isFirstMatch: boolean,
  isFirstWin: boolean,
) => {
  const activePlayers = match.players.filter((p) => !p.currentMatch.isFolded);
  if (activePlayers.length === 0) return;

  const evaluations = activePlayers.map((p) => ({
    id: p.id,
    ...evaluatePokerHand(p.currentMatch.currentHand),
  }));

  const winner = evaluations.reduce((prev, curr) =>
    curr.rankValue > prev.rankValue ? curr : prev,
  );

  match.winnerId = winner.id ?? "";
  match.winningHand = winner.label;

  const hero = match.players.find((p) => p.type === "human");

  if (match.winnerId === hero?.id && hero?.profile) {
    const xpGained = Math.floor(match.pot * 0.1) + 50;
    const currentLevel = hero.profile.level;
    const currentXp = hero.profile.xp;

    const thresholds = [5, 20, 45, 80, 125, 180, 245, 320, 405, 500];
    const nextThreshold = thresholds[currentLevel - 1] ?? 999;

    const didLevelUp = currentXp + xpGained >= nextThreshold;

    const baseRewards = {
      xp: xpGained,
      plei: match.pot,
      bonuses: [],
      isFirstMatch,
      isFirstWin,
      isLevelUp: didLevelUp,
    };

    if (didLevelUp) {
      const nextLevel = (hero.profile?.level ?? 1) + 1;
      const rewardData = LEVEL_UP_REWARDS[nextLevel];

      match.rewards = {
        ...baseRewards,
        message: rewardData?.message ?? "You've reached a new plateau.",
        perk: rewardData?.perk ?? "Increased Reputation",
      };
    } else {
      match.rewards = baseRewards;
    }
  }
};

export const evaluatePokerHand = (hand: CardInterface[]) => {
  if (hand.length < 5) return handRanks.highCard;

  const getVal = (v: string | number): number => {
    if (typeof v === "number") return v;
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    return map[v] || 0;
  };

  const values = hand.map((c) => getVal(c.value)).sort((a, b) => a - b);
  const suits = hand.map((c) => c.suit);

  const isFlush = new Set(suits).size === 1;
  let isStraight = values.every((v, i) => i === 0 || v === values[i - 1] + 1);

  const isWheel = JSON.stringify(values) === JSON.stringify([2, 3, 4, 5, 14]);

  if (isWheel) isStraight = true;

  const counts: Record<number, number> = {};
  values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const valCounts = Object.values(counts).sort((a, b) => b - a);

  if (isStraight && isFlush) {
    return values[4] === 14 ? handRanks.royalFlush : handRanks.straightFlush;
  }
  if (valCounts[0] === 4) return handRanks.fourOfAKind;
  if (valCounts[0] === 3 && valCounts[1] === 2) return handRanks.fullHouse;
  if (isFlush) return handRanks.flush;
  if (isStraight) return handRanks.straight;
  if (valCounts[0] === 3) return handRanks.threeOfAKind;
  if (valCounts[0] === 2 && valCounts[1] === 2) return handRanks.twoPair;
  if (valCounts[0] === 2) return handRanks.onePair;

  return handRanks.highCard;
};

export const getCombinations = (
  array: CardInterface[],
  size: number,
): CardInterface[][] => {
  const result: CardInterface[][] = [];
  const f = (prefix: CardInterface[], array: CardInterface[]) => {
    for (let i = 0; i < array.length; i++) {
      const next = prefix.concat(array[i]);
      if (next.length === size) {
        result.push(next);
      } else {
        f(next, array.slice(i + 1));
      }
    }
  };
  f([], array);
  return result;
};
