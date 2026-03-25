import type {
  CardInterface,
  ChipMapInterface,
  FetchInterface,
  MatchMapInterface,
} from "./types";
export const cardSuitIcons = {
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
export const fetchObject: FetchInterface = {
  status: "idle",
  message: "",
  payload: null,
};
export const gamePhases = {
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
  },
  {
    value: "K",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
  },
  {
    value: "Q",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
  },
  {
    value: "J",
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
  },
  {
    value: 10,
    suit: "heart",
    side: "face-up",
    currentLocation: "demo",
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
export const villainPool = {
  classic: [
    "Arthur",
    "Eleanor",
    "Raymond",
    "Martha",
    "Harvey",
    "Janet",
    "Greg",
    "Bonnie",
    "Kyle",
    "Mary",
    "Clark",
    "Donna",
    "Frank",
    "Gretta",
    "Wilma",
    "Joey",
  ],
  gritty: [
    "Jax",
    "Mickey",
    "Sloane",
    "Rocco",
    "Vinnie",
    "Ripley",
    "Moxie",
    "Gunnar",
    "Jinx",
    "Aria",
    "Sledge",
    "Vanna",
    "Steel",
    "Gutter",
    "Tank",
    "Li",
  ],
  modern: [
    "Leo",
    "Sienna",
    "Kai",
    "Ezra",
    "Luna",
    "Ryker",
    "Nova",
    "Xiomara",
    "Rhodes",
    "Zadie",
    "Merrick",
    "Lana",
    "Vaughn",
  ],
  classy: [
    "Julian",
    "Beatrice",
    "Bob",
    "Madelaine",
    "Gemma",
    "Hubert",
    "Lindsay",
    "Veronica",
    "Winthrop",
    "Joseph",
    "Gerald",
    "Kathleen",
    "Derek",
  ],
  pro: [
    "Doyle",
    "Stu",
    "Phil",
    "Johnny",
    "Annette",
    "Barbara",
    "Linda",
    "Carlos",
    "Jennifer",
    "Michael",
  ],
};
