import type { CardInterface, MatchLocationType } from "../../app/types";
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

  // 1. Normalize values (J=11, Q=12, K=13, A=14)
  const getVal = (v: string | number): number => {
    if (typeof v === "number") return v;
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    return map[v] || 0;
  };

  const values = hand.map((c) => getVal(c.value)).sort((a, b) => a - b);
  const suits = hand.map((c) => c.suit);

  // 2. Checks
  const isFlush = new Set(suits).size === 1;
  const isStraight = values.every((v, i) => i === 0 || v === values[i - 1] + 1);

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

  // 1. Mark the player as folded
  if (playerId === match.hero.id) {
    // We can't really "fold" the hero and keep playing,
    // so we usually jump to post-game or show a "You Folded" state.
    state.currentlyDisplayed = "postGame";
    return;
  } else {
    const opponent = match.opponents.find((o) => o.id === playerId);
    if (opponent) opponent.isFolded = true;
  }

  // 2. CHECK FOR WINNER (Is only 1 player left who hasn't folded?)
  const activeOpponents = match.opponents.filter((opp) => !opp.isFolded);
  const heroFolded = state.currentlyDisplayed === "postGame"; // or your hero-specific flag

  if (activeOpponents.length === 0 && !heroFolded) {
    // HERO WINS BY DEFAULT
    match.hero.money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
    // You could also set a "winner" state here to show a toast/message
  } else if (activeOpponents.length === 1 && heroFolded) {
    // LAST REMAINING OPPONENT WINS
    activeOpponents[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  }
};

export const pickAnteAmount = (location: MatchLocationType) => {
  const amount = AnteMap[location as keyof typeof AnteMap];

  return amount;
};
