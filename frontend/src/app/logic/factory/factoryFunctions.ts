import type { VillainThemeType } from "../../types/villainsTypes";
import { villainPool } from "../../assets/villain/villainAssets";
import { cardSuitIcons, cardRankValues } from "../../assets/match/matchAssets";
import { generateRandomString } from "../general/generalUtils";
import { INITIAL_SESSION_STATS } from "../../assets/profile/profileAssets";
import type {
  CardInterface,
  ChipMapInterface,
  PlayerInterface,
} from "../../interfaces/matchInterfaces";
import type {
  CardValueType,
  CurrentLocationType,
  DeckStyleType,
} from "../../types/matchTypes";

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

export const createVillain = (
  theme: VillainThemeType,
  nameOverride?: string,
): PlayerInterface => {
  const getRandomVillainName = (theme: VillainThemeType) => {
    const pool = villainPool[theme];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const newVillainName = nameOverride || getRandomVillainName(theme);
  const chipMap = createChips(500);

  const newVillain: PlayerInterface = {
    id: generateRandomString(8),
    name: newVillainName,
    type: "computer",
    difficulty: "normal",
    money: 500,

    currentMatch: {
      isFolded: false,
      chips: chipMap,
      currentBet: 0,
      hasActed: false,
      isAllin: false,
      currentHand: [],
      sessionStats: INITIAL_SESSION_STATS,
    },
  };

  return newVillain;
};
export const generateDeck = (
  count: number = 1,
  design: DeckStyleType,
): CardInterface[] => {
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
          deckDesign: design,
        });
      });
    });
  }

  return deck;
};
