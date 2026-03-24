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
    cards: [],
    moneyTotal: startingPot,
    chips: newChipMap,
  };
};

export const createVillain = (): PlayerInterface => {
  const getUniqueVillainName = (theme: VillainThemeType) => {
    const pool = villainPool[theme];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const newVillainName = getUniqueVillainName("classic");
  const chipMap = createChips(500);

  const newVillain: PlayerInterface = {
    id: newVillainName + generateRandomString(4),
    name: newVillainName,
    type: "computer",
    cards: [],
    moneyTotal: 500,
    chips: chipMap,
  };

  return newVillain;
};
export const generateDeck = (): CardInterface[] => {
  const deck: CardInterface[] = [];

  // Cast keys to the specific Suit type defined in your CardInterface
  const suits = Object.keys(cardSuitIcons) as (keyof typeof cardSuitIcons)[];
  const ranks = Object.keys(cardRankValues);

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const rawValue = isNaN(Number(rank)) ? rank : Number(rank);

      deck.push({
        // Use the specific types from your types.ts instead of 'any'
        value: rawValue as CardValueType,
        suit: suit,
        side: "face-down",
        currentLocation: "deck" as CurrentLocationType,
      });
    });
  });

  return deck;
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
