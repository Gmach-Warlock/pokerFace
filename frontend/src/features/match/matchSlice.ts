import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  GamePhaseType,
  GamePhaseConfigType,
} from "../../app/types/matchTypes";
import type { MatchLocationType } from "../../app/types/worldMapTypes";
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
  matchPhaseMap,
  startingChips,
  gamePhaseSequences,
} from "../../app/assets/matchAssets";
import {
  calculateCardsNeeded,
  pickAnteAmount,
  getNextActivePlayerIndex,
  evaluatePokerHand,
} from "../../app/logic/matchLogic";
import { generateRandomString } from "../../functions/utils/utils";

const initialMatchState: MatchInterface = {
  id: generateRandomString(10),
  numberOfOpponents: null,
  deckStyle: "arrowBolt",
  difficultyLevel: "normal",
  matchLocation: "shelter",
  matchType: "draw",
  numberOfDecks: 1,
  players: [],
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
  variantData: {
    discardLimit: 3,
    maxDiscardsPerPlayer: 5,
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState: initialMatchState,
  reducers: {
    addToPot: (state, action: PayloadAction<number>) => {
      state.pot += action.payload;
    },
    advancePhase: (state) => {
      const { type, phase } = state.currentPhase;
      const sequence = gamePhaseSequences[type];
      if (!sequence) {
        console.error(`No sequence found for match type: ${type}`);
        return;
      }

      const currentIdx = sequence.indexOf(phase);

      if (currentIdx < sequence.length - 1) {
        const nextPhase = sequence[currentIdx + 1];
        state.currentPhase.phase = nextPhase;

        state.currentBetOnTable = 0;
        state.lastRaiserId = null;
        state.players.forEach((p) => {
          p.currentMatch.hasActed = false;
          p.currentMatch.currentBet = 0;
        });

        state.activePlayerIndex = state.players[0].currentMatch.isFolded
          ? getNextActivePlayerIndex(state)
          : 0;

        state.actionMessage = `Phase: ${nextPhase.toUpperCase()}`;
        state.messageId += 1;
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
      // 1. Cast to the Union type to unlock all variant 'pipes'
      const match = state as MatchInterface;
      const { currentPhase } = match;
      const { type, phase } = currentPhase;
      const matchType = match.matchType as string;

      const config = (matchPhaseMap as GamePhaseConfigType)[type]?.[phase];

      if (!config) {
        console.error(`Missing config for ${type} phase: ${phase}`);
        return;
      }

      // --- 1. BOARD / COMMUNITY DEALING (Hold'em & Stud) ---
      if (config.target === "board") {
        // Because we're in the 'holdem' pipe, communityCards is now visible
        if (match.matchType === "holdem") {
          const cardsToDeal = config.cards as number;
          for (let i = 0; i < cardsToDeal; i++) {
            const card = match.deck.pop();
            if (card) {
              match.variantData.communityCards.push({
                ...card,
                side: "face-up",
                currentLocation: "board",
                isDiscarded: false,
              });
            }
          }
        }
        // Future Note: Add Stud board logic here if Stud uses common cards
        return;
      }

      // --- 2. PLAYER DEALING (Draw, Hold'em Hole, & Stud Streets) ---
      match.players.forEach((player, idx) => {
        if (player.currentMatch.isFolded) return;

        // Standard Draw Discard Cleanup
        player.currentMatch.currentHand =
          player.currentMatch.currentHand.filter((card) => !card.isDiscarded);

        const cardsNeeded = calculateCardsNeeded(
          type,
          phase,
          player.currentMatch.currentHand.length,
        );

        for (let i = 0; i < cardsNeeded; i++) {
          const card = match.deck.pop();
          if (card) {
            // Logic for determining side (Face-up vs Face-down)
            let finalSide = config.side;

            if (player.type === "human") {
              finalSide = "face-up"; // Gary always sees his own cards
            } else if (matchType === "stud") {
              // Stud specific: some NPC cards are face-up, some are face-down
              // This uses the phase config to decide (e.g. 3rd street is up)
              finalSide = config.side;
            }

            player.currentMatch.currentHand.push({
              ...card,
              side: finalSide,
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
        player.currentMatch.lastAction = "fold";

        match.actionMessage = `${player.name} folds`;
        match.messageId += 1;

        // 1. Check for "Last Man Standing"
        const activePlayers = match.players.filter(
          (p) => !p.currentMatch.isFolded,
        );

        if (activePlayers.length === 1) {
          const winner = activePlayers[0];
          winner.money += match.pot;
          match.winnerId = winner.id ?? "";
          match.pot = 0;
          match.currentPhase.phase = "showdown";
          return;
        }

        // 2. Check if the betting round is actually over
        // If everyone left has acted and bets are even (which they are on a fold)
        const roundOver = activePlayers.every((p) => p.currentMatch.hasActed);

        if (roundOver) {
          // Use your existing advancePhase logic internally or call a helper
          // This forces the game to move to 'draw' or 'bettingTwo'
          const { type, phase } = match.currentPhase;
          const sequence = gamePhaseSequences[type];
          const currentIdx = sequence.indexOf(phase);

          if (currentIdx < sequence.length - 1) {
            const nextPhase = sequence[currentIdx + 1];
            match.currentPhase.phase = nextPhase;

            // Reset for the new phase
            match.currentBetOnTable = 0;
            match.lastRaiserId = null;
            match.players.forEach((p) => {
              p.currentMatch.hasActed = false;
              p.currentMatch.currentBet = 0;
            });

            // Start the turn on the first non-folded player
            match.activePlayerIndex = getNextActivePlayerIndex(match);
            match.actionMessage = `Phase: ${nextPhase.toUpperCase()}`;
          }
        } else {
          // If round isn't over, just move to the next NPC
          match.activePlayerIndex = getNextActivePlayerIndex(match);
        }
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
        matchPhaseMap[gameType],
      ) as GamePhaseType[];
      match.currentPhase.phase = phaseSequence[1];
      match.actionMessage = "New Hand Started";
      match.messageId += 1;
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

      // 1. Update Player State
      player.currentMatch.hasActed = true;
      player.currentMatch.lastAction = type;

      if (type === "fold") {
        player.currentMatch.isFolded = true;
      } else {
        // Handle Money Movement
        const actualAmount = Math.min(player.money, amount);
        player.money -= actualAmount;
        player.currentMatch.currentBet += actualAmount;
        match.pot += actualAmount;

        if (player.money === 0 && actualAmount > 0) {
          player.currentMatch.isAllin = true;
        }

        // 2. LOGIC FIX: Update Table Bet on Raise
        if (type === "raise") {
          match.currentBetOnTable = player.currentMatch.currentBet;
          match.lastRaiserId = playerId;

          // Reset everyone else so they have to respond to the new price
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

        // 3. LOGIC FIX: If calling a bet that was already on the table
        if (
          type === "call" &&
          player.currentMatch.currentBet > match.currentBetOnTable
        ) {
          match.currentBetOnTable = player.currentMatch.currentBet;
        }
      }

      // 4. Construct Message
      let finalMessage = "";
      if (player.currentMatch.isFolded) {
        finalMessage = `${player.name} folds`;
      } else if (player.currentMatch.isAllin) {
        finalMessage = `${player.name} is ALL IN!`;
      } else if (type === "raise") {
        finalMessage = `${player.name} raises to $${match.currentBetOnTable}`;
      } else if (type === "call") {
        finalMessage = `${player.name} calls $${amount}`;
      } else {
        finalMessage = `${player.name} checks`;
      }

      state.actionMessage = finalMessage;
      state.messageId += 1;

      // 5. Check for "Last Man Standing"
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
        match.currentPhase.phase = "showdown";
        return;
      }

      // 6. Advance the turn pointer
      // If everyone has acted and bets are equal, the Thunk will see this
      // state change and trigger advancePhase automatically.
      match.activePlayerIndex = getNextActivePlayerIndex(match);
    },
    quitMatch: (state) => {
      state.numberOfOpponents = 1;
      state.players = [];
      state.pot = 0;
      state.playingMatch = false;
    },
    resetGame: () => {
      return initialMatchState;
    },
    resolveShowdown: (state) => {
      const match = state;

      const activePlayers = match.players.filter(
        (p) => !p.currentMatch.isFolded,
      );

      // Edge case: if somehow everyone folded, the last person to fold should have
      // been caught by your 'Last Man Standing' logic in the foldHand reducer.
      if (activePlayers.length === 0) return;

      const results = activePlayers.map((player) => {
        const evaluation = evaluatePokerHand(player.currentMatch.currentHand);
        return {
          id: player.id,
          name: player.name,
          // 1. Updated from .value to .rankValue
          rankValue: evaluation.rankValue,
          handName: evaluation.label,
        };
      });

      // 2. The comparison now works perfectly with the 0-900 scale
      const winnerResult = results.reduce((prev, current) =>
        prev.rankValue > current.rankValue ? prev : current,
      );

      const winningPlayer = match.players.find((p) => p.id === winnerResult.id);

      if (winningPlayer) {
        winningPlayer.money += match.pot;

        match.winnerId = winningPlayer.id ?? "";
        match.winningHand = winnerResult.handName;
        match.lastWinAmount = match.pot;

        // Feedback for the dev console
        console.log(
          `${winningPlayer.name} wins $${match.pot} with ${winnerResult.handName}!`,
        );
      }

      // Reset the pot for the next hand
      match.pot = 0;
    },
    startMatch: (state, action: PayloadAction<GamePayloadInterface>) => {
      const {
        numberOfOpponents,
        matchLocation,
        numberOfDecks,
        hero,
        deckStyle,
        difficultyLevel,
      } = action.payload;

      state.playingMatch = true;

      const count =
        numberOfOpponents === null ? 1 : (numberOfOpponents as number);
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
            currentMatch: {
              currentHand: [],
              isFolded: false,
              isAllin: false,
              currentBet: 0,
              hasActed: false,
              chips: startingChips,
              sessionStats: {} as SessionStatsInterface,
            },
          });
          usedNames.add(candidate.name);
        }
      }

      state.players = [
        {
          ...hero,
          id: hero.id || "hero-1",
          name: hero.name || "Gary",
          type: "human",
          money: hero.money || 500,
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
      state.difficultyLevel = difficultyLevel;

      const gameType = state.currentPhase.type;
      const phaseSequence = Object.keys(matchPhaseMap[gameType]);
      state.currentPhase.phase = phaseSequence[0] as GamePhaseType;
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
