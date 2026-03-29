import type {
  CardInterface,
  MatchInterface,
  MatchLocationType,
  PlayerInterface,
  NextLevelXpType,
} from "../../app/types";
import { AnteMap, handRanks } from "../../app/assets";
import { type GameInterface } from "../../features/game/gameSlice";

export function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

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

export const handleFoldLogic = (state: GameInterface, playerId: string) => {
  const match = state.currentMatch;

  if (playerId === match.hero.id) {
    state.currentlyDisplayed = "postGame";
    return;
  } else {
    const opponent = match.opponents.find((o) => o.id === playerId);
    if (opponent) opponent.isFolded = true;
  }

  const activeOpponents = match.opponents.filter((opp) => !opp.isFolded);
  const heroFolded = state.currentlyDisplayed === "postGame";

  if (activeOpponents.length === 0 && !heroFolded) {
    match.hero.money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
    // You could also set a "winner" state here to show a toast/message
  } else if (activeOpponents.length === 1 && heroFolded) {
    activeOpponents[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  }
};

export const pickAnteAmount = (location: MatchLocationType) => {
  const amount = AnteMap[location as keyof typeof AnteMap];

  return amount;
};

export const processBet = (playerId: string, amount: number) => {
  return {
    type: "BETS/SUBMIT_BET",
    payload: {
      playerId,
      amount,
      timestamp: Date.now(),
    },
  };
};

export const calculateShowdown = (match: MatchInterface) => {
  const activePlayers = match.players.filter((p) => !p.isFolded);
  const evaluations = activePlayers.map((p) => ({
    id: p.id,
    ...evaluatePokerHand(p.currentHand),
  }));

  const winner = evaluations.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev,
  );

  // Directly mutate the 'match' object provided by Immer
  match.winnerId = winner.id ?? "";
  match.winningHand = winner.label;
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
  const totalPlayers = match.opponents.length + 1; // Hero + NPCs
  let nextIndex = (match.activePlayerIndex + 1) % totalPlayers;

  // Loop through players to find the next one capable of acting
  for (let i = 0; i < totalPlayers; i++) {
    const player =
      nextIndex === 0 ? match.hero : match.opponents[nextIndex - 1];

    if (!player.isFolded && !player.isAllin) {
      return nextIndex;
    }
    // If this player can't act, try the next one
    nextIndex = (nextIndex + 1) % totalPlayers;
  }

  return match.activePlayerIndex; // Fallback
};

const LEVEL_THRESHOLDS: NextLevelXpType[] = [
  5, 20, 45, 80, 125, 180, 245, 320, 405, 500,
];

export const checkLevelUp = (currentLevel: number, currentXp: number) => {
  // Find the required XP for the NEXT level
  // level 1 looks at index 0, level 2 looks at index 1, etc.
  const requiredXp = LEVEL_THRESHOLDS[currentLevel - 1] ?? 999999;

  if (currentXp >= requiredXp) {
    return {
      didLevelUp: true,
      newLevel: currentLevel + 1,
      nextThreshold: LEVEL_THRESHOLDS[currentLevel] ?? null,
    };
  }

  return {
    didLevelUp: false,
    newLevel: currentLevel,
    nextThreshold: requiredXp,
  };
};
