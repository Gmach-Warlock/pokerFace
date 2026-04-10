import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 1. TYPES & INTERFACES
import type {
  MatchPhaseType,
  MatchPhaseConfigType,
  CurrentLocationType,
  CardSideType,
  BettingActionType,
} from "../../app/types/matchTypes";
import type { MatchLocationType } from "../../app/types/worldMapTypes";
import type { GamePayloadInterface } from "../../app/interfaces/gameInterfaces";
import type {
  MatchInterface,
  PlayerInterface,
} from "../../app/interfaces/matchInterfaces";

// 2. CORE LOGIC & UTILITIES
import {
  generateDeck,
  createVillain,
  createDealer,
} from "../../app/logic/factory/factoryFunctions";
import {
  checkLastManStanding,
  prepareNewPhase,
  shuffleDeck,
  pickAnteAmount,
} from "../../app/logic/match/utils/utils";
import {
  calculateCardsNeeded,
  evaluatePokerHand,
} from "../../app/logic/match/evaluators/evaluators";
import {
  getNextActivePlayerIndex,
  validateBetAction,
  resolveBetState,
} from "../../app/logic/betting/bettingUtils";
import { generateRandomString } from "../../app/logic/general/generalUtils";

// 3. ASSETS & MAPS
import {
  matchMap,
  matchPhaseMap,
  startingChips,
  gamePhaseSequences,
  INITIAL_DRAW_SPECIFICS,
  INITIAL_HOLDEM_SPECIFICS,
} from "../../app/assets/match/matchAssets";
import { INITIAL_SESSION_STATS } from "../../app/assets/profile/profileAssets";

const initialMatchState: MatchInterface = {
  general: {
    id: generateRandomString(10),
    numberOfOpponents: 1,
    deckStyle: "arrowBolt",
    difficultyLevel: "normal",
    matchLocation: "shelter",
    matchType: "draw",
    numberOfDecks: 1,
    playingMatch: false,
  },
  config: {
    rules: {
      ante: 1,
      minBet: 0,
      maxBet: 1000,
      blindStructure: "static",
      turnTimer: 1000,
    },
    limits: {
      maxPlayers: 5,
      minBuyIn: 1,
    },
  },
  variantSpecifics: {
    casinoVariantSpecifics: {
      dealersHand: [],
      houseEdge: 0,
      payoutMultiplier: 0,
      minDealerQualifyingRank: 1,
    },
    drawSpecifics: {
      discardLimit: 4,
      maxDiscardsPerPlayer: 4,
    },
    holdemSpecifics: {
      communityCards: [],
      burnCards: [],
      buttonIndex: 0,
      bigBlind: 0,
      smallBlind: 0,
    },
    noSpecifics: {
      isWaiting: true,
      lobbyMessage: "",
      readyPlayers: [],
    },
    studSpecifics: {
      upCards: [],
      downCards: [],
    },
  },
  currentHand: {
    players: [],
    handNumber: 1,
    dealerIndex: 2,
    deck: [],
    pot: 0,
    currentBetOnTable: 0,
    activePlayerIndex: 0,
    lastRaiserId: "",
    isRoundTransitioning: false,
    actionMessage: "",
    messageId: 0,
    currentPhase: {
      type: "draw",
      phase: "notInGameYet",
      step: 0,
    },
  },
  results: {
    winnerId: "",
    winningHand: "",
    lastWinAmount: 0,
    isGameOver: false,
  },
  visuals: {
    theme: "classic",
    skylineStatus: "active",
    tableColor: "green1",
    activeEffects: [],
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState: initialMatchState,
  reducers: {
    addToPot: (state, action: PayloadAction<number>) => {
      state.currentHand.pot += action.payload;
    },
    advancePhase: (state) => {
      const sequence = gamePhaseSequences[state.currentHand.currentPhase.type];
      const oldPhase = state.currentHand.currentPhase.phase; // Keep for the log
      console.log("ADVANCE ATTEMPT:", { oldPhase, sequence }); // Is this firing?
      if (!sequence) return;

      const currentIdx = sequence.indexOf(oldPhase);

      if (currentIdx < sequence.length - 1) {
        const nextPhase = sequence[currentIdx + 1];

        prepareNewPhase(state, nextPhase);

        // LOG THE ACTUAL STATE PROPERTY, NOT A LOCAL VARIABLE
        console.log(`--- PHASE SHIFT SUCCESSFUL ---`);
        console.log(
          `Moved from [${oldPhase}] to [${state.currentHand.currentPhase.phase}]`,
        );
        console.log(
          `Next Actor: ${state.currentHand.players[state.currentHand.activePlayerIndex]?.general.name}`,
        );
      }
      state.currentHand.players.forEach((p) => {
        p.state.hasActed = false; // Reset for the new round!
      });
      state.currentHand.isRoundTransitioning = false;
    },
    checkAndRefillDeck: (state) => {
      const { numberOfDecks, deckStyle } = state.general;
      const { deck } = state.currentHand;
      const threshold = 15;
      if (deck.length < threshold) {
        const freshCards = generateDeck(numberOfDecks, deckStyle);
        const shuffledCards = shuffleDeck(freshCards);
        state.currentHand.deck = [...deck, ...shuffledCards];
      }
    },
    // --- Fixed completeDrawPhase ---
    completeDrawPhase: (state) => {
      state.currentHand.currentPhase.phase = "bettingTwo";
      state.currentHand.currentBetOnTable = 0;
      state.currentHand.lastRaiserId = null;

      state.currentHand.players.forEach((p) => {
        p.state.hasActed = false;
        p.state.currentBet = 0;
        // reset lastAction for the new round
        p.state.lastAction = null;
      });

      // Check if player 0 is folded before setting them as active
      state.currentHand.activePlayerIndex = state.currentHand.players[0].state
        .isFolded
        ? getNextActivePlayerIndex(state.currentHand.players, 0)
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
      const { deck } = state.currentHand;
      const { target, index, side } = action.payload;
      const card = deck.pop();
      if (!card) return;
      const dealtCard = { ...card, side };
      if (target === "hero") {
        dealtCard.currentLocation = "p1";
        state.currentHand.players[0].state.hand.push(dealtCard);
      } else if (target === "opponent" && typeof index === "number") {
        const opponent = state.currentHand.players[index];
        if (opponent) {
          if (!opponent.state.hand) opponent.state.hand = [];
          dealtCard.currentLocation = `p${index + 1}` as CurrentLocationType;
          opponent.state.hand.push(dealtCard);
        }
      }
    },
    // matchSlice.ts -> dealRound reducer
    dealRound: (state) => {
      console.log("!!! REDUCER START: dealRound hit !!!"); // Is this at the absolute top?
      const { currentPhase, deck, players } = state.currentHand;
      const { matchType } = state.general;
      const { type, phase } = currentPhase;

      const config = (matchPhaseMap as MatchPhaseConfigType)[type]?.[phase];
      console.log(
        `[Deal Check] Phase: ${phase} | Target: ${config?.target} | Cards: ${config?.cards}`,
      );
      if (!config) {
        console.error(`[dealRound] Missing config for ${type} phase: ${phase}`);
        return;
      }

      // --- 1. BOARD / COMMUNITY DEALING ---
      if (config.target === "board") {
        if (matchType === "holdem" && state.variantSpecifics) {
          const cardsToDeal = config.cards as number;
          console.log(`[dealRound] Dealing ${cardsToDeal} to board.`);
          for (let i = 0; i < cardsToDeal; i++) {
            const card = deck.pop();
            if (card) {
              state.variantSpecifics.holdemSpecifics.communityCards.push({
                ...card,
                side: "face-up",
                currentLocation: "board",
                isDiscarded: false,
              });
            }
          }
        }
        return;
      }

      // --- 2. PLAYER DEALING ---
      players.forEach((player, idx) => {
        if (player.general.isDealer || player.state.isFolded) return;

        // Filter out discarded cards before calculating needs
        const prevHandCount = player.state.hand.length;
        player.state.hand = player.state.hand.filter(
          (card) => !card.isDiscarded,
        );
        const handCountAfterFilter = player.state.hand.length;

        const handBefore = player.state.hand.length;

        // Log the specific config we are using
        console.log(
          `[Reducer Deep Dive] ${player.general.name} | Phase: ${phase} | ConfigCards: ${config.cards}`,
        );

        const cardsNeeded = calculateCardsNeeded(type, phase, handBefore);

        console.log(
          `[dealRound] Player: ${player.general.name} | Hand size (prev/clean): ${prevHandCount}/${handCountAfterFilter} | Cards Needed: ${cardsNeeded}`,
        );

        // Log the specific config we are using
        console.log(
          `[Reducer Deep Dive] ${player.general.name} | Phase: ${phase} | ConfigCards: ${config.cards}`,
        );

        for (let i = 0; i < cardsNeeded; i++) {
          const card = deck.pop();
          if (card) {
            let finalSide = config.side;
            if (player.general.type === "human") finalSide = "face-up";

            player.state.hand.push({
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
      state.general.playingMatch = false;
    },
    foldHand: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const player = state.currentHand.players.find(
        (p) => p.general.id === playerId,
      );

      if (!player) return;

      player.state.isFolded = true;
      player.state.hasActed = true;
      player.state.lastAction = "fold";
      state.currentHand.actionMessage = `${player.general.name} folds`;
      state.currentHand.messageId += 1;

      if (checkLastManStanding(state)) return;

      // Crucial: Use the new signature here
      state.currentHand.activePlayerIndex = getNextActivePlayerIndex(
        state.currentHand.players,
        state.currentHand.activePlayerIndex,
      );
    },

    handleBet: (
      state,
      action: PayloadAction<{
        playerId: string;
        amount: number;
        type: BettingActionType;
      }>,
    ) => {
      const { playerId, amount, type } = action.payload;
      const player = state.currentHand.players.find(
        (p) => p.general.id === playerId,
      );

      if (!player || player.general.isDealer) return;

      // 1. Handle Folds
      if (type === "fold") {
        player.state.isFolded = true;
        player.state.lastAction = "fold";
        player.state.hasActed = true;
        state.currentHand.actionMessage = `${player.general.name} folds.`;
        state.currentHand.messageId += 1;

        // Check if only one person is left (Game Over for this hand)
        if (checkLastManStanding(state)) return;

        state.currentHand.activePlayerIndex = getNextActivePlayerIndex(
          state.currentHand.players,
          state.currentHand.activePlayerIndex,
        );
        return;
      }

      // 2. Validate Action
      const { valid, reason } = validateBetAction(
        player,
        amount,
        state.currentHand.currentBetOnTable,
        type,
      );

      if (!valid) {
        state.currentHand.actionMessage = reason || "Invalid Move";
        state.currentHand.messageId += 1;
        return;
      }

      // 3. Resolve Financials
      const { newPlayerMoney, newPlayerBet, newPot, isAllIn } = resolveBetState(
        player,
        amount,
        state.currentHand.pot,
      );

      // 4. Update Global & Player State
      player.account.totalMoney = newPlayerMoney;
      player.state.currentBet = newPlayerBet;
      player.state.hasActed = true;
      player.state.isAllIn = isAllIn;
      player.state.lastAction = type;
      state.currentHand.pot = newPot;

      if (type === "raise") {
        state.currentHand.currentBetOnTable = newPlayerBet;
        state.currentHand.lastRaiserId = playerId;
        state.currentHand.actionMessage = `${player.general.name} raises to $${newPlayerBet}.`;

        // The "Price Jump" Rule: Reset everyone who isn't all-in or folded
        state.currentHand.players.forEach((p) => {
          if (
            p.general.id !== playerId &&
            !p.state.isFolded &&
            !p.state.isAllIn &&
            !p.general.isDealer
          ) {
            p.state.hasActed = false;
          }
        });
      } else {
        state.currentHand.actionMessage =
          type === "call"
            ? `${player.general.name} calls.`
            : `${player.general.name} checks.`;
      }

      state.currentHand.messageId += 1;

      // 5. Determine Next Turn or Round End
      // We check if the betting round is complete BEFORE moving the index
      const roundComplete = state.currentHand.players
        .filter(
          (p) => !p.general.isDealer && !p.state.isFolded && !p.state.isAllIn,
        )
        .every(
          (p) =>
            p.state.hasActed &&
            p.state.currentBet === state.currentHand.currentBetOnTable,
        );

      if (roundComplete) {
        // This flag tells our middleware/thunk to trigger the next dealer phase
        state.currentHand.isRoundTransitioning = true;
      } else {
        state.currentHand.activePlayerIndex = getNextActivePlayerIndex(
          state.currentHand.players,
          state.currentHand.activePlayerIndex,
        );
      }
    },
    handlePlayerBroke: (
      state,
      action: PayloadAction<{ playerId: string; method: "plei" | "daily" }>,
    ) => {
      const { playerId, method } = action.payload;
      const player = state.currentHand.players.find(
        (p) => p.general.id === playerId,
      );

      if (!player || !player.profile) return;

      if (method === "plei" && (player.profile.plei ?? 0) >= 10) {
        player.profile.plei! -= 10;
        player.account.totalMoney += 500;
      }

      if (method === "daily") {
        player.account.totalMoney = 100;
      }
    },
    markNpcDiscard: (
      state,
      action: PayloadAction<{ playerIndex: number; cardIndices: number[] }>,
    ) => {
      const { playerIndex, cardIndices } = action.payload;
      const player = state.currentHand.players[playerIndex];

      if (player && player.state.hand) {
        cardIndices.forEach((index) => {
          if (player.state.hand[index]) {
            player.state.hand[index].isDiscarded = true;
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

      match.currentHand.players.forEach((player) => {
        if (player.general.isDealer) return;
        player.account.totalMoney -= amount;
        match.currentHand.pot += amount;
      });
    },
    playerRaise: (
      state,
      action: PayloadAction<{ playerId: string; amount: number }>,
    ) => {
      const { playerId, amount } = action.payload;
      const match = state;
      const player = match.currentHand.players.find(
        (p) => p.general.id === playerId,
      );

      if (player && player.account.totalMoney >= amount) {
        player.state.currentBet += amount;
        player.account.totalMoney -= amount;
        player.state.hasActed = true;
        player.state.lastAction = "raise";
        if (player.account.totalMoney === 0) player.state.isAllIn = true;
        match.currentHand.pot += amount;

        match.currentHand.players.forEach((p) => {
          if (
            p.general.id !== playerId &&
            !p.state.isFolded &&
            !p.state.isAllIn
          ) {
            p.state.hasActed = false;
          }
        });
      }
    },
    prepareNextHand: (state) => {
      const match = state;
      match.results.lastWinAmount = 0;
      match.currentHand.pot = 0;
      match.currentHand.currentBetOnTable = 0;
      match.currentHand.lastRaiserId = null;
      match.currentHand.activePlayerIndex = 0;

      match.results.winnerId = "";
      match.results.winningHand = "";

      match.currentHand.players.forEach((player) => {
        player.state.hand = [];
        player.state.isFolded = false;
        player.state.isAllIn = false;
        player.state.currentBet = 0;
        player.state.hasActed = false;
      });

      const gameType = match.currentHand.currentPhase.type;
      const sequence = gamePhaseSequences[gameType];
      match.currentHand.currentPhase.phase = sequence[1];
      match.currentHand.actionMessage = "New Hand Started";
      match.currentHand.messageId += 1;
    },
    quitMatch: (state) => {
      state.general.numberOfOpponents = 1;
      state.currentHand.players = [];
      state.currentHand.pot = 0;
      state.general.playingMatch = false;
    },
    resetGame: () => {
      return initialMatchState;
    },
    resolveShowdown: (state) => {
      const match = state;

      const activePlayers = match.currentHand.players.filter(
        (p) => !p.state.isFolded,
      );

      if (activePlayers.length === 0) return;

      const results = activePlayers.map((player) => {
        const evaluation = evaluatePokerHand(player.state.hand);
        return {
          id: player.general.id,
          name: player.general.name,
          rankValue: evaluation.rankValue,
          handName: evaluation.label,
        };
      });

      const winnerResult = results.reduce((prev, current) =>
        prev.rankValue > current.rankValue ? prev : current,
      );

      const winningPlayer = match.currentHand.players.find(
        (p) => p.general.id === winnerResult.id,
      );

      if (winningPlayer) {
        winningPlayer.account.totalMoney += match.currentHand.pot;

        match.results.winnerId = winningPlayer.general.id ?? "";
        match.results.winningHand = winnerResult.handName;
        match.results.lastWinAmount = match.currentHand.pot;

        console.log(
          `${winningPlayer.general.name} wins $${match.currentHand.pot} with ${winnerResult.handName}!`,
        );
      }
      match.currentHand.pot = 0;
    },
    rotateDealer: (state) => {
      const len = state.currentHand.players.length;
      if (len === 0) return;

      // The logic: (Current - 1 + Length) % Length
      // Adding length handles the "0 to Top" jump automatically
      state.currentHand.dealerIndex =
        (state.currentHand.dealerIndex - 1 + len) % len;

      console.log(
        `Dealer rotated to index: ${state.currentHand.dealerIndex} (${state.currentHand.players[state.currentHand.dealerIndex].general.name})`,
      );
    },
    startMatch: (state, action: PayloadAction<GamePayloadInterface>) => {
      const {
        numberOfOpponents,
        matchLocation,
        numberOfDecks,
        hero,
        deckStyle,
        difficultyLevel,
        matchType,
      } = action.payload;

      // 1. General & Hand Setup
      state.general.playingMatch = true;
      state.general.matchType = matchType;
      state.general.matchLocation = matchLocation;
      state.general.deckStyle = deckStyle;
      state.general.difficultyLevel = difficultyLevel;

      state.currentHand.dealerIndex = numberOfOpponents; // Dealer is usually the last entity
      state.currentHand.currentPhase.type = matchType;

      // 2. Variant Reset (Only reset the one we need, or all to defaults)
      if (matchType === "draw") {
        state.variantSpecifics.drawSpecifics = { ...INITIAL_DRAW_SPECIFICS };
      } else if (matchType === "holdem") {
        state.variantSpecifics.holdemSpecifics = {
          ...INITIAL_HOLDEM_SPECIFICS,
        };
      }

      // 3. Opponent Generation
      const count = numberOfOpponents ?? 1;
      const availableThemes = matchMap[
        matchLocation as keyof typeof matchMap
      ] || ["classic"];
      const selectedTheme =
        availableThemes[Math.floor(Math.random() * availableThemes.length)];

      const newOpponents: PlayerInterface[] = [];
      const usedNames = new Set<string>();

      while (newOpponents.length < count) {
        const candidate = createVillain(selectedTheme);
        if (!usedNames.has(candidate.general.name)) {
          newOpponents.push({
            ...candidate,
            state: {
              hand: [],
              chips: startingChips,
              currentBet: 0,
              isFolded: false,
              isAllIn: false,
              hasActed: false,
              position: newOpponents.length + 1, // Hero is 0
            },
            flags: {
              isInitialLoad: false,
              isProcessingAction: false,
              isWinner: false,
              hasTurnFocus: false,
            },
            stats: { ...INITIAL_SESSION_STATS },
          });
          usedNames.add(candidate.general.name);
        }
      }

      // 4. Final Player List Assembly
      const dealerEntity = createDealer();

      state.currentHand.players = [
        {
          ...hero,
          general: {
            ...hero.general,
            type: "human",
            isDealer: false,
          },
          state: {
            hand: [],
            chips: startingChips,
            currentBet: 0,
            hasActed: false,
            isFolded: false,
            isAllIn: false,
            position: 0,
          },
          flags: {
            isInitialLoad: false,
            isProcessingAction: false,
            isWinner: false,
            hasTurnFocus: false,
          },
          stats: hero.stats || { ...INITIAL_SESSION_STATS },
        },
        ...newOpponents,
        dealerEntity,
      ];

      // 5. Deck & Phase Finalization
      state.currentHand.deck = shuffleDeck(
        generateDeck(numberOfDecks, deckStyle),
      );
      const phaseSequence = gamePhaseSequences[matchType];
      state.currentHand.currentPhase.phase = phaseSequence[0] as MatchPhaseType;
    },

    subtractOpponentMoney: (
      state,
      action: PayloadAction<{ opponentIndex: number; amount: number }>,
    ) => {
      const opponent = state.currentHand.players[action.payload.opponentIndex];
      if (opponent) {
        opponent.account.totalMoney -= action.payload.amount;
      }
    },
    toggleDiscard: (state, action: PayloadAction<number>) => {
      const cardIndex = action.payload;

      const hero = state.currentHand.players.find(
        (p) => p.general.type === "human",
      );

      if (hero && hero.state.hand[cardIndex]) {
        hero.state.hand[cardIndex].isDiscarded =
          !hero.state.hand[cardIndex].isDiscarded;
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
  handleBet,
  handlePlayerBroke,
  markNpcDiscard,
  performAnteUp,
  prepareNextHand,
  quitMatch,
  resetGame,
  resolveShowdown,
  rotateDealer,
  startMatch,
  subtractOpponentMoney,
  toggleDiscard,
} = matchSlice.actions;

export default matchSlice.reducer;
