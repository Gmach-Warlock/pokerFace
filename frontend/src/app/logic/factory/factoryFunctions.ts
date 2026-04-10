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

export const createDealer = (): PlayerInterface => ({
  general: {
    id: "dealer-001",
    name: "Dealer",
    type: "computer", // Or a new type 'system' if you prefer
    isDealer: true, // The new property you mentioned
  },
  state: {
    hand: [],
    chips: {
      white: 0,
      red: 0,
      blue: 0,
      green: 0,
      black: 0,
    },
    currentBet: 0,
    isFolded: false,
    isAllIn: false,
    hasActed: false,
    position: 2,
  },
  account: {
    totalMoney: 0,
    plei: 0,
    level: 1,
    xp: 0,
    unlockedDecks: ["arrowBolt"],
    currentDeckChoice: "arrowBolt",
  },
  flags: {
    isInitialLoad: true,
    isProcessingAction: false,
    isWinner: false,
    hasTurnFocus: false,
  },
  stats: INITIAL_SESSION_STATS,
});

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
    general: {
      id: generateRandomString(8),
      name: newVillainName,
      type: "computer",
      isDealer: false,
      difficulty: "normal",
    },
    state: {
      hand: [],
      chips: chipMap,
      currentBet: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
      lastAction: "check",
      isDiscarding: false,
      position: 0,
    },
    account: {
      totalMoney: 1000,
      plei: 0,
      level: 1,
      xp: 0,
      unlockedDecks: ["arrowBolt"],
      currentDeckChoice: "arrowBolt",
    },
    flags: {
      isInitialLoad: false,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: false,
    },
    stats: INITIAL_SESSION_STATS,
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
