import { describe, it, expect, beforeEach } from "vitest";
import matchReducer, { dealRound } from "./matchSlice";
import type {
  MatchInterface,
  PlayerInterface,
} from "../../app/interfaces/matchInterfaces";
import {
  INITIAL_CASINO_SPECIFICS,
  INITIAL_DRAW_SPECIFICS,
  INITIAL_HOLDEM_SPECIFICS,
  INITIAL_NO_SPECIFICS,
} from "../../app/assets/match/matchAssets";
import {
  INITIAL_LIFETIME_STATS,
  INITIAL_SESSION_STATS,
} from "../../app/assets/profile/profileAssets";

describe("matchSlice dealRound reducer", () => {
  let initialState: MatchInterface;

  beforeEach(() => {
    const gary: PlayerInterface = {
      general: {
        id: "human-gary",
        name: "Gary",
        type: "human",
        isDealer: false,
      },
      state: {
        hand: [],
        chips: { white: 0, red: 0, blue: 0, green: 0, black: 0 },
        currentBet: 0,
        isFolded: false,
        isAllIn: false,
        hasActed: false,
        lastAction: null,
        lastActionValue: 0,
        isDiscarding: false,
        position: 0,
      },
      profile: {
        level: 1,
        xp: 0,
        nextLevel: 1000,
        money: 1000,
        plei: 0,
        availableLocations: [],
        availableDecks: [],
        locationsVisited: [],
        locationsMastered: [],
        currentDeckChoice: null,
        isSpecial: false,
      },
      flags: {
        isInitialLoad: false,
        isProcessingAction: false,
        isWinner: false,
        hasTurnFocus: true,
      },
      stats: {
        lifetime: INITIAL_LIFETIME_STATS,
        session: INITIAL_SESSION_STATS,
      },
    };

    initialState = {
      general: {
        matchId: "",
        numberOfOpponents: 1,
        deckStyle: "arrowBolt",
        difficultyLevel: "normal",
        matchLocation: "shelter",
        matchType: "draw",
        numberOfDecks: 1,
        playingMatch: true,
      },
      client: {
        localPlayerId: "",
        isObserver: false,
        currentIndex: 0,
      },
      config: {
        rules: {
          ante: 10,
          minBet: 5,
          turnTimer: 1500,
        },
        limits: {
          maxPlayers: 5,
          minBuyIn: 100,
        },
      },
      variantSpecifics: {
        minimumParticipants: 2,
        drawSpecifics: { ...INITIAL_DRAW_SPECIFICS },
        holdemSpecifics: { ...INITIAL_HOLDEM_SPECIFICS },
        casinoVariantSpecifics: { ...INITIAL_CASINO_SPECIFICS },
        noSpecifics: { ...INITIAL_NO_SPECIFICS },
        studSpecifics: { upCards: [], downCards: [] },
      },
      currentHand: {
        players: [gary],
        handNumber: 1,
        dealerIndex: 0,
        pot: 0,
        currentBetOnTable: 0,
        activePlayerIndex: 0,
        lastRaiserId: null,
        isRoundTransitioning: false,
        actionMessage: "",
        messageId: 0,
        currentPhase: {
          type: "draw",
          phase: "ante",
          step: 0,
          isFinalStreet: false,
        },
        deck: [
          {
            value: "A",
            suit: "heart",
            side: "face-down",
            currentLocation: "demo",
            isDiscarded: false,
            deckDesign: "arrowBolt",
          },
          {
            value: "K",
            suit: "diamond",
            side: "face-down",
            currentLocation: "demo",
            isDiscarded: false,
            deckDesign: "arrowBolt",
          },
          {
            value: "Q",
            suit: "club",
            side: "face-down",
            currentLocation: "demo",
            isDiscarded: false,
            deckDesign: "arrowBolt",
          },
          {
            value: "J",
            suit: "spade",
            side: "face-down",
            currentLocation: "demo",
            isDiscarded: false,
            deckDesign: "arrowBolt",
          },
          {
            value: 10,
            suit: "heart",
            side: "face-down",
            currentLocation: "demo",
            isDiscarded: false,
            deckDesign: "arrowBolt",
          },
        ],
      },
      results: { isGameOver: false },
      visuals: {
        theme: "classic",
        skylineStatus: "active",
        tableColor: "green",
        activeEffects: [],
      },
    };
  });

  it("should deal 5 cards to the human player during the draw ante phase", () => {
    const state = matchReducer(initialState, dealRound());
    const humanHand = state.currentHand.players[0].state.hand;
    expect(humanHand.length).toBe(5);
    expect(humanHand[0].side).toBe("face-up");
    expect(humanHand[0].currentLocation).toBe("p1");
    expect(state.currentHand.deck.length).toBe(0);
  });
});
