import type {
  CardSuitType,
  MatchPhaseType,
  MatchPhaseConfigType,
} from "../../types/matchTypes";
import type {
  CardInterface,
  CasinoVariantSpecifics,
  ChipMapInterface,
  HoldemSpecifics,
  DrawSpecifics,
  NoSpecificsInterface,
} from "../../interfaces/matchInterfaces";
import type { MatchMapInterface } from "../../interfaces/worldMapInterfaces";

export const anteMap = {
  shelter: 1,
  "low-vault-lounge": 5,
  "neon-alley-club": 10,
  halls: 15,
  compound: 15,
  "holdem-hotel": 25,
  "draw-den": 25,
  "stud-stay": 25,
  atrium: 50,
  zenith: 100,
};
export const cardSuitIcons: Record<CardSuitType, string> = {
  club: "/club.png",
  diamond: "/diamond.png",
  heart: "/heart.png",
  spade: "/spade.png",
};
export const cardRankValues = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};
export const chipLogos = {
  boy: "/chipBoy.png",
  girl: "/chipGirl.png",
};
export const chipValues = {
  white: 1,
  red: 5,
  blue: 10,
  green: 25,
  black: 100,
};

export const deckDesigns = {
  arrowBolt: "/arrowBolt.png",
  explodingFace: "/explodingFace.png",
  inBloom: "/inBloom.png",
  redFire: "/redFire.png",
  theFlyingCow: "/theFlyingCow.png",
};
export const gamePhaseSequences: Record<string, MatchPhaseType[]> = {
  draw: ["ante", "deal", "bettingOne", "draw", "bettingTwo", "showdown"],
  holdem: ["ante", "deal", "flop", "turn", "river", "showdown"],
  stud: [
    "ante",
    "thirdStreet",
    "fourthStreet",
    "fifthStreet",
    "sixthStreet",
    "seventhStreet",
    "showdown",
  ],
};
export const handRanks = {
  highCard: {
    rankValue: 0,
    strength: 0,
    label: "High Card",
  },
  onePair: {
    rankValue: 100,
    strength: 1,
    label: "One Pair",
  },
  twoPair: {
    rankValue: 200,
    strength: 2,
    label: "Two Pair",
  },
  threeOfAKind: {
    rankValue: 300,
    strength: 3,
    label: "Three of a Kind",
  },
  straight: {
    rankValue: 400,
    strength: 4,
    label: "Straight",
  },
  flush: {
    rankValue: 500,
    strength: 5,
    label: "Flush",
  },
  fullHouse: {
    rankValue: 600,
    strength: 6,
    label: "Full House",
  },
  fourOfAKind: {
    rankValue: 700,
    strength: 7,
    label: "Four of a Kind",
  },
  straightFlush: {
    rankValue: 800,
    strength: 8,
    label: "Straight Flush",
  },
  royalFlush: {
    rankValue: 900,
    strength: 9,
    label: "Royal Flush",
  },
};

export const INITIAL_NO_SPECIFICS: NoSpecificsInterface = {
  isWaiting: true,
  lobbyMessage: "Waiting for match to begin...",
  readyPlayers: [],
};

export const INITIAL_CASINO_SPECIFICS: CasinoVariantSpecifics = {
  dealersHand: [],
  houseEdge: 0.05, // 5% edge default
  payoutMultiplier: 1,
};

export const INITIAL_HOLDEM_SPECIFICS: HoldemSpecifics = {
  communityCards: [],
  burnCards: [],
  buttonIndex: 0,
  bigBlind: 20,
  smallBlind: 10,
};

export const INITIAL_DRAW_SPECIFICS: DrawSpecifics = {
  discardLimit: 3,
  maxDiscardsPerPlayer: 3,
};

export const matchPhaseMessages = {
  holdem: {
    preFlop: "Place your bets",
    flop: "The Flop",
    turn: "The Turn",
    river: "The River",
    showdown: "Show 'em if you got 'em!",
  },
  draw: {
    ante: "Pay the Ante",
    deal: "Opening Deal",
    bettingOne: "First Round of Betting",
    draw: "Discard and Draw",
    bettingTwo: "Final Round of Betting",
    showdown: "The Reveal",
  },
  stud: {
    ante: "Pay the Ante",
    thirdStreet: "Third Street (Deal)",
    fourthStreet: "Fourth Street",
    fifthStreet: "Fifth Street",
    sixthStreet: "Sixth Street",
    seventhStreet: "The River (Down Card)",
    showdown: "Showdown",
  },
};

export const matchPhaseMap: MatchPhaseConfigType = {
  draw: {
    notInGameYet: { cards: 0, target: "players", side: "face-down" },
    ante: { cards: 0, target: "players", side: "face-down" },
    deal: { cards: 5, target: "players", side: "face-down" },
    bettingOne: { cards: 0, target: "players", side: "face-up" }, // Add this!
    discard: { cards: 0, target: "players", side: "face-up" },
    draw: { cards: "variable", target: "players", side: "face-up" },
    bettingTwo: { cards: 0, target: "players", side: "face-up" }, // Add this!
    showdown: { cards: 0, target: "players", side: "face-up" }, // Add this!
  },
  holdem: {
    ante: { cards: 0, target: "players", side: "face-down" },
    deal: { cards: 2, target: "players", side: "face-down" },
    preflop: { cards: 0, target: "players", side: "face-down" }, // Betting only
    flop: { cards: 3, target: "board", side: "face-up" },
    bettingOne: { cards: 0, target: "players", side: "face-up" },
    turn: { cards: 1, target: "board", side: "face-up" },
    bettingTwo: { cards: 0, target: "players", side: "face-up" },
    river: { cards: 1, target: "board", side: "face-up" },
    bettingThree: { cards: 0, target: "players", side: "face-up" },
    showdown: { cards: 0, target: "players", side: "face-up" },
  },
  stud: {
    ante: { cards: 0, target: "players", side: "face-down" },
    street2: { cards: 2, target: "players", side: "face-down" },
    street3: { cards: 1, target: "players", side: "face-up" }, // First "Upcard"
    street4: { cards: 1, target: "players", side: "face-up" },
    street5: { cards: 1, target: "players", side: "face-up" },
    street6: { cards: 1, target: "players", side: "face-up" },
    river: { cards: 1, target: "players", side: "face-down" }, // Final "Downcard"
    showdown: { cards: 0, target: "players", side: "face-up" },
  },
};
export const matchMap: MatchMapInterface = {
  shelter: ["gritty"],
  "low-vault-lounge": ["gritty", "modern"],
  "neon-alley-club": ["gritty", "modern", "classy"],
  halls: ["modern", "classic"],
  compound: ["modern", "pro", "classy"],
  "holdem-hotel": ["pro", "modern", "classy"],
  "draw-den": ["pro", "classic", "classy"],
  "stud-stay": ["pro", "classic", "classy"],
  atrium: ["classic", "pro", "modern", "classy"],
  zenith: ["classic", "gritty", "modern", "classy", "pro"],
};
// Map out the grid coordinates for each card value
export const pipPositions: Record<number, { col: number; row: number }[]> = {
  2: [
    { col: 2, row: 1 },
    { col: 2, row: 5 },
  ],
  3: [
    { col: 2, row: 1 },
    { col: 2, row: 3 },
    { col: 2, row: 5 },
  ],
  4: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
  ],
  5: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 2, row: 3 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
  ],
  6: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
  ],
  7: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 2, row: 2 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
  ],
  8: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 2, row: 2 },
    { col: 2, row: 4 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
  ],
  9: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 2, row: 4 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
    { col: 1, row: 7 },
    { col: 3, row: 7 },
  ],
  10: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 2, row: 2 },
    { col: 2, row: 6 },
    { col: 1, row: 5 },
    { col: 3, row: 5 },
    { col: 1, row: 7 },
    { col: 3, row: 7 },
  ],
};

export const phaseSequences = {
  draw: ["ante", "deal", "bettingOne", "draw", "bettingTwo", "showdown"],
  holdem: [
    "ante", // Optional small/big blind phase
    "deal", // Pre-flop (2 cards to players)
    "bettingOne", // Pre-flop betting
    "flop", // 3 community cards
    "bettingTwo",
    "turn", // 4th community card
    "bettingThree",
    "river", // 5th community card
    "bettingFour",
    "showdown",
  ],
  stud: [
    "ante",
    "thirdStreet", // Deal 2 down, 1 up
    "bettingOne",
    "fourthStreet", // 1 card up
    "bettingTwo",
    "fifthStreet", // 1 card up
    "bettingThree",
    "sixthStreet", // 1 card up
    "bettingFour",
    "seventhStreet", // 1 card down
    "bettingFive",
    "showdown",
  ],
} as const;

// Helper to get the actual phase strings for type safety
export type MatchVariant = keyof typeof phaseSequences;

export const pokerChips = {
  black: {
    face: "/blackChipFace.png",
    faceDropShadow: "/blackChipFaceDropShadow.png",
    side: "/blackChipSide.png",
    sideDropShadow: "/blackChipSideDropShadow.png",
  },
  blue: {
    face: "/blueChipFace.png",
    faceDropShadow: "/blueChipFaceDropShadow.png",
    side: "/blueChipSide.png",
    sideDropShadow: "/blueChipSideDropShadow.png",
  },
  green: {
    face: "/greenChipFace.png",
    faceDropShadow: "/greenChipFaceDropShadow.png",
    side: "/greenChipSide.png",
    sideDropShadow: "/greenChipSideDropShadow.png",
  },
  red: {
    face: "/redChipFace.png",
    faceDropShadow: "/redChipFaceDropShadow.png",
    side: "/redChipSide.png",
    sideDropShadow: "/redChipSideDropShadow.png",
  },
  white: {
    face: "/whiteChipFace.png",
    faceDropShadow: "/whiteChipFaceDropShadow.png",
    side: "/whiteChipSide.png",
    sideDropShadow: "/whiteChipSideDropShadow.png",
  },
};

export const royalFlush: CardInterface[] = [
  {
    value: "A",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
    isDiscarded: false,
    deckDesign: deckDesigns.arrowBolt,
  },
  {
    value: "K",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
    isDiscarded: false,
    deckDesign: deckDesigns.arrowBolt,
  },
  {
    value: "Q",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
    isDiscarded: false,
    deckDesign: deckDesigns.arrowBolt,
  },
  {
    value: "J",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
    isDiscarded: false,
    deckDesign: deckDesigns.arrowBolt,
  },
  {
    value: 10,
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
    isDiscarded: false,
    deckDesign: deckDesigns.arrowBolt,
  },
];
export const startingChips: ChipMapInterface = {
  white: 30,
  red: 25,
  blue: 17,
  green: 7,
  black: 0,
};
export const suitColors = {
  club: "black",
  spade: "black",
  heart: "red",
  diamond: "red",
};
