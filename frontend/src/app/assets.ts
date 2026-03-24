import type { CardInterface, FetchInterface } from "./types";

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
export const dialoguePool = {
  strongHand: {
    classic: [
      "A formidable display of cards.",
      "I believe the odds are in my favor.",
    ],
    gritty: ["Read 'em and weep.", "You're walking into a buzzsaw, kid."],
    modern: [
      "Straight fire in my hand right now.",
      "This is peak performance.",
    ],
    pro: [
      "The equity here is heavily weighted toward me.",
      "I've got the nuts.",
    ],
  },
  weakHand: {
    classic: [
      "The cards are quite shy today.",
      "One must make do with what one is dealt.",
    ],
    gritty: ["Garbage in, garbage out.", "This hand is a total dumpster fire."],
    modern: ["Low-key struggling here.", "This hand is a major 'oof'."],
    pro: ["Range disadvantage is real right now.", "Dead cards, moving on."],
  },
  bluffing: {
    classic: [
      "Confidence is the soul of the game.",
      "A bold move for a bold player.",
    ],
    gritty: [
      "You don't have the guts to call.",
      "I can smell your fear from here.",
    ],
    modern: [
      "Just vibe-checking your stack.",
      "Don't overthink it, just fold.",
    ],
    pro: ["I'm polarized here, and you know it.", "Testing your resolve."],
  },
  gloating: {
    classic: ["Splendid! Simply splendid.", "Better luck next time, my dear."],
    gritty: [
      "Easiest money I made all day.",
      "Next time, bring a bigger wallet.",
    ],
    modern: ["L + Ratio + No Chips.", "Ez game, ez life."],
    pro: [
      "Standard result. I played the math.",
      "Don't tap the glass on the fish.",
    ],
  },
  sulking: {
    classic: ["How very unfortunate.", "I simply cannot believe my luck."],
    gritty: ["Complete and utter garbage.", "That river was a crime."],
    modern: ["Absolute robbery.", "Bruh. Are you serious right now?"],
    pro: [
      "One-outer. Disgusting.",
      "I played it perfectly; the deck just failed.",
    ],
  },
  neutral: {
    classic: ["The game continues.", "Interesting..."],
    gritty: ["Just play the cards.", "Moving right along."],
    modern: ["Neutral vibes only.", "Next hand, let's go."],
    pro: ["Action's on you.", "Checking the ranges."],
  },
  nagging: {
    classic: [
      "Patience is a virtue, but time is fleeting.",
      "Shall we continue, sir?",
    ],
    gritty: [
      "Clock's ticking. You falling asleep?",
      "I haven't got all day. Move it.",
    ],
    modern: ["Don't lag the game, let's go.", "Hello? Anyone home?"],
    pro: [
      "I'm going to have to call 'time' soon.",
      "Keep the game moving, please.",
    ],
  },
  egging: {
    classic: [
      "A wager of this size surely requires a response.",
      "Are you quite finished?",
    ],
    gritty: [
      "Just put the chips in. Stop stalling.",
      "You're scared. I can see it.",
    ],
    modern: ["Betting is the whole point, right?", "Send it. Full heart."],
    pro: [
      "It's a profitable call if you have the range.",
      "You know you want to see the cards.",
    ],
  },
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
export const pokerChips = {
  black: {
    face: "/blackChipFace.png",
    faceDropShadow: "/blackChipFaceDropShadow.png",
    side: "blackChipSide.png",
    sideDropShadow: "blackChipSideDropShadow.png",
  },
  blue: {
    face: "/blueChipFace.png",
    faceDropShadow: "/blueChipFaceDropShadow.png",
    side: "blueChipSide.png",
    sideDropShadow: "blueChipSideDropShadow.png",
  },
  green: {
    face: "/greenChipFace.png",
    faceDropShadow: "/greenChipFaceDropShadow.png",
    side: "greenChipSide.png",
    sideDropShadow: "greenChipSideDropShadow.png",
  },
  red: {
    face: "/redChipFace.png",
    faceDropShadow: "/redChipFaceDropShadow.png",
    side: "redChipSide.png",
    sideDropShadow: "redChipSideDropShadow.png",
  },
  white: {
    face: "/whiteChipFace.png",
    faceDropShadow: "/whiteChipFaceDropShadow.png",
    side: "whiteChipSide.png",
    sideDropShadow: "whiteChipSideDropShadow.png",
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
  ],
  pro: ["Doyle", "Stu", "Phil", "Johnny", "Annette"],
};
