import type {
  BettingActionType,
  DifficultyType,
  MatchLocationType,
} from "../types/matchTypes";
import type {
  CardInterface,
  PlayerInterface,
  MatchInterface,
  EvaluatedHandInterface,
} from "../interfaces/matchInterfaces";
import type { GameInterface } from "../interfaces/gameInterfaces";
import { LEVEL_UP_REWARDS } from "../assets/profileAssets";
import { anteMap, handRanks } from "../assets/matchAssets";

export const calculateShowdown = (
  match: MatchInterface,
  isFirstMatch: boolean,
  isFirstWin: boolean,
) => {
  const activePlayers = match.players.filter((p) => !p.currentMatch.isFolded);
  if (activePlayers.length === 0) return;

  // 1. Evaluate all hands
  const evaluations = activePlayers.map((p) => ({
    id: p.id,
    ...evaluatePokerHand(p.currentMatch.currentHand),
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
  if (match.winnerId === hero?.id && hero?.profile) {
    const xpGained = Math.floor(match.pot * 0.1) + 50;
    const currentLevel = hero.profile.level;
    const currentXp = hero.profile.xp;

    const thresholds = [5, 20, 45, 80, 125, 180, 245, 320, 405, 500];
    const nextThreshold = thresholds[currentLevel - 1] ?? 999;

    const didLevelUp = currentXp + xpGained >= nextThreshold;

    if (didLevelUp) {
      const nextLevel = (hero.profile?.level ?? 1) + 1;
      const rewardData = LEVEL_UP_REWARDS[nextLevel];

      // We explicitly provide the required fields to ensure they are never undefined
      match.rewards = {
        xp: xpGained, // Required
        plei: match.pot, // Required
        bonuses: [], // Required
        isLevelUp: true,
        isFirstMatch,
        isFirstWin,
        message: rewardData?.message ?? "You've reached a new plateau.",
        perk: rewardData?.perk ?? "Increased Reputation",
      };
    }

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

  // 3. Return the handRanks object
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

  // 1. Get the decision from our unified logic
  const decision = getNPCAction(
    npc,
    evaluation,
    difficultyLevel,
    pot,
    currentBetOnTable,
  );

  // 2. Calculate the chip amount based on the decision
  let amount = 0;
  if (decision === "call") {
    amount = Math.max(
      0,
      currentBetOnTable - (npc.currentMatch.currentBet || 0),
    );
  } else if (decision === "raise") {
    // Standard raise: match the bet + a fixed increment (e.g., 50)
    amount = currentBetOnTable + 50 - (npc.currentMatch.currentBet || 0);
  }
  // "fold" or "check" result in 0 amount

  // 3. Return the payload so the listener/component can dispatch it
  return {
    playerId: npc.id,
    type: decision,
    amount: amount,
  };
};

export const getNPCAction = (
  npc: PlayerInterface,
  evaluation: { value: number; label: string }, // Matches evaluatePokerHand
  currentDifficulty: DifficultyType,
  currentPot: number,
  currentBet: number,
): BettingActionType => {
  const { value } = evaluation;

  // 1. Calculate relative strength (0-100) based on max possible hand value (~900)
  // This replaces the old 'strength' property
  const normalizedStrength = (value / 900) * 100;

  // 2. Logic: Determine if we are checking vs calling
  const amountToCall = currentBet - (npc.currentMatch.currentBet || 0);
  const canCheck = amountToCall <= 0;

  const defaultPassAction: BettingActionType = canCheck ? "check" : "call";
  const defaultFailAction: BettingActionType = canCheck ? "check" : "fold";
  console.log(amountToCall, normalizedStrength);
  switch (currentDifficulty) {
    case "easy":
      if (value >= 200) return "raise";
      if (value >= 100) return "call";

      // NEW: On Easy, only fold if they have literally nothing AND there's a bet.
      // If they have a pair (value >= 100), they should never hit this.
      if (value < 100 && amountToCall > 60) return "fold";
      return defaultPassAction;

    case "normal":
      // Raise on Pair or better
      if (value >= 100) {
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

      if (value >= 300 || normalizedStrength + potCommitment > 85)
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

  if (evaluation.value >= 400) return [];

  const numericValues = hand.map((c) => {
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    return typeof c.value === "number" ? c.value : map[c.value] || 0;
  });

  const counts: Record<number, number> = {};
  numericValues.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

  // 2. Keep pairs, trips, or quads
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

export const calculateBetResults = (
  player: PlayerInterface,
  amount: number,
  currentPot: number,
) => {
  // 1. Validation Logic
  if (amount > player.money) {
    throw new Error("Insufficient chips");
  }

  return {
    newPlayerChips: player.money - amount,
    newPot: currentPot + amount,
    betConfirmed: true,
  };
};

export const getNextActivePlayerIndex = (match: MatchInterface) => {
  const totalPlayers = match.players.length;
  let nextIndex = (match.activePlayerIndex + 1) % totalPlayers;

  // Loop through players to find the next one capable of acting
  for (let i = 0; i < totalPlayers; i++) {
    const player = match.players[nextIndex];

    if (!player.currentMatch.isFolded && !player.currentMatch.isAllin) {
      return nextIndex;
    }
    // If this player can't act, try the next one
    nextIndex = (nextIndex + 1) % totalPlayers;
  }

  return match.activePlayerIndex; // Fallback
};
