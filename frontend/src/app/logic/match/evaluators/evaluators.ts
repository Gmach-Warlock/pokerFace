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
  if (amount > player.profile.money) {
    throw new Error("Insufficient chips");
  }

  return {
    newPlayerChips: player.profile.money - amount,
    newPot: currentPot + amount,
    betConfirmed: true,
  };
};

export const calculateCardsNeeded = (
  type: keyof typeof matchPhaseMap,
  phase: string,
  currentHandLength: number,
): number => {
  const gameConfig = matchPhaseMap[type];
  const config = gameConfig
    ? gameConfig[phase as keyof typeof gameConfig]
    : undefined;
  if (!config) {
    console.warn(`[calculateCardsNeeded] No config found for ${type}:${phase}`);
    return 0;
  }

  if (config.cards === "variable") {
    const needed = 5 - currentHandLength;
    console.log(`[calc] Variable mode: 5 - ${currentHandLength} = ${needed}`);
    return needed;
  }

  if (config.target === "board") {
    return 0;
  }

  if (typeof config.cards === "number") {
    const targetTotal = config.cards;
    const needed = targetTotal - currentHandLength;

    if (currentHandLength === 0 && phase === "ante") {
      console.log(
        `[MATH CHECK] Target: ${targetTotal} | Current: ${currentHandLength} | Needs: ${needed}`,
      );
    }

    console.log(
      `[calc] Numeric mode: Target ${targetTotal} - Current ${currentHandLength} = ${needed}`,
    );

    return needed > 0 ? needed : 0;
  }

  return 0;
};
export const calculateShowdown = (
  match: MatchInterface,
  isFirstMatch: boolean,
  isFirstWin: boolean,
) => {
  const activePlayers = match.currentHand.players.filter(
    (p) => !p.state.isFolded,
  );
  if (activePlayers.length === 0) return;

  const evaluations = activePlayers.map((p) => ({
    id: p.general.id,
    ...evaluatePokerHand(p.state.hand),
  }));

  const winner = evaluations.reduce((prev, curr) =>
    curr.rankValue > prev.rankValue ? curr : prev,
  );

  match.results.winnerId = winner.id ?? "";
  match.results.winningHand = winner.label;

  const hero = match.currentHand.players.find(
    (p) => p.general.type === "human",
  );

  if (match.results.winnerId === hero?.general.id && hero?.profile) {
    const xpGained = Math.floor(match.currentHand.pot * 0.1) + 50;
    const currentLevel = hero.profile.level;
    const currentXp = hero.profile.xp;

    const thresholds = [5, 20, 45, 80, 125, 180, 245, 320, 405, 500];
    const nextThreshold = thresholds[currentLevel - 1] ?? 999;

    const didLevelUp = currentXp + xpGained >= nextThreshold;

    const baseRewards = {
      xp: xpGained,
      plei: match.currentHand.pot,
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
