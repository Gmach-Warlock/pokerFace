import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store/store";
import { createChips } from "../../app/logic/factory/factoryFunctions";
import { INITIAL_SESSION_STATS } from "../../app/assets/profile/profileAssets";
import type { MatchLocationType } from "../../app/types/worldMapTypes";
import type { CardSuitType, DeckStyleType } from "../../app/types/matchTypes";
import { evaluatePokerHand } from "../../app/logic/match/evaluators/evaluators";
import { cardSuitIcons, handRanks } from "../../app/assets/match/matchAssets";

/**
 * ============================================================
 * BASE SELECTORS (The "Roots")
 * ============================================================
 */
export const selectMatch = (state: RootState) => state.match;

/**
 * ============================================================
 * GLOBAL GAME STATE (Table, Pot, Phase)
 * ============================================================
 */
// matchSelectors.ts

// 1. Keep this for components that just want the string (like your buttons)
export const selectCurrentPhaseName = (state: RootState) =>
  state.match.currentHand.currentPhase.phase;

// 2. Use this for components that need the type AND phase (like ArenaCenter)
export const selectCurrentPhase = (state: RootState) =>
  state.match.currentHand.currentPhase;
export const selectPot = createSelector(
  [selectMatch],
  (m) => m.currentHand.pot,
);
export const selectMatchLocation = createSelector(
  [selectMatch],
  (m) => m.general.matchLocation,
);
export const selectDeckStyle = createSelector(
  [selectMatch],
  (m) => m.general.deckStyle,
);

export const selectIsBettingPhase = createSelector(
  [selectCurrentPhaseName],
  (phase) => phase === "bettingOne" || phase === "bettingTwo",
);

export const selectCurrentMaxBet = createSelector([selectMatch], (match) => {
  const allBets = match.currentHand.players.map((p) => p.state.currentBet ?? 0);
  return Math.max(...allBets, 0);
});
/**
 * ============================================================
 * HERO SELECTORS (Specific to the Human Player)
 * ============================================================
 */
export const selectHero = createSelector([selectMatch], (match) =>
  match.currentHand.players.find((p) => p.general.type === "human"),
);
export const selectHerosId = createSelector(
  [selectHero],
  (h) => h?.general.id ?? "",
);
export const selectHeroName = createSelector(
  [selectHero],
  (h) => h?.general.name ?? "Unknown",
);
export const selectHeroMoney = createSelector(
  [selectHero],
  (h) => h?.account.totalMoney ?? 0,
);
export const selectHeroIsFolded = createSelector(
  [selectHero],
  (h) => h?.state.isFolded ?? false,
);
export const selectHeroHand = createSelector(
  [selectHero],
  (h) => h?.state.hand ?? [],
);
export const selectHeroCurrentBet = createSelector(
  [selectHero],
  (h) => h?.state.currentBet ?? 0,
);

export const selectHeroChips = createSelector([selectHeroMoney], (money) =>
  createChips(money),
);

export const selectHeroHandRank = createSelector([selectHeroHand], (hand) =>
  !hand || hand.length === 0 ? handRanks.highCard : evaluatePokerHand(hand),
);

export const selectHeroAmountToCall = createSelector(
  [selectHeroCurrentBet, selectCurrentMaxBet],
  (heroBet, maxBet) => {
    return Math.max(maxBet - heroBet, 0);
  },
);

/**
 * ============================================================
 * GENERIC PLAYER SELECTORS (Hero or Opponent by ID)
 * ============================================================
 */
export const selectDealer = createSelector([selectMatch], (match) => {
  const { players, dealerIndex } = match.currentHand;
  return players[dealerIndex] || null;
});

// This helper is great for UI if you ever decide to show a "Dealer" label
export const selectIsPlayerDealer = (playerId: string) =>
  createSelector(
    [selectMatch],
    (match) =>
      match.currentHand.players[match.currentHand.dealerIndex]?.general.id ===
      playerId,
  );
export const selectPlayerById = createSelector(
  [selectMatch, (_state: RootState, playerId: string | null) => playerId],
  (match, playerId) => {
    if (!playerId) return null;
    return (
      match.currentHand.players.find((p) => p.general.id === playerId) || null
    );
  },
);

export const selectPlayers = (state: RootState) =>
  state.match.currentHand.players;

export const selectOpponents = createSelector([selectMatch], (match) => {
  return match.currentHand.players.filter(
    (player) => player.general.type === "computer",
  );
});

export const selectOpponentStatusClass = createSelector(
  [selectPlayerById],
  (player) => {
    if (!player) return "";
    if (player.state.isFolded) return "opponent__card--folded";
    if (player.state.isAllIn) return "opponent__card--all-in";
    return "opponent__card--active";
  },
);

export const selectPlayerName = createSelector(
  [selectPlayerById],
  (p) => p?.general.name ?? "Unknown",
);
export const selectPlayerMoney = createSelector(
  [selectPlayerById],
  (p) => p?.account.totalMoney ?? 0,
);
export const selectIsPlayerFolded = createSelector(
  [selectPlayerById],
  (p) => p?.state.isFolded ?? false,
);
export const selectPlayerChips = createSelector(
  [selectPlayerById],
  (p) => p?.state.chips ?? { white: 0, red: 0, blue: 0, green: 0, black: 0 },
);

/**
 * ============================================================
 * Betting & UI SELECTORS
 * ============================================================
 */
export const selectCurrentPot = (state: RootState) =>
  state.match.currentHand.pot;
export const selectWinnerId = createSelector(
  [selectMatch],
  (m) => m.results.winnerId,
);
export const selectWinningHandLabel = createSelector(
  [selectMatch],
  (m) => m.results.winningHand,
);

export const selectWinnerName = createSelector(
  [(state) => state, selectWinnerId, selectHerosId],
  (state, winnerId, heroId) => {
    if (!winnerId) return "";
    return winnerId === heroId ? "YOU" : selectPlayerName(state, winnerId);
  },
);

export const selectDiscardCount = createSelector(
  [selectHeroHand],
  (hand) => hand.filter((card) => card.isDiscarded).length,
);
export const selectActionButtonLabel = createSelector(
  [selectCurrentPhase, selectDiscardCount, selectHeroAmountToCall],
  (currentPhase, discardCount, amountToCall) => {
    // 1. Phase names are case-sensitive. Let's force lowercase for comparison
    // to avoid "bettingOne" vs "bettingone" bugs.
    const p = currentPhase.phase.toLowerCase();

    switch (p) {
      case "ante":
        return "Ante Up & Deal";
      case "deal":
        // This is where you were getting stuck.
        // If the cards are dealt but the phase hasn't advanced yet:
        return "Start Betting";
      case "draw":
        return discardCount > 0 ? `Swap ${discardCount} Cards` : "Stand Pat";
      case "bettingone":
      case "bettingtwo":
        return amountToCall > 0 ? `Call $${amountToCall}` : "Check";
      case "showdown":
        return "See Results";
      default:
        // Use a more descriptive fallback for debugging
        return `Finish ${currentPhase.phase}`;
    }
  },
);
export const selectDeck = createSelector(
  [selectMatch],
  (match) => match.currentHand.deck,
);

export const selectMinBetAmount = createSelector(
  [selectHeroAmountToCall],
  (amountToCall) => amountToCall,
);

export const selectMaxBetAmount = createSelector(
  [selectHeroMoney],
  (money) => money,
);

export const selectCallButtonLabel = createSelector(
  [selectHeroAmountToCall],
  (amount) => (amount > 0 ? `Call $${amount}` : "Check"),
);

export const selectSuitMetadata = createSelector(
  [(_state: RootState, suit: CardSuitType) => suit],
  (suit) => {
    const isRed = suit === "heart" || suit === "diamond";
    return {
      color: isRed ? "red" : "black",
      icon: cardSuitIcons[suit],
      label: suit.charAt(0).toUpperCase() + suit.slice(1),
    };
  },
);
export const selectPlayerData = (state: RootState) => state.profile.playerData;
export const selectInitialHeroState = createSelector(
  [selectPlayerData],
  (player) => ({
    ...player,
    isFolded: false,
    currentHand: [],
    currentBet: 0,
    hasActed: false,
    actionMessage: "",
    isAllin: false,
    sessionStats: INITIAL_SESSION_STATS,
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 5,
      availableLocations: ["shelter"] as MatchLocationType[],
      availableDecks: ["arrowBolt"] as DeckStyleType[],
      locationsVisited: ["none"] as MatchLocationType[],
      locationsMastered: ["none"] as MatchLocationType[],
      currentDeckChoice: "arrowBolt" as DeckStyleType,
      plei: 0,
      isSpecial: false,
      stats: {
        lifetime: INITIAL_SESSION_STATS,
      },
    },
  }),
);

export const selectAvailableDecks = (state: RootState) =>
  state.profile.playerData.profile?.availableDecks ?? ["arrowBolt"];

export const selectAvailableLocations = (state: RootState) =>
  state.profile.playerData.profile?.availableLocations ?? ["shelter"];

export const selectPlayerHandEval = createSelector(
  [
    (state: RootState) => state.match.currentHand.players,
    (_state: RootState, index: number) => index,
  ],
  (players, index) => {
    const hand = players[index]?.state.hand || [];
    return evaluatePokerHand(hand);
  },
);

export const selectIsBigPot = (state: RootState) => {
  const { pot, players } = state.match.currentHand;
  return pot > players.length * 100;
};

export const selectActiveNPC = (state: RootState) => {
  const activeIdx = state.match.currentHand.activePlayerIndex;
  return state.match.currentHand.players[activeIdx];
};

export const selectActivePlayers = (state: RootState) =>
  state.match.currentHand.players.filter(
    (p) => !p.state.isFolded && !p.state.isAllIn,
  );

export const selectIsRoundOver = (state: RootState) => {
  const activeAndNotAllIn = state.match.currentHand.players.filter(
    (p) => !p.state.isFolded && !p.state.isAllIn,
  );

  const { currentBetOnTable, currentPhase } = state.match.currentHand;

  if (["ante", "deal", "showdown"].includes(currentPhase.phase)) return false;

  // If 0 or 1 person can still act, the round is essentially over
  if (activeAndNotAllIn.length <= 1) {
    // Check if everyone else has matched the current bet on table
    const activePlayers = state.match.currentHand.players.filter(
      (p) => !p.state.isFolded,
    );
    return activePlayers.every(
      (p) => p.state.currentBet === currentBetOnTable || p.state.isAllIn,
    );
  }

  const everyoneActed = activeAndNotAllIn.every((p) => p.state.hasActed);
  const betsEqual = activeAndNotAllIn.every(
    (p) => p.state.currentBet === currentBetOnTable,
  );

  return everyoneActed && betsEqual;
};

export const selectCurrentTurnPlayer = (state: RootState) =>
  state.match.currentHand.players[state.match.currentHand.activePlayerIndex];
