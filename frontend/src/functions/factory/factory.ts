import type {
  PlayerType,
  ChipMapInterface,
  PlayerInterface,
  VillainThemeType,
  CardInterface,
  CardValueType,
  CurrentLocationType,
} from "../../app/types";
import { villainPool, cardSuitIcons, cardRankValues } from "../../app/assets";
import { generateRandomString } from "../utils/utils";

export const createChips = (pot: number): ChipMapInterface => {
  const isHighStakes = pot >= 1000;

  const weights = isHighStakes
    ? { red: 0.15, blue: 0.2, green: 0.3, black: 0.3 }
    : { red: 0.25, blue: 0.35, green: 0.35, black: 0.0 };

  const red = Math.floor((pot * weights.red) / 5);
  const blue = Math.floor((pot * weights.blue) / 10);
  const green = Math.floor((pot * weights.green) / 25);
  const black = Math.floor((pot * weights.black) / 100);

  const valueSpent = red * 5 + blue * 10 + green * 25 + black * 100;

  const white = pot - valueSpent;

  return { white, red, blue, green, black };
};

export const createComment = () => {};

export const createPlayer = (
  name: string,
  type: PlayerType,
  startingPot: number,
): PlayerInterface => {
  const newChipMap = createChips(startingPot);

  return {
    id: generateRandomString(8),
    name,
    type,
    currentHand: [],
    money: startingPot,
    chips: newChipMap,
    level: 1,
    xp: 0,
    nextLevel: 5,
    availableDecks: ["arrowBolt"],
    currentDeckChoice: "arrowBolt",
    plei: 0,
  };
};

export const createVillain = (
  theme: VillainThemeType,
  nameOverride?: string, // Add this optional parameter
): PlayerInterface => {
  const getRandomVillainName = (theme: VillainThemeType) => {
    const pool = villainPool[theme];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const newVillainName = nameOverride || getRandomVillainName(theme);
  const chipMap = createChips(500);

  const newVillain: PlayerInterface = {
    id: `${newVillainName}-${generateRandomString(4)}`,
    name: newVillainName,
    type: "computer",
    difficulty: "normal",
    currentHand: [],
    money: 500,
    chips: chipMap,
    comments: null,
  };

  return newVillain;
};
export const generateDeck = (count: number = 1): CardInterface[] => {
  const deck: CardInterface[] = [];
  const suits = Object.keys(cardSuitIcons) as (keyof typeof cardSuitIcons)[];
  const ranks = Object.keys(cardRankValues);

  for (let i = 0; i < count; i++) {
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        const rawValue = isNaN(Number(rank)) ? rank : Number(rank);

        deck.push({
          value: rawValue as CardValueType,
          suit: suit,
          side: "face-down",
          currentLocation: "deck" as CurrentLocationType,
          isDiscarded: false,
        });
      });
    });
  }

  return deck;
};

export const pickWeightedIndex = (arrayLength: number): number => {
  // Squaring a number between 0 and 1 skews it toward 0.
  // Example: 0.9 * 0.9 = 0.81 | 0.2 * 0.2 = 0.04
  const skewedRandom = Math.pow(Math.random(), 2);
  return Math.floor(skewedRandom * arrayLength);
};
/**
 * Shuffles an array of cards using the Fisher-Yates algorithm.
 */
export const shuffleDeck = (deck: CardInterface[]): CardInterface[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
export const calculateHandValue = (cards: CardInterface[]): number => {
  let value = 0;
  let aceCount = 0;

  cards.forEach((card) => {
    if (typeof card.value === "number") {
      value += card.value;
    } else if (["J", "Q", "K"].includes(card.value as string)) {
      value += 10;
    } else if (card.value === "A") {
      aceCount += 1;
      value += 11;
    }
  });

  // If we busted but have Aces, convert them from 11 to 1
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount -= 1;
  }

  return value;
};
