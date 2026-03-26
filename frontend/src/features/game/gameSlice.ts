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

      // 1. Cast the result of Object.keys to GamePhaseType[]
      const phaseSequence = Object.keys(
        gamePhases[type as keyof typeof gamePhases],
      ) as GamePhaseType[];

      // 2. Cast 'phase' here as well to ensure the index search works correctly
      const currentIndex = phaseSequence.indexOf(phase as GamePhaseType);

      if (currentIndex === -1) {
        // 3. Since phaseSequence[0] is now seen as GamePhaseType, this works!
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
        // Generate the amount of decks specified for this match
        const freshCards = generateDeck(numberOfDecks);
        const shuffledCards = shuffleDeck(freshCards);

        // Add the new cards to the bottom of the current deck
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

      // Guard: if no config or cards to deal, exit
      if (!config || config.cards === 0) return;

      // 1. Determine how many cards to deal
      // If 'variable', we calculate how many cards the player needs to reach 5
      const getRequiredCount = (currentHandLength: number) => {
        return config.cards === "variable"
          ? 5 - currentHandLength
          : (config.cards as number);
      };

      // 2. Deal to Opponents
      if (config.opp) {
        state.currentMatch.opponents.forEach((opp, idx) => {
          const needs = getRequiredCount(opp.currentHand.length);
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
        });
      }

      // 3. Deal to Hero
      if (config.hero) {
        const needs = getRequiredCount(state.currentMatch.herosHand.length);
        for (let i = 0; i < needs; i++) {
          const heroCard = state.currentMatch.deck.pop(); // variable is heroCard
          if (heroCard) {
            state.currentMatch.herosHand.push({
              ...heroCard, // Use heroCard here!
              side: config.hero!,
              currentLocation: "p1",
            });
          }
        }
      }

      // 4. Deal to Community (For future games like Hold'em)
      if (config.community && typeof config.cards === "number") {
        for (let i = 0; i < config.cards; i++) {
          const card = state.currentMatch.deck.pop();
          if (card) {
            // Assuming you add a communityCards array to your state later
            // state.currentMatch.communityCards.push({ ...card, side: config.community });
          }
        }
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
} = gameSlice.actions;
export default gameSlice.reducer;
