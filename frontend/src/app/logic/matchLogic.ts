import type {
  BettingActionType,
  CurrentLocationType,
  DifficultyType,
  GamePhaseConfigType,
  GamePhaseType,
  MatchType,
} from "../types/matchTypes";
import type {
  CardInterface,
  PlayerInterface,
  MatchInterface,
  EvaluatedHandInterface,
} from "../interfaces/matchInterfaces";
import type { MatchLocationType } from "../types/worldMapTypes";
import type { GameInterface } from "../interfaces/gameInterfaces";
import { LEVEL_UP_REWARDS } from "../assets/profileAssets";
import { anteMap, handRanks, matchPhaseMap } from "../assets/matchAssets";

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

export const executeTurn = (
  npc: PlayerInterface,
  evaluation: EvaluatedHandInterface,
  match: MatchInterface,
) => {
  const { difficultyLevel, pot, currentBetOnTable } = match;

  const decision = getNPCAction(
    npc,
    evaluation,
    difficultyLevel,
    pot,
    currentBetOnTable,
  );

  let amount = 0;
  if (decision === "call") {
    amount = Math.max(
      0,
      currentBetOnTable - (npc.currentMatch.currentBet || 0),
    );
  } else if (decision === "raise") {
    amount = currentBetOnTable + 50 - (npc.currentMatch.currentBet || 0);
  }

  return {
    playerId: npc.id,
    type: decision,
    amount: amount,
  };
};

export const getCardDestination = (
  matchType: MatchType,
  phase: GamePhaseType,
  playerIndex: number,
): CurrentLocationType => {
  const config = (matchPhaseMap as GamePhaseConfigType)[matchType]?.[phase];

  if (config?.target === "board") {
    return "board";
  }

  return `p${playerIndex + 1}` as CurrentLocationType;
};

export const getNPCAction = (
  npc: PlayerInterface,
  evaluation: { rankValue: number; label: string }, // Matches evaluatePokerHand
  currentDifficulty: DifficultyType,
  currentPot: number,
  currentBet: number,
): BettingActionType => {
  const { rankValue } = evaluation;

  const normalizedStrength = (rankValue / 900) * 100;

  const amountToCall = currentBet - (npc.currentMatch.currentBet || 0);
  const canCheck = amountToCall <= 0;

  const defaultPassAction: BettingActionType = canCheck ? "check" : "call";
  const defaultFailAction: BettingActionType = canCheck ? "check" : "fold";
  console.log(amountToCall, normalizedStrength);
  switch (currentDifficulty) {
    case "easy":
      if (rankValue >= 200) return "raise";
      if (rankValue >= 100) return "call";

      if (rankValue < 300 && amountToCall > 60) return "fold";
      return defaultPassAction;

    case "normal":
      // Raise on Pair or better
      if (rankValue >= 100) {
        console.log(`${currentBet} ${evaluation}, ${normalizedStrength} raise`);
        return "raise";
      }
      // Call if we have a decent high card or the pot is worth it
      if (normalizedStrength > 15) {
        console.log(`${currentBet} ${evaluation}, ${normalizedStrength} call`);
        return "call";
      }
      return defaultFailAction;

    case "hard": {
      const isTroll = npc.npcTraits?.general.isTroll ?? 0;
      // Bluffing logic
      if (isTroll && Math.random() < 0.3) return "raise";

      const potCommitment = currentPot > 500 ? 10 : 0;

      if (rankValue >= 300 || normalizedStrength + potCommitment > 85)
        return "raise";
      if (normalizedStrength + potCommitment > 50) return "call";
      return defaultFailAction;
    }

    default:
      return defaultPassAction;
  }
};
export const getAIDiscardIndices = (hand: CardInterface[]): number[] => {
  const evaluation = evaluatePokerHand(hand);

  if (evaluation.rankValue >= 400) return [];

  const numericValues = hand.map((c) => {
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    return typeof c.value === "number" ? c.value : map[c.value] || 0;
  });

  const counts: Record<number, number> = {};
  numericValues.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

  const keeperValues = Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([val]) => Number(val));

  const indicesToDiscard: number[] = [];

  hand.forEach((card, index) => {
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    const val =
      typeof card.value === "number" ? card.value : map[card.value] || 0;

    if (!keeperValues.includes(val)) {
      indicesToDiscard.push(index);
    }
  });

  if (indicesToDiscard.length === 5) {
    const highCardVal = Math.max(...numericValues);
    const highCardIndex = numericValues.indexOf(highCardVal);
    return indicesToDiscard.filter((i) => i !== highCardIndex);
  }

  return indicesToDiscard.slice(0, 4);
};
export const handleFoldLogic = (state: GameInterface, playerId: string) => {
  const match = state.currentMatch;

  if (playerId === match.players[0].id) {
    state.currentlyDisplayed = "postGame";
    return;
  } else {
    const opponent = match.players.find((o) => o.id === playerId);
    if (opponent) opponent.currentMatch.isFolded = true;
  }

  const activeOpponents = match.players.filter(
    (opp) => !opp.currentMatch.isFolded,
  );
  const heroFolded = state.currentlyDisplayed === "postGame";

  if (activeOpponents.length === 0 && !heroFolded) {
    match.players[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  } else if (activeOpponents.length === 1 && heroFolded) {
    activeOpponents[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  }
};

export const pickAnteAmount = (location: MatchLocationType) => {
  const amount = anteMap[location as keyof typeof anteMap];

  return amount;
};

export const getNextActivePlayerIndex = (match: MatchInterface) => {
  const totalPlayers = match.players.length;
  let nextIndex = (match.activePlayerIndex + 1) % totalPlayers;

  for (let i = 0; i < totalPlayers; i++) {
    const player = match.players[nextIndex];

    if (!player.currentMatch.isFolded && !player.currentMatch.isAllin) {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % totalPlayers;
  }

  return match.activePlayerIndex; // Fallback
};
