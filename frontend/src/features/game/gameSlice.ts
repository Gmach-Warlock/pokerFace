import { createSlice } from "@reduxjs/toolkit";
import type { GameInterface } from "../../app/interfaces/gameInterfaces";
import { startMatch } from "../match/matchSlice";

const initialGameState: GameInterface = {
  isPlaying: false,
  currentlyDisplayed: "title",
  currentMatch: {
    numberOfOpponents: null,
    deckStyle: "arrowBolt",
    difficultyLevel: "normal",
    matchLocation: "shelter",
    matchType: "draw",
    numberOfDecks: 1,
    players: [],
    dealersHand: [],
    deck: [],
    pot: 0,
    currentBetOnTable: 0,
    lastRaiserId: null,
    activePlayerIndex: 0,
    currentPhase: {
      type: "draw",
      phase: "notInGameYet",
    },
  },
  isMatchStarted: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    goToMainMenu: (state) => {
      state.currentlyDisplayed = "mainMenu";
    },
    goToPreGame: (state) => {
      state.currentlyDisplayed = "preGame";
    },
    goToSettings: (state) => {
      state.currentlyDisplayed = "settings";
    },
    quitPlaying: (state) => {
      state.isPlaying = false;
    },
    resetGame: () => {
      return initialGameState;
    },
    startPlaying: (state) => {
      state.isPlaying = true;
    },
  },
  extraReducers: (builder) => {
    // Listen specifically for the startMatch action from the OTHER slice
    builder.addCase(startMatch, (state) => {
      state.isPlaying = true;
    });
  },
});

export const {
  goToMainMenu,
  goToPreGame,
  goToSettings,
  quitPlaying,
  resetGame,
  startPlaying,
} = gameSlice.actions;
export default gameSlice.reducer;
