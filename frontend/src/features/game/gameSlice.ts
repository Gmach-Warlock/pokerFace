import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CardInterface,
  DeckStyleType,
  DifficultyType,
  MatchLocationType,
  NumberOfOpponentsType,
  PlayerInterface,
  CurrentLocationType,
  GamePhaseInterface,
  CardSideType,
  DeckNumberType,
  GamePhaseType,
  GamePhaseConfigType,
} from "../../app/types";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import {
  matchMap,
  villainPool,
  gamePhases,
  GamePhaseMap,
} from "../../app/assets";

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
    numberOfDecks: DeckNumberType;
    opponents: PlayerInterface[];
    herosHand: CardInterface[];
    dealersHand: CardInterface[];
    deck: CardInterface[];
    pot: number;
    currentPhase: GamePhaseInterface;
  };
  isMatchStarted: boolean;
}

interface GamePayloadInterface {
  numberOfOpponents: NumberOfOpponentsType;
  levelOfDifficulty: DifficultyType;
  matchLocation: MatchLocationType;
  numberOfDecks: DeckNumberType;
}

const initialGameState: GameInterface = {
  isPlaying: false,
  currentlyDisplayed: "title",
  currentMatch: {
    numberOfOpponents: "tbd",
    deckStyle: "arrowBolt",
    difficultyLevel: "normal",
    matchLocation: "shelter",
    numberOfDecks: 1,
    opponents: [],
    herosHand: [],
    dealersHand: [],
    deck: [],
    pot: 0,
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
    addToPot: (state, action: PayloadAction<number>) => {
      state.currentMatch.pot += action.payload;
    },
    advancePhase: (state) => {
      const { type, phase } = state.currentMatch.currentPhase;
      const phaseSequence = Object.keys(
        gamePhases[type as keyof typeof gamePhases],
      ) as GamePhaseType[];
      const currentIndex = phaseSequence.indexOf(phase as GamePhaseType);

      if (currentIndex === -1) {
        state.currentMatch.currentPhase.phase = phaseSequence[0];
      } else if (currentIndex < phaseSequence.length - 1) {
        state.currentMatch.currentPhase.phase = phaseSequence[currentIndex + 1];
      } else {
        state.currentlyDisplayed = "postGame";
      }
    },
    checkAndRefillDeck: (state) => {
      const { deck, numberOfDecks } = state.currentMatch;
      const threshold = 15;

      if (deck.length < threshold) {
        const freshCards = generateDeck(numberOfDecks);
        const shuffledCards = shuffleDeck(freshCards);
        state.currentMatch.deck = [...deck, ...shuffledCards];
      }
    },
    dealCard: (
      state,
      action: PayloadAction<{
        target: "hero" | "dealer" | "opponent";
        index?: number;
        side: CardSideType;
      }>,
    ) => {
      const { deck } = state.currentMatch;
      const { target, index, side } = action.payload;

      const card = deck.pop();
      if (!card) return; // Guard against empty deck

      // Prepare the card with metadata (consistent with dealRound)
      const dealtCard = { ...card, side };

      if (target === "hero") {
        dealtCard.currentLocation = "p1";
        state.currentMatch.herosHand.push(dealtCard);
      } else if (target === "dealer") {
        dealtCard.currentLocation = "dealer";
        state.currentMatch.dealersHand.push(dealtCard);
      } else if (target === "opponent" && typeof index === "number") {
        const opponent = state.currentMatch.opponents[index];
        if (opponent) {
          if (!opponent.currentHand) opponent.currentHand = [];
          dealtCard.currentLocation = `p${index + 2}` as CurrentLocationType;
          opponent.currentHand.push(dealtCard);
        }
      }
    },
    dealRound: (state) => {
      const { type, phase } = state.currentMatch.currentPhase;
      const typedMap = GamePhaseMap as GamePhaseConfigType;
      const config = typedMap[type]?.[phase];

      if (!config || config.cards === 0) return;

      // --- 1. HANDLE HERO DRAW/SWAP ---
      if (config.hero) {
        if (phase === "draw") {
          // Filter out cards marked for discard
          state.currentMatch.herosHand = state.currentMatch.herosHand.filter(
            (card) => !card.isDiscarded,
          );

          // Calculate how many new ones we need to get back to 5
          const needs = 5 - state.currentMatch.herosHand.length;

          for (let i = 0; i < needs; i++) {
            const card = state.currentMatch.deck.pop();
            if (card) {
              state.currentMatch.herosHand.push({
                ...card,
                side: config.hero,
                currentLocation: "p1",
                isDiscarded: false, // Ensure new card isn't pre-discarded
              });
            }
          }
        } else {
          // Standard initial deal logic (what you had before)
          const needs =
            config.cards === "variable"
              ? 5 - state.currentMatch.herosHand.length
              : (config.cards as number);
          for (let i = 0; i < needs; i++) {
            const card = state.currentMatch.deck.pop();
            if (card) {
              state.currentMatch.herosHand.push({
                ...card,
                side: config.hero,
                currentLocation: "p1",
                isDiscarded: false,
              });
            }
          }
        }
      }

      // --- 2. HANDLE OPPONENT DRAW (AI) ---
      if (config.opp) {
        state.currentMatch.opponents.forEach((opp, idx) => {
          if (phase === "draw") {
            // Simple AI: Discard nothing for now (Stand Pat)
            // You can add AI logic here later!
            opp.currentHand = opp.currentHand.filter(
              (card) => !card.isDiscarded,
            );
            const needs = 5 - opp.currentHand.length;
            for (let i = 0; i < needs; i++) {
              const card = state.currentMatch.deck.pop();
              if (card) {
                opp.currentHand.push({
                  ...card,
                  side: config.opp!,
                  currentLocation: `p${idx + 2}` as CurrentLocationType,
                });
              }
            }
          } else {
            // Standard initial deal
            const needs =
              config.cards === "variable"
                ? 5 - opp.currentHand.length
                : (config.cards as number);
            for (let i = 0; i < needs; i++) {
              const card = state.currentMatch.deck.pop();
              if (card) {
                opp.currentHand.push({
                  ...card,
                  side: config.opp!,
                  currentLocation: `p${idx + 2}` as CurrentLocationType,
                });
              }
            }
          }
        });
      }
    },
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
      const {
        numberOfOpponents,
        levelOfDifficulty,
        matchLocation,
        numberOfDecks,
      } = action.payload;
      state.currentMatch.numberOfDecks = numberOfDecks;
      state.isPlaying = true;
      state.currentlyDisplayed = "match";
      state.currentMatch.numberOfOpponents = numberOfOpponents;
      state.currentMatch.difficultyLevel = levelOfDifficulty;
      state.currentMatch.matchLocation = matchLocation;
      state.currentMatch.deck = shuffleDeck(generateDeck(numberOfDecks));

      const count = numberOfOpponents === "tbd" ? 1 : numberOfOpponents;
      const availableThemes = matchMap[matchLocation] || ["classic"];
      const selectedTheme = availableThemes[0]; // Or your weighted pick logic
      const namePool = [...villainPool[selectedTheme]];

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
      const gameType = state.currentMatch.currentPhase.type;
      const phaseSequence = Object.keys(
        gamePhases[gameType],
      ) as GamePhaseType[];
      state.currentMatch.currentPhase.phase = phaseSequence[0];
    },
    startPlaying: (state) => {
      state.isPlaying = true;
    },
    subtractOpponentMoney: (
      state,
      action: PayloadAction<{ opponentIndex: number; amount: number }>,
    ) => {
      const opponent =
        state.currentMatch.opponents[action.payload.opponentIndex];
      if (opponent) {
        opponent.money -= action.payload.amount;
      }
    },
    toggleDiscard: (state, action: PayloadAction<number>) => {
      const cardIndex = action.payload;

      const card = state.currentMatch.herosHand[cardIndex];

      if (card) {
        card.isDiscarded = !card.isDiscarded;
      }
    },
  },
});

export const {
  addToPot,
  advancePhase,
  checkAndRefillDeck,
  dealCard,
  dealRound,
  finishMatch,
  goToMainMenu,
  goToPreGame,
  goToSettings,
  quitPlaying,
  startMatch,
  startPlaying,
  subtractOpponentMoney,
  toggleDiscard,
} = gameSlice.actions;
export default gameSlice.reducer;
