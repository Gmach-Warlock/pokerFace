import { createSlice } from "@reduxjs/toolkit";
import type { DeckStyleType, NumberOfOpponentsType } from "../../app/types";

interface GameInterface {
  isPlaying: boolean;
  currentlyDisplayed:
    | "title"
    | "match"
    | "postGame"
    | "mainMenu"
    | "settings"
    | "preGame";
  currentMatch: {
    numberOfOpponents: NumberOfOpponentsType;
    deckStyle: DeckStyleType;
    opponents: Array<object>;
  };
  isMatchStarted: boolean;
}

const initialGameState: GameInterface = {
  isPlaying: false,
  currentlyDisplayed: "title",
  currentMatch: {
    numberOfOpponents: "tbd",
    deckStyle: "arrowBolt",
    opponents: [],
  },
  isMatchStarted: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    startPlaying: (state) => {
      state.isPlaying = true;
    },
    quitPlaying: (state) => {
      state.isPlaying = false;
    },
    goToMainMenu: (state) => {
      state.currentlyDisplayed = "mainMenu";
    },
    goToPreGame: (state) => {
      state.currentlyDisplayed = "preGame";
    },
    startMatch: (state) => {
      state.currentlyDisplayed = "match";
    },
    finishMatch: (state) => {
      state.currentlyDisplayed = "postGame";
    },
    goToSettings: (state) => {
      state.currentlyDisplayed = "settings";
    },
  },
});

export const {
  startPlaying,
  quitPlaying,
  goToMainMenu,
  goToPreGame,
  startMatch,
  finishMatch,
  goToSettings,
} = gameSlice.actions;
export default gameSlice.reducer;
