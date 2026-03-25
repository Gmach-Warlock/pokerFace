import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CardInterface,
  DeckStyleType,
  DifficultyType,
  MatchLocationType,
  NumberOfOpponentsType,
  PlayerInterface,
} from "../../app/types";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import { matchMap, villainPool } from "../../app/assets";

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
    difficultyLevel: DifficultyType;
    matchLocation: MatchLocationType;
    opponents: PlayerInterface[];
    deck: CardInterface[];
    pot: number;
  };
  isMatchStarted: boolean;
}

interface GamePayloadInterface {
  numberOfOpponents: NumberOfOpponentsType;
  levelOfDifficulty: DifficultyType;
  matchLocation: MatchLocationType;
}

const initialGameState: GameInterface = {
  isPlaying: false,
  currentlyDisplayed: "title",
  currentMatch: {
    numberOfOpponents: "tbd",
    deckStyle: "arrowBolt",
    difficultyLevel: "normal",
    matchLocation: "shelter",
    opponents: [],

    deck: [],
    pot: 0,
  },
  isMatchStarted: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    finishMatch: (state) => {
      state.currentlyDisplayed = "postGame";
    },
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

    startMatch: (state, action: PayloadAction<GamePayloadInterface>) => {
      const { numberOfOpponents, levelOfDifficulty, matchLocation } =
        action.payload;

      state.isPlaying = true;
      state.currentlyDisplayed = "match";
      state.currentMatch.numberOfOpponents = numberOfOpponents;
      state.currentMatch.difficultyLevel = levelOfDifficulty;
      state.currentMatch.matchLocation = matchLocation;
      state.currentMatch.deck = shuffleDeck(generateDeck());

      const count = numberOfOpponents === "tbd" ? 1 : numberOfOpponents;
      const availableThemes = matchMap[matchLocation] || ["classic"];
      const selectedTheme = availableThemes[0]; // Or your weighted pick logic

      const namePool = [...villainPool[selectedTheme]];

      // 2. Shuffle the names using your shuffleDeck-style logic (Fisher-Yates)
      for (let i = namePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [namePool[i], namePool[j]] = [namePool[j], namePool[i]];
      }

      state.currentMatch.opponents = Array.from({ length: count }).map(
        (_, index) => {
          const uniqueName = namePool[index] || `Outlaw ${index + 1}`;
          return createVillain(selectedTheme, uniqueName);
        },
      );
    },
    startPlaying: (state) => {
      state.isPlaying = true;
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
