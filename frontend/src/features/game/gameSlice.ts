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
  BettingActionType,
} from "../../app/types";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import {
  matchMap,
  gamePhases,
  GamePhaseMap,
  startingChips,
} from "../../app/assets";
import { handleFoldLogic, pickAnteAmount } from "../../functions/utils/utils";
import { evaluatePokerHand } from "../../functions/utils/utils";

export interface GameInterface {
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
    hero: PlayerInterface;
    dealersHand: CardInterface[];
    deck: CardInterface[];
    pot: number;
    currentBet: number;
    lastRaiserId: string | null;
    activePlayerIndex: number;
    currentPhase: GamePhaseInterface;
    winnerId?: string;
    winningHand?: string;
    isGameOver?: boolean;
  };
  isMatchStarted: boolean;
}
export interface GamePayloadInterface {
  numberOfOpponents: NumberOfOpponentsType;
  levelOfDifficulty: DifficultyType;
  matchLocation: MatchLocationType;
  numberOfDecks: DeckNumberType;
  hero: PlayerInterface;
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
    hero: {
      id: "abcd123",
      name: "Gary",
      type: "human",
      currentHand: [],
      isFolded: false,
      money: 500,
      chips: startingChips,
    },

    dealersHand: [],
    deck: [],
    pot: 0,
    currentBet: 0,
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
      if (!card) return;
      const dealtCard = { ...card, side };
      if (target === "hero") {
        dealtCard.currentLocation = "p1";
        state.currentMatch.hero.currentHand.push(dealtCard);
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
      if (config.hero) {
        if (phase === "draw") {
          state.currentMatch.hero.currentHand =
            state.currentMatch.hero.currentHand.filter(
              (card) => !card.isDiscarded,
            );
          const needs = 5 - state.currentMatch.hero.currentHand.length;
          for (let i = 0; i < needs; i++) {
            const card = state.currentMatch.deck.pop();
            if (card) {
              state.currentMatch.hero.currentHand.push({
                ...card,
                side: config.hero,
                currentLocation: "p1",
                isDiscarded: false,
              });
            }
          }
        } else {
          const needs =
            config.cards === "variable"
              ? 5 - state.currentMatch.hero.currentHand.length
              : (config.cards as number);
          for (let i = 0; i < needs; i++) {
            const card = state.currentMatch.deck.pop();
            if (card) {
              state.currentMatch.hero.currentHand.push({
                ...card,
                side: config.hero,
                currentLocation: "p1",
                isDiscarded: false,
              });
            }
          }
        }
      }
      if (config.opp) {
        state.currentMatch.opponents.forEach((opp, idx) => {
          if (phase === "draw") {
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
    performAnteUp: (
      state,
      action: PayloadAction<{ location: MatchLocationType }>,
    ) => {
      const { location } = action.payload;
      const match = state.currentMatch;
      const amount = pickAnteAmount(location);

      match.hero.money -= amount;
      match.pot += amount;

      match.opponents.forEach((opp) => {
        opp.money -= amount;
        match.pot += amount;
      });
    },
    prepareNextHand: (state) => {
      const match = state.currentMatch;

      delete match.winnerId;
      delete match.winningHand;

      match.pot = 0;
      match.hero.currentHand = [];
      match.opponents.forEach((opp) => {
        opp.currentHand = [];
        opp.isFolded = false;
      });
    },
    processBet: (
      state,
      action: PayloadAction<{
        playerId: string;
        amount: number;
        type: BettingActionType;
      }>,
    ) => {
      const { playerId, amount, type } = action.payload;
      const match = state.currentMatch;

      if (type === "fold") {
        handleFoldLogic(state, playerId);
      }
      if (type === "call" || type === "raise") {
        if (playerId === state.currentMatch.hero.id) {
          match.hero.money -= amount;
        } else {
          const opponent = match.opponents.find((o) => o.id === playerId);
          if (opponent) {
            opponent.money -= amount;
          }
        }
        match.pot += amount;
        if (type === "raise") {
          match.currentBet = amount;
          match.lastRaiserId = playerId;
        }
      }
      match.activePlayerIndex =
        (match.activePlayerIndex + 1) % (match.opponents.length + 1);
    },
    quitPlaying: (state) => {
      state.isPlaying = false;
    },
    resetGame: () => {
      return initialGameState;
    },
    resolveShowdown: (state) => {
      const match = state.currentMatch;
      const heroResult = evaluatePokerHand(match.hero.currentHand);
      const results = match.opponents
        .filter((opp) => !opp.isFolded)
        .map((opp) => ({
          id: opp.id,
          name: opp.name,
          rankValue: evaluatePokerHand(opp.currentHand).value, // Assuming handRanks has a .value (0-10)
          handName: evaluatePokerHand(opp.currentHand).label,
        }));
      results.push({
        id: match.hero.id,
        name: "Hero",
        rankValue: heroResult.value,
        handName: heroResult.label,
      });
      const winner = results.reduce((prev, current) =>
        prev.rankValue > current.rankValue ? prev : current,
      );
      if (winner.id === match.hero.id) {
        match.hero.money += match.pot;
        console.log(`Hero wins ${match.pot} with a ${winner.handName}!`);
      } else {
        const winningOpp = match.opponents.find((o) => o.id === winner.id);
        if (winningOpp) {
          winningOpp.money += match.pot;
          console.log(
            `${winningOpp.name} wins ${match.pot} with a ${winner.handName}!`,
          );
        }
      }
      match.pot = 0;
    },
    startMatch: (state, action: PayloadAction<GamePayloadInterface>) => {
      const {
        numberOfOpponents,
        levelOfDifficulty,
        matchLocation,
        numberOfDecks,
        hero,
      } = action.payload;

      state.isPlaying = true;
      state.currentlyDisplayed = "match";
      state.currentMatch.numberOfDecks = numberOfDecks;
      state.currentMatch.numberOfOpponents = numberOfOpponents;
      state.currentMatch.difficultyLevel = levelOfDifficulty;
      state.currentMatch.matchLocation = matchLocation;
      state.currentMatch.hero.id = hero.id;
      state.currentMatch.hero.money = hero.money;
      state.currentMatch.hero.chips = hero.chips;

      state.currentMatch.deck = shuffleDeck(generateDeck(numberOfDecks));

      const count =
        numberOfOpponents === "tbd" ? 1 : (numberOfOpponents as number);
      const availableThemes = matchMap[matchLocation] || ["classic"];
      const selectedTheme =
        availableThemes[Math.floor(Math.random() * availableThemes.length)];

      const newOpponents: PlayerInterface[] = [];
      const usedNames = new Set<string>();

      while (newOpponents.length < count) {
        const candidate = createVillain(selectedTheme);

        if (!usedNames.has(candidate.name)) {
          newOpponents.push(candidate);
          usedNames.add(candidate.name);
        }
      }

      state.currentMatch.opponents = newOpponents;

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

      const card = state.currentMatch.hero.currentHand[cardIndex];

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
  performAnteUp,
  prepareNextHand,
  processBet,
  quitPlaying,
  resetGame,
  resolveShowdown,
  startMatch,
  startPlaying,
  subtractOpponentMoney,
  toggleDiscard,
} = gameSlice.actions;
export default gameSlice.reducer;
