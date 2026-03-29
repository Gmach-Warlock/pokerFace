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
  MatchType,
} from "../../app/types";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import {
  matchMap,
  gamePhases,
  GamePhaseMap,
  startingChips,
} from "../../app/assets";
import {
  pickAnteAmount,
  getNextActivePlayerIndex,
} from "../../functions/utils/utils";
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
    matchType: MatchType;
    numberOfDecks: DeckNumberType;
    opponents: PlayerInterface[];
    hero: PlayerInterface;
    players: PlayerInterface[];
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
    handHistory?: {
      playerId: string;
      finalHandName: string;
      wasBluff: boolean;
    }[];
    rewards?: {
      xp: number;
      plei: number;
      bonuses: string[];
      isFirstMatch?: boolean;
      isFirstWin?: boolean;
      isLevelUp?: boolean;
    };
  };
  isMatchStarted: boolean;
}
export interface GamePayloadInterface {
  numberOfOpponents: NumberOfOpponentsType;
  levelOfDifficulty: DifficultyType;
  matchLocation: MatchLocationType;
  matchType: MatchType;
  numberOfDecks: DeckNumberType;
  deckStyle: DeckStyleType;
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
    matchType: "draw",
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
      currentBet: 0,
      hasActed: false,
      isAllin: false,
    },
    players: [],
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
      const match = state.currentMatch;
      const phases: GamePhaseType[] = [
        "bettingOne",
        "draw",
        "bettingTwo",
        "showdown",
      ];
      const currentIdx = phases.indexOf(match.currentPhase.phase);

      if (currentIdx < phases.length - 1) {
        // 1. Move to the next string in our phase array
        match.currentPhase.phase = phases[currentIdx + 1];

        // 2. CRITICAL: Reset the table bet to 0 for the new round
        match.currentBet = 0;

        // 3. CRITICAL: Reset EVERY player so the middleware knows the round is "Fresh"
        match.players.forEach((player) => {
          player.hasActed = false; // This prevents the immediate skip
          player.currentBet = 0; // Resets individual bets to match the table 0
        });

        // 4. Reset the turn to the Hero (or whoever starts the next round)
        match.activePlayerIndex = 0;
      }
    },
    checkAndRefillDeck: (state) => {
      const { deck, numberOfDecks, deckStyle } = state.currentMatch;
      const threshold = 15;
      if (deck.length < threshold) {
        const freshCards = generateDeck(numberOfDecks, deckStyle);
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
    completeDrawPhase: (state) => {
      const match = state.currentMatch;
      match.currentPhase.phase = "bettingTwo";

      match.activePlayerIndex = 1;

      match.players.forEach((p, idx) => {
        p.hasActed = idx === 0;
        p.currentBet = 0;
      });
    },
    dealRound: (state) => {
      const match = state.currentMatch;
      const { type, phase } = match.currentPhase;
      const typedMap = GamePhaseMap as GamePhaseConfigType;
      const config = typedMap[type]?.[phase];

      // 1. Exit early if no cards are meant to be dealt in this phase
      if (!config || config.cards === 0) return;

      // 2. Iterate through the unified players array
      match.players.forEach((player, idx) => {
        // Skip players who have folded
        if (player.isFolded) return;

        // A. Handle Discards for the 'draw' phase
        if (phase === "draw") {
          player.currentHand = player.currentHand.filter(
            (card) => !card.isDiscarded,
          );
        }

        // B. Calculate how many cards this specific player needs
        const cardsNeeded =
          config.cards === "variable" || phase === "draw"
            ? 5 - player.currentHand.length
            : (config.cards as number);

        // C. Determine the card side (hero vs opp) from config
        const side = player.type === "human" ? config.hero : config.opp;
        if (!side) return; // If config doesn't specify cards for this player type, skip

        // D. Push the cards
        for (let i = 0; i < cardsNeeded; i++) {
          const card = match.deck.pop();
          if (card) {
            player.currentHand.push({
              ...card,
              side: side,
              currentLocation: `p${idx + 1}` as CurrentLocationType,
              isDiscarded: false,
            });
          }
        }
      });
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
    handlePlayerBroke: (
      state,
      action: PayloadAction<{ playerId: string; method: "plei" | "daily" }>,
    ) => {
      const { playerId, method } = action.payload;
      const player = state.currentMatch.players.find((p) => p.id === playerId);

      if (!player) return;

      if (method === "plei" && (player.plei ?? 0) >= 10) {
        player.plei! -= 10; // Cost of a buy-in
        player.money += 500; // Fresh chips
      }

      if (method === "daily") {
        player.money = 100;
      }
    },
    performAnteUp: (
      state,
      action: PayloadAction<{ location: MatchLocationType }>,
    ) => {
      const { location } = action.payload;
      const match = state.currentMatch;
      const amount = pickAnteAmount(location);

      match.players.forEach((player) => {
        player.money -= amount;
        match.pot += amount;
      });
    },
    playerRaise: (
      state,
      action: PayloadAction<{ playerId: string; amount: number }>,
    ) => {
      const { playerId, amount } = action.payload;
      const match = state.currentMatch;

      const player =
        playerId === match.hero.id
          ? match.hero
          : match.opponents.find((p) => p.id === playerId);

      if (player && player.money >= amount) {
        player.currentBet += amount;
        player.money -= amount;
        player.hasActed = true;
        player.lastAction = "raise";
        if (player.money === 0) player.isAllin = true;

        match.pot += amount;

        if (playerId === match.hero.id) {
          match.opponents.forEach((opp) => {
            if (!opp.isFolded && !opp.isAllin) opp.hasActed = false;
          });
        } else {
          match.hero.hasActed = false;
          match.opponents.forEach((opp) => {
            if (opp.id !== playerId && !opp.isFolded && !opp.isAllin) {
              opp.hasActed = false;
            }
          });
        }
      }
    },
    prepareNextHand: (state) => {
      const match = state.currentMatch;

      match.pot = 0;
      match.currentBet = 0;
      match.lastRaiserId = null;
      match.activePlayerIndex = 0;
      delete match.winnerId;
      delete match.winningHand;

      match.players.forEach((player) => {
        player.currentHand = [];
        player.isFolded = false;
        player.isAllin = false;
        player.currentBet = 0;
        player.hasActed = false;
      });

      const gameType = match.currentPhase.type;
      const phaseSequence = Object.keys(
        gamePhases[gameType],
      ) as GamePhaseType[];
      match.currentPhase.phase = phaseSequence[0];
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

      const player = match.players.find((p) => p.id === playerId);

      if (!player) return;

      player.hasActed = true;

      if (type === "fold") {
        player.isFolded = true;
      } else {
        player.money -= amount;
        player.currentBet += amount;
        match.pot += amount;

        if (type === "raise") {
          match.currentBet = player.currentBet;
          match.lastRaiserId = playerId;

          match.players.forEach((p) => {
            if (p.id !== playerId && !p.isFolded && !p.isAllin) {
              p.hasActed = false;
            }
          });
        }
      }

      match.activePlayerIndex = getNextActivePlayerIndex(match);
    },
    quitPlaying: (state) => {
      state.isPlaying = false;
    },
    resetGame: () => {
      return initialGameState;
    },
    resolveShowdown: (state) => {
      const match = state.currentMatch;

      const activePlayers = match.players.filter((p) => !p.isFolded);

      if (activePlayers.length === 0) return; // Edge case: everyone folded?

      const results = activePlayers.map((player) => {
        const evaluation = evaluatePokerHand(player.currentHand);
        return {
          id: player.id,
          name: player.name,
          rankValue: evaluation.value,
          handName: evaluation.label,
        };
      });

      const winnerResult = results.reduce((prev, current) =>
        prev.rankValue > current.rankValue ? prev : current,
      );

      const winningPlayer = match.players.find((p) => p.id === winnerResult.id);

      if (winningPlayer) {
        winningPlayer.money += match.pot;

        match.winnerId = winningPlayer.id ?? "";
        match.winningHand = winnerResult.handName;

        console.log(
          `${winningPlayer.name} wins $${match.pot} with ${winnerResult.handName}!`,
        );
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
        deckStyle,
      } = action.payload;

      state.isPlaying = true;
      state.currentlyDisplayed = "match";

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

      state.currentMatch.hero = { ...state.currentMatch.hero, ...hero };
      state.currentMatch.opponents = newOpponents;

      state.currentMatch.players = [state.currentMatch.hero, ...newOpponents];
      state.currentMatch.deckStyle = deckStyle;
      state.currentMatch.matchLocation = matchLocation;
      state.currentMatch.deck = shuffleDeck(
        generateDeck(numberOfDecks, deckStyle),
      );
      const gameType = state.currentMatch.currentPhase.type;
      const phaseSequence = Object.keys(
        gamePhases[gameType],
      ) as GamePhaseType[];
      state.currentMatch.currentPhase.phase = phaseSequence[0];
      state.currentMatch.difficultyLevel = levelOfDifficulty;
    },
    startPlaying: (state) => {
      state.isPlaying = true;
    },
    subtractOpponentMoney: (
      state,
      action: PayloadAction<{ opponentIndex: number; amount: number }>,
    ) => {
      const opponent = state.currentMatch.players[action.payload.opponentIndex];
      if (opponent) {
        opponent.money -= action.payload.amount;
      }
    },
    toggleDiscard: (state, action: PayloadAction<number>) => {
      const cardIndex = action.payload;

      const hero = state.currentMatch.players.find((p) => p.type === "human");

      if (hero && hero.currentHand[cardIndex]) {
        hero.currentHand[cardIndex].isDiscarded =
          !hero.currentHand[cardIndex].isDiscarded;
      }
    },
  },
});

export const {
  addToPot,
  advancePhase,
  checkAndRefillDeck,
  completeDrawPhase,
  dealCard,
  dealRound,
  finishMatch,
  goToMainMenu,
  goToPreGame,
  goToSettings,
  handlePlayerBroke,
  performAnteUp,
  playerRaise,
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
