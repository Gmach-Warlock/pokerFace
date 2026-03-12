import type { CardInterface, FetchInterface } from "./types";

export const cardSuitIcons = {
  club: "/club.png",
  diamond: "/diamond.png",
  heart: "/heart.png",
  spade: "/spade.png",
};
export const deckDesigns = {
  faceExplosion: "/faceExplosion.svg",
  fireBolt: "/fireBolt.svg",
  flowerBall: "/flowerBall.svg",
  redFire: "/redFire.svg",
  theFlyingCow: "/theFlyingCow.svg",
};
export const chipLogos = {
  boy: "/chipBoy.png",
  girl: "/chipGirl.png",
};
export const pokerChips = {
  black: {
    face: "/blackChipFace.svg",
    faceDropShadow: "/blackChipFaceDropShadow.svg",
    side: "blackChipSide.svg",
    sideDropShadow: "blackChipSideDropShadow.svg",
  },
  blue: {
    face: "/blueChipFace.svg",
    faceDropShadow: "/blueChipFaceDropShadow.svg",
    side: "blueChipSide.svg",
    sideDropShadow: "blueChipSideDropShadow.svg",
  },
  green: {
    face: "/greenChipFace.svg",
    faceDropShadow: "/greenChipFaceDropShadow.svg",
    side: "grenChipSide.svg",
    sideDropShadow: "greenChipSideDropShadow.svg",
  },
  red: {
    face: "/redChipFace.svg",
    faceDropShadow: "/redChipFaceDropShadow.svg",
    side: "redChipSide.svg",
    sideDropShadow: "redChipSideDropShadow.svg",
  },
  white: {
    face: "/whiteChipFace.svg",
    faceDropShadow: "/whiteChipFaceDropShadow.svg",
    side: "whiteChipSide.svg",
    sideDropShadow: "whiteChipSideDropShadow.svg",
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

export const fetchObject: FetchInterface = {
  status: "idle",
  message: "",
  payload: null,
};
