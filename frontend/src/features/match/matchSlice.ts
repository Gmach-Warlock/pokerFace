import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  MatchLocationType,
  CurrentLocationType,
  CardSideType,
  GamePhaseType,
  GamePhaseConfigType,
  BettingActionType,
} from "../../app/types";
import type {
  GamePayloadInterface,
  MatchInterface,
  PlayerInterface,
} from "../../app/interfaces";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import { matchMap, gamePhases, GamePhaseMap } from "../../app/assets";
import {
  pickAnteAmount,
  getNextActivePlayerIndex,
  evaluatePokerHand,
} from "../../app/logic/logic";

const initialGameState: MatchInterface = {
  numberOfOpponents: "tbd",
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
  actionMessage: "",
  messageId: 0,
  activePlayerIndex: 0,
  currentPhase: {
    type: "draw",
    phase: "notInGameYet",
  },

  playingMatch: false,
};

const matchSlice = createSlice({
  name: "match",
  initialState: initialGameState,
  reducers: {
    addToPot: (state, action: PayloadAction<number>) => {
      state.pot += action.payload;
    },
    advancePhase: (state) => {
      const match = state;
      const phases: GamePhaseType[] = [
        "bettingOne",
        "draw",
        "bettingTwo",
        "showdown",
      ];
      const currentIdx = phases.indexOf(match.currentPhase.phase);

      if (currentIdx < phases.length - 1) {
        match.currentPhase.phase = phases[currentIdx + 1];

        match.currentBetOnTable = 0;
        match.lastRaiserId = null;

        match.players.forEach((player) => {
          player.hasActed = false;
          player.currentBet = 0;
        });

        match.activePlayerIndex = 0;

        if (match.players[0].isFolded) {
          match.activePlayerIndex = getNextActivePlayerIndex(match);
        }

        console.log(`Phase advanced to: ${match.currentPhase.phase}`);
      }
    },
    checkAndRefillDeck: (state) => {
      const { deck, numberOfDecks, deckStyle } = state;
      const threshold = 15;
      if (deck.length < threshold) {
        const freshCards = generateDeck(numberOfDecks, deckStyle);
        const shuffledCards = shuffleDeck(freshCards);
        state.deck = [...deck, ...shuffledCards];
      }
    },
    completeDrawPhase: (state) => {
      const match = state;

      match.currentPhase.phase = "bettingTwo";
      match.currentBetOnTable = 0;
      match.lastRaiserId = null;
      match.players.forEach((p) => {
        p.hasActed = false;
        p.currentBet = 0;
      });

      match.activePlayerIndex = match.players[0].isFolded
        ? getNextActivePlayerIndex(match)
        : 0;

      console.log("Draw complete. Starting Betting Round 2.");
    },
    dealCard: (
      state,
      action: PayloadAction<{
        target: "hero" | "dealer" | "opponent";
        index?: number;
        side: CardSideType;
      }>,
    ) => {
      const { deck } = state;
      const { target, index, side } = action.payload;
      const card = deck.pop();
      if (!card) return;
      const dealtCard = { ...card, side };
      if (target === "hero") {
        dealtCard.currentLocation = "p1";
        state.players[0].currentHand.push(dealtCard);
      } else if (target === "dealer") {
        dealtCard.currentLocation = "dealer";
        state.dealersHand.push(dealtCard);
      } else if (target === "opponent" && typeof index === "number") {
        const opponent = state.players[index];
        if (opponent) {
          if (!opponent.currentHand) opponent.currentHand = [];
          dealtCard.currentLocation = `p${index + 1}` as CurrentLocationType;
          opponent.currentHand.push(dealtCard);
        }
      }
    },
    dealRound: (state) => {
      const match = state;
      const { type, phase } = match.currentPhase;
      const typedMap = GamePhaseMap as GamePhaseConfigType;
      const config = typedMap[type]?.[phase];

      if (!config || config.cards === 0) return;

      match.players.forEach((player, idx) => {
        if (player.isFolded) return;

        if (phase === "draw") {
          const discardCount = player.currentHand.filter(
            (card) => card.isDiscarded,
          ).length;

          match.actionMessage =
            discardCount === 0
              ? `${player.name} stands pat.`
              : `${player.name} drew ${discardCount} cards.`;

          player.currentHand = player.currentHand.filter(
            (card) => !card.isDiscarded,
          );
        }

        const cardsNeeded =
          config.cards === "variable" || phase === "draw"
            ? 5 - player.currentHand.length
            : (config.cards as number);

        const side = player.type === "human" ? config.hero : config.opp;
        if (!side) return;

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
      state.playingMatch = false;
    },
    foldHand: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const match = state;
      const player = match.players.find((p) => p.id === playerId);

      if (player) {
        player.isFolded = true;
        player.hasActed = true;
        match.activePlayerIndex = getNextActivePlayerIndex(match);
      }
    },

    handlePlayerBroke: (
      state,
      action: PayloadAction<{ playerId: string; method: "plei" | "daily" }>,
    ) => {
      const { playerId, method } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      if (!player || !player.profile) return;

      if (method === "plei" && (player.profile.plei ?? 0) >= 10) {
        player.profile.plei! -= 10;
        player.money += 500;
      }

      if (method === "daily") {
        player.money = 100;
      }
    },
    markNpcDiscard: (
      state,
      action: PayloadAction<{ playerIndex: number; cardIndices: number[] }>,
    ) => {
      const { playerIndex, cardIndices } = action.payload;
      const player = state.players[playerIndex];

      if (player && player.currentHand) {
        cardIndices.forEach((index) => {
          if (player.currentHand[index]) {
            player.currentHand[index].isDiscarded = true;
          }
        });
      }
    },
    performAnteUp: (
      state,
      action: PayloadAction<{ location: MatchLocationType }>,
    ) => {
      const { location } = action.payload;
      const match = state;
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
      const match = state;
      const player = match.players.find((p) => p.id === playerId);

      if (player && player.money >= amount) {
        player.currentBet += amount;
        player.money -= amount;
        player.hasActed = true;
        player.lastAction = "raise";
        if (player.money === 0) player.isAllin = true;
        match.pot += amount;

        // Reset hasActed for everyone ELSE
        match.players.forEach((p) => {
          if (p.id !== playerId && !p.isFolded && !p.isAllin) {
            p.hasActed = false;
          }
        });
      }
    },
    prepareNextHand: (state) => {
      const match = state;
      match.lastWinAmount = 0;
      match.pot = 0;
      match.currentBetOnTable = 0;
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
      match.actionMessage = "";
      match.messageId = 0;
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
      const match = state;
      const player = match.players.find((p) => p.id === playerId);

      if (!player) return;

      // 1. Mark player as having acted
      player.hasActed = true;
      player.lastAction = type; // Keep track of what they did for the UI

      if (type === "fold") {
        match.actionMessage = `${player.name} folds!`;
        player.isFolded = true;
      } else {
        // 2. Safety check: ensure they don't go negative
        const actualAmount = Math.min(player.money, amount);

        player.money -= actualAmount;
        player.currentBet += actualAmount;
        match.pot += actualAmount;

        // 3. Handle All-In status
        if (player.money === 0 && actualAmount > 0) {
          match.actionMessage = `${player.name} is all in!`;
          player.isAllin = true;
        }

        // 4. Update Table State for Raises
        if (type === "raise") {
          match.actionMessage = `${player.name} raise to ${match.currentBetOnTable}`;
          match.currentBetOnTable = player.currentBet;
          match.lastRaiserId = playerId;

          // IMPORTANT: Reset everyone else so they have to respond to the raise
          match.players.forEach((p) => {
            if (p.id !== playerId && !p.isFolded && !p.isAllin) {
              p.hasActed = false;
            }
          });
        }
      }

      // 5. Check for "Last Man Standing" (Everyone else folded)
      const activePlayers = match.players.filter((p) => !p.isFolded);
      if (
        activePlayers.length === 1 &&
        match.currentPhase.phase !== "showdown"
      ) {
        const winner = activePlayers[0];
        winner.money += match.pot;
        match.winnerId = winner.id ?? "";
        match.pot = 0;
        match.currentPhase.phase = "showdown"; // Force end the round
        return;
      }

      // 6. Advance the turn pointer
      match.activePlayerIndex = getNextActivePlayerIndex(match);
    },
    quitMatch: (state) => {
      state.numberOfOpponents = 1;
      state.players = [];
      state.pot = 0;
      state.playingMatch = false;
    },
    resetGame: () => {
      return initialGameState;
    },
    resolveShowdown: (state) => {
      const match = state;

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
        match.lastWinAmount = match.pot;
        console.log(
          `${winningPlayer.name} wins $${match.pot} with ${winnerResult.handName}!`,
        );
      }

      match.pot = 0;
    },
    startMatch: (state, action: PayloadAction<GamePayloadInterface>) => {
      const {
        numberOfOpponents,
        matchLocation,
        numberOfDecks,
        hero,
        deckStyle,
        levelOfDifficulty,
      } = action.payload;

      state.playingMatch = true;

      const count =
        numberOfOpponents === "tbd" ? 1 : (numberOfOpponents as number);

      // FIX: Use 'as keyof typeof matchMap' to force TS to allow the indexing
      // Also added a fallback to ensure availableThemes is never undefined
      const availableThemes = matchMap[
        matchLocation as keyof typeof matchMap
      ] || ["classic"];

      const selectedTheme =
        availableThemes[Math.floor(Math.random() * availableThemes.length)];

      const newOpponents: PlayerInterface[] = [];
      const usedNames = new Set<string>();

      while (newOpponents.length < count) {
        const candidate = createVillain(selectedTheme);
        if (!usedNames.has(candidate.name)) {
          // Ensure we spread the candidate and initialize match-specific fields
          newOpponents.push({
            ...candidate,
            currentHand: [],
            currentBet: 0,
            hasActed: false,
            isFolded: false, // Adding safety initializers
            isAllin: false,
          });
          usedNames.add(candidate.name);
        }
      }

      state.players = [
        {
          ...hero,
          currentHand: [],
          currentBet: 0,
          hasActed: false,
          isFolded: false,
          isAllin: false,
        },
        ...newOpponents,
      ];

      state.deck = shuffleDeck(generateDeck(numberOfDecks, deckStyle));
      state.matchLocation = matchLocation;
      state.deckStyle = deckStyle;
      state.difficultyLevel = levelOfDifficulty;

      const gameType = state.currentPhase.type;
      state.currentPhase.phase = (
        Object.keys(gamePhases[gameType]) as GamePhaseType[]
      )[0];
    },

    subtractOpponentMoney: (
      state,
      action: PayloadAction<{ opponentIndex: number; amount: number }>,
    ) => {
      const opponent = state.players[action.payload.opponentIndex];
      if (opponent) {
        opponent.money -= action.payload.amount;
      }
    },
    toggleDiscard: (state, action: PayloadAction<number>) => {
      const cardIndex = action.payload;

      const hero = state.players.find((p) => p.type === "human");

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
  foldHand,
  handlePlayerBroke,
  markNpcDiscard,
  performAnteUp,
  playerRaise,
  prepareNextHand,
  processBet,
  quitMatch,
  resetGame,
  resolveShowdown,
  startMatch,
  subtractOpponentMoney,
  toggleDiscard,
} = matchSlice.actions;
export default matchSlice.reducer;
