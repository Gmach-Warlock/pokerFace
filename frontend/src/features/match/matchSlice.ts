import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  MatchLocationType,
  GamePhaseType,
  GamePhaseConfigType,
} from "../../app/types/matchTypes";
import type {
  CurrentLocationType,
  CardSideType,
  BettingActionType,
} from "../../app/types/matchTypes";
import type { GamePayloadInterface } from "../../app/interfaces/gameInterfaces";
import type {
  MatchInterface,
  PlayerInterface,
  SessionStatsInterface,
} from "../../app/interfaces/matchInterfaces";
import { generateDeck, shuffleDeck } from "../../functions/factory/factory";
import { createVillain } from "../../functions/factory/factory";
import {
  matchMap,
  matchPhases,
  matchPhaseMap,
  startingChips,
} from "../../app/assets/matchAssets";
import {
  pickAnteAmount,
  getNextActivePlayerIndex,
  evaluatePokerHand,
} from "../../app/logic/gameLogic";

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
          player.currentMatch.hasActed = false;
          player.currentMatch.currentBet = 0;
        });

        match.activePlayerIndex = 0;

        if (match.players[0].currentMatch.isFolded) {
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
        p.currentMatch.hasActed = false;
        p.currentMatch.currentBet = 0;
      });

      match.activePlayerIndex = match.players[0].currentMatch.isFolded
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
        state.players[0].currentMatch.currentHand.push(dealtCard);
      } else if (target === "dealer") {
        dealtCard.currentLocation = "dealer";
        state.dealersHand.push(dealtCard);
      } else if (target === "opponent" && typeof index === "number") {
        const opponent = state.players[index];
        if (opponent) {
          if (!opponent.currentMatch.currentHand)
            opponent.currentMatch.currentHand = [];
          dealtCard.currentLocation = `p${index + 1}` as CurrentLocationType;
          opponent.currentMatch.currentHand.push(dealtCard);
        }
      }
    },
    dealRound: (state) => {
      const match = state;
      const { type, phase } = match.currentPhase;
      const typedMap = matchPhaseMap as GamePhaseConfigType;
      const config = typedMap[type]?.[phase];

      if (!config || config.cards === 0) return;

      match.players.forEach((player, idx) => {
        if (player.currentMatch.isFolded) return;

        if (phase === "draw") {
          const discardCount = player.currentMatch.currentHand.filter(
            (card) => card.isDiscarded,
          ).length;

          match.actionMessage =
            discardCount === 0
              ? `${player.name} stands pat.`
              : `${player.name} drew ${discardCount} cards.`;

          player.currentMatch.currentHand =
            player.currentMatch.currentHand.filter((card) => !card.isDiscarded);
        }

        const cardsNeeded =
          config.cards === "variable" || phase === "draw"
            ? 5 - player.currentMatch.currentHand.length
            : (config.cards as number);

        const side = player.type === "human" ? config.hero : config.opp;
        if (!side) return;

        for (let i = 0; i < cardsNeeded; i++) {
          const card = match.deck.pop();
          if (card) {
            player.currentMatch.currentHand.push({
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
        player.currentMatch.isFolded = true;
        player.currentMatch.hasActed = true;
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

      if (player && player.currentMatch.currentHand) {
        cardIndices.forEach((index) => {
          if (player.currentMatch.currentHand[index]) {
            player.currentMatch.currentHand[index].isDiscarded = true;
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
        player.currentMatch.currentBet += amount;
        player.money -= amount;
        player.currentMatch.hasActed = true;
        player.currentMatch.lastAction = "raise";
        if (player.money === 0) player.currentMatch.isAllin = true;
        match.pot += amount;

        // Reset hasActed for everyone ELSE
        match.players.forEach((p) => {
          if (
            p.id !== playerId &&
            !p.currentMatch.isFolded &&
            !p.currentMatch.isAllin
          ) {
            p.currentMatch.hasActed = false;
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
        player.currentMatch.currentHand = [];
        player.currentMatch.isFolded = false;
        player.currentMatch.isAllin = false;
        player.currentMatch.currentBet = 0;
        player.currentMatch.hasActed = false;
      });

      const gameType = match.currentPhase.type;
      const phaseSequence = Object.keys(
        matchPhases[gameType],
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
      player.currentMatch.hasActed = true;
      player.currentMatch.lastAction = type; // Keep track of what they did for the UI

      if (type === "fold") {
        match.actionMessage = `${player.name} folds!`;
        player.currentMatch.isFolded = true;
      } else {
        // 2. Safety check: ensure they don't go negative
        const actualAmount = Math.min(player.money, amount);

        player.money -= actualAmount;
        player.currentMatch.currentBet += actualAmount;
        match.pot += actualAmount;

        // 3. Handle All-In status
        if (player.money === 0 && actualAmount > 0) {
          match.actionMessage = `${player.name} is all in!`;
          player.currentMatch.isAllin = true;
        }

        // 4. Update Table State for Raises
        if (type === "raise") {
          match.actionMessage = `${player.name} raise to ${match.currentBetOnTable}`;
          match.currentBetOnTable = player.currentMatch.currentBet;
          match.lastRaiserId = playerId;

          // IMPORTANT: Reset everyone else so they have to respond to the raise
          match.players.forEach((p) => {
            if (
              p.id !== playerId &&
              !p.currentMatch.isFolded &&
              !p.currentMatch.isAllin
            ) {
              p.currentMatch.hasActed = false;
            }
          });
        }
      }

      // 5. Check for "Last Man Standing" (Everyone else folded)
      const activePlayers = match.players.filter(
        (p) => !p.currentMatch.isFolded,
      );
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

      const activePlayers = match.players.filter(
        (p) => !p.currentMatch.isFolded,
      );

      if (activePlayers.length === 0) return; // Edge case: everyone folded?

      const results = activePlayers.map((player) => {
        const evaluation = evaluatePokerHand(player.currentMatch.currentHand);
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
          newOpponents.push({
            ...candidate,
            // Ensure villain also has the nested match object initialized
            currentMatch: {
              currentHand: [],
              isFolded: false,
              isAllin: false,
              currentBet: 0,
              hasActed: false,
              chips: startingChips, // Assuming villains need chips too
              sessionStats: {} as SessionStatsInterface,
            },
          });
          usedNames.add(candidate.name);
        }
      }

      state.players = [
        {
          ...hero,
          // FIX: Move flat properties into the currentMatch nest
          currentMatch: {
            currentHand: [],
            currentBet: 0,
            hasActed: false,
            isFolded: false,
            isAllin: false,
            chips: startingChips,
            sessionStats: {} as SessionStatsInterface,
          },
        },
        ...newOpponents,
      ];

      state.deck = shuffleDeck(generateDeck(numberOfDecks, deckStyle));
      state.matchLocation = matchLocation;
      state.deckStyle = deckStyle;
      state.difficultyLevel = levelOfDifficulty;

      const gameType = state.currentPhase.type;
      state.currentPhase.phase = (
        Object.keys(matchPhases[gameType]) as GamePhaseType[]
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

      if (hero && hero.currentMatch.currentHand[cardIndex]) {
        hero.currentMatch.currentHand[cardIndex].isDiscarded =
          !hero.currentMatch.currentHand[cardIndex].isDiscarded;
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
