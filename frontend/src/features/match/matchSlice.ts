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
  PhaseInstruction,
} from "../../app/interfaces/matchInterfaces";

// 2. CORE LOGIC & UTILITIES
import {
  generateDeck,
  createVillain,
  createDealer,
  createChips,
} from "../../app/logic/factory/factoryFunctions";
import {
  checkLastManStanding,
  prepareNewPhase,
  shuffleDeck,
  pickAnteAmount,
} from "../../app/logic/match/utils/utils";
import { evaluatePokerHand } from "../../app/logic/match/evaluators/evaluators";
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
import {
  INITIAL_SESSION_STATS,
  INITIAL_LIFETIME_STATS,
} from "../../app/assets/profile/profileAssets";
import {
  distributeToBoard,
  distributeToPlayer,
} from "../../app/logic/match/betting/bettingUtils";
import {
  canAdvancePhaseLogic,
  rotateDealerIndex,
  getInitialActivePlayerIndex,
} from "../../app/logic/match/utils/stateUtils";

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
  client: {
    localPlayerId: "",
    isObserver: false,
    currentIndex: 0,
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
    minimumParticipants: 2,
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
      isFinalStreet: false,
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
      if (!canAdvancePhaseLogic(state as MatchInterface)) return;
      const { type, phase } = state.currentHand.currentPhase;
      const sequence = gamePhaseSequences[type];
      const currentIdx = sequence.indexOf(phase);

      if (currentIdx < sequence.length - 1) {
        const nextPhase = sequence[currentIdx + 1];
        prepareNewPhase(state, nextPhase);
        state.currentHand.players.forEach((p) => {
          p.state.hasActed = false;
        });
        console.log(`--- PHASE SHIFT: ${phase} -> ${nextPhase} ---`);
      }
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

    completeDrawPhase: (state) => {
      state.currentHand.currentPhase.phase = "bettingTwo";
      state.currentHand.currentBetOnTable = 0;
      state.currentHand.lastRaiserId = null;
      state.currentHand.players.forEach((p) => {
        p.state.hasActed = false;
        p.state.currentBet = 0;
        p.state.lastAction = null;
      });
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

    dealRound: (state: MatchInterface) => {
      const { currentHand } = state;
      const { currentPhase, deck, players, dealerIndex } = currentHand;
      const config = (matchPhaseMap as MatchPhaseConfigType)[
        currentPhase.type
      ]?.[currentPhase.phase] as PhaseInstruction;

      if (!config) return;

      if (config.target === "board") {
        distributeToBoard(state, config.cards as number);
      } else {
        players.forEach((player, idx) => {
          if (player.general.isDealer || player.state.isFolded) return;
          distributeToPlayer(player, idx, config, deck, currentPhase);
        });
      }

      if (config.nextPhase) {
        currentHand.currentPhase.phase = config.nextPhase;
        currentHand.players.forEach((p) => {
          p.state.hasActed = false;
          p.state.currentBet = 0;
        });
        currentHand.activePlayerIndex = getInitialActivePlayerIndex(
          players,
          dealerIndex,
        );
        currentHand.currentBetOnTable = 0;
        currentHand.actionMessage = `Phase: ${config.nextPhase.toUpperCase()}`;
        currentHand.messageId += 1;
      }
    },

    finishMatch: (state) => {
      state.general.playingMatch = false;
    },

    foldHand: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const player = state.currentHand.players.find(
        (p) => p.general.id === playerId,
      );
      if (!player || player.state.isFolded) return;
      player.state.isFolded = true;
      player.state.hasActed = true;
      player.state.lastAction = "fold";
      state.currentHand.actionMessage = `${player.general.name} folds.`;
      state.currentHand.messageId += 1;
      if (checkLastManStanding(state)) {
        return;
      }
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
      if (!player || player.general.isDealer) {
        console.warn(
          "Rejected bet action: Player is the Dealer or does not exist.",
        );
        return;
      }

      if (type === "fold") {
        player.state.isFolded = true;
        player.state.lastAction = "fold";
        player.state.hasActed = true;
        state.currentHand.actionMessage = `${player.general.name} folds.`;
        state.currentHand.messageId += 1;
        if (checkLastManStanding(state)) return;
        state.currentHand.activePlayerIndex = getNextActivePlayerIndex(
          state.currentHand.players,
          state.currentHand.activePlayerIndex,
        );
        return;
      }
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
      const { newPlayerMoney, newPlayerBet, newPot, isAllIn } = resolveBetState(
        player,
        amount,
        state.currentHand.pot,
      );
      player.profile.money = newPlayerMoney;
      player.state.currentBet = newPlayerBet;
      player.state.hasActed = true;
      player.state.isAllIn = isAllIn;
      player.state.lastAction = type;
      state.currentHand.pot = newPot;
      if (type === "raise") {
        state.currentHand.currentBetOnTable = newPlayerBet;
        state.currentHand.lastRaiserId = playerId;
        state.currentHand.actionMessage = `${player.general.name} raises to $${newPlayerBet}.`;
        state.currentHand.players.forEach((p) => {
          const isRaiser = p.general.id === playerId;
          const canStillAct =
            !p.state.isFolded && !p.state.isAllIn && !p.general.isDealer;
          if (!isRaiser && canStillAct) {
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
      const activeContestants = state.currentHand.players.filter(
        (p) => !p.general.isDealer && !p.state.isFolded && !p.state.isAllIn,
      );
      const roundComplete = activeContestants.every(
        (p) =>
          p.state.hasActed &&
          p.state.currentBet === state.currentHand.currentBetOnTable,
      );
      if (roundComplete) {
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
        player.profile.money += 500;
      }
      if (method === "daily") {
        player.profile.money = 100;
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

    nextTurn: (state) => {
      const { players, activePlayerIndex } = state.currentHand;
      let nextIndex = (activePlayerIndex + 1) % players.length;
      while (
        players[nextIndex].general.isDealer ||
        players[nextIndex].state.isFolded ||
        players[nextIndex].state.isAllIn
      ) {
        nextIndex = (nextIndex + 1) % players.length;
        if (nextIndex === activePlayerIndex) break;
      }

      state.currentHand.activePlayerIndex = nextIndex;
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
        player.profile.money -= amount;
        match.currentHand.pot += amount;
        player.state.hasActed = true;
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
      if (player && player.profile.money >= amount) {
        player.state.currentBet += amount;
        player.profile.money -= amount;
        player.state.hasActed = true;
        player.state.lastAction = "raise";
        if (player.profile.money === 0) player.state.isAllIn = true;
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
      match.currentHand.dealerIndex = rotateDealerIndex(
        match.currentHand.dealerIndex,
        match.currentHand.players.length,
      );
      match.currentHand.activePlayerIndex = getInitialActivePlayerIndex(
        match.currentHand.players,
        match.currentHand.dealerIndex,
      );
      match.currentHand.handNumber += 1;
      match.currentHand.pot = 0;
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
      state.general.playingMatch = false;
      state.client.localPlayerId = "";
      state.currentHand.players = [];
      state.currentHand.pot = 0;
      state.general.playingMatch = false;
      state.general.numberOfOpponents = 1;
      state.currentHand.players = [];
      state.currentHand.pot = 0;
      state.results = {
        winnerId: "",
        winningHand: "",
        lastWinAmount: 0,
        isGameOver: false,
      };
    },

    resetGame: () => {
      return initialMatchState;
    },

    resolveShowdown: (state) => {
      const activePlayers = state.currentHand.players.filter(
        (p) => !p.state.isFolded && p.general.type !== "dealer",
      );

      if (activePlayers.length === 0) return;

      const evaluations = activePlayers.map((p) => ({
        id: p.general.id,
        res: evaluatePokerHand(p.state.hand),
      }));
      const maxRank = Math.max(...evaluations.map((e) => e.res.rankValue));
      const winners = evaluations.filter((e) => e.res.rankValue === maxRank);
      const potPerWinner = Math.floor(state.currentHand.pot / winners.length);
      winners.forEach((w) => {
        const player = state.currentHand.players.find(
          (p) => p.general.id === w.id,
        );
        if (player) {
          player.profile.money += potPerWinner;
          const chipsWon = createChips(potPerWinner);
          Object.keys(chipsWon).forEach((color) => {
            const key = color as keyof typeof chipsWon;
            player.state.chips[key] += chipsWon[key];
          });
        }
      });
      const leadWinner = state.currentHand.players.find(
        (p) => p.general.id === winners[0].id,
      );
      state.results.winnerId =
        winners.length > 1 ? "split" : (leadWinner?.general.id ?? "");
      state.results.winningHand = winners[0].res.label;
      state.currentHand.pot = 0;
      state.currentHand.currentPhase.phase = "showdown";
    },

    rotateDealer: (state) => {
      const len = state.currentHand.players.length;
      if (len === 0) return;
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
      state.client.localPlayerId = hero.general.id;
      state.general.playingMatch = true;
      state.general.matchType = matchType;
      state.general.matchLocation = matchLocation;
      state.general.deckStyle = deckStyle;
      state.general.difficultyLevel = difficultyLevel;
      state.currentHand.dealerIndex = numberOfOpponents;
      state.currentHand.currentPhase.type = matchType;

      if (matchType === "draw") {
        state.variantSpecifics.drawSpecifics = { ...INITIAL_DRAW_SPECIFICS };
      } else if (matchType === "holdem") {
        state.variantSpecifics.holdemSpecifics = {
          ...INITIAL_HOLDEM_SPECIFICS,
        };
      }

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
              ...candidate.state,
              chips: startingChips,
              position: newOpponents.length + 1,
            },
            stats: {
              lifetime: { ...INITIAL_LIFETIME_STATS },
              session: { ...INITIAL_SESSION_STATS },
            },
            flags: {
              isInitialLoad: false,
              isProcessingAction: false,
              isWinner: false,
              hasTurnFocus: false,
            },
          });
          usedNames.add(candidate.general.name);
        }
      }
      const dealerEntity = createDealer();
      const heroWithStats: PlayerInterface = {
        ...hero,
        general: {
          ...hero.general,
          id: hero.general.id,
          type: "human",
        },
        state: {
          ...hero.state,
          chips: Object.values(hero.state.chips).some((v) => v > 0)
            ? hero.state.chips
            : startingChips,
          position: 0,
        },
        stats: {
          lifetime: hero.stats?.lifetime || { ...INITIAL_LIFETIME_STATS },
          session: { ...INITIAL_SESSION_STATS },
        },
        flags: {
          isInitialLoad: false,
          isProcessingAction: false,
          isWinner: false,
          hasTurnFocus: false,
        },
      };
      state.currentHand.players = [
        heroWithStats,
        ...newOpponents,
        dealerEntity,
      ];
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
        opponent.profile.money -= action.payload.amount;
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
  nextTurn,
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
