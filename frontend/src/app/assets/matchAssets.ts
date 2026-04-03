import type { CardSuitType } from "../types/matchTypes";
import type {
  CardInterface,
  ChipMapInterface,
} from "../interfaces/matchInterfaces";
import type { MatchMapInterface } from "../interfaces/worldMapInterfaces";

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
export const handRanks = {
  highCard: {
    value: 0,
    label: "High Card",
  },
  onePair: {
    value: 1,
    label: "One Pair",
  },
  twoPair: {
    value: 2,
    label: "Two Pair",
  },
  threeOfAKind: {
    value: 3,
    label: "Three of a Kind",
  },
  straight: {
    value: 4,
    label: "Straight",
  },
  flush: {
    value: 5,
    label: "Flush",
  },
  fullHouse: {
    value: 6,
    label: "Full House",
  },
  fourOfAKind: {
    value: 7,
    label: "Four of a Kind",
  },
  straightFlush: {
    value: 8,
    label: "Straight Flush",
  },
  royalFlush: {
    value: 9,
    label: "Royal Flush",
  },
};
export const matchPhases = {
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
export const matchPhaseMap = {
  draw: {
    notInGameYet: { cards: 5, hero: "front", opp: "back" }, // Add this!
    ante: { cards: 5, hero: "front", opp: "back" }, // And this!    deal: { cards: 5, hero: "face-up", opp: "face-down" },
    discard: { cards: 0, hero: "face-up", opp: "face-down" },
    draw: { cards: "variable", hero: "face-up", opp: "face-down" },
  },
  holdem: {
    ante: { cards: 0, hero: "face-up", opp: "face-down" },
    hole: { cards: 2, hero: "face-up", opp: "face-down" },
    flop: { cards: 3, community: "face-up" },
    turn: { cards: 1, community: "face-up" },
    river: { cards: 1, community: "face-up" },
  },
  stud: {
    street2: { cards: 2, hero: "face-down", opp: "face-down" },
    street3: { cards: 1, hero: "face-up", opp: "face-up" },
    street4: { cards: 1, hero: "face-up", opp: "face-up" },
    street5: { cards: 1, hero: "face-up", opp: "face-up" },
    street6: { cards: 1, hero: "face-up", opp: "face-up" },
    river: { cards: 1, hero: "face-down", opp: "face-down" },
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
