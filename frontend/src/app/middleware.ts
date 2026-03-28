import {
  createListenerMiddleware,
  isAnyOf,
  createSelector,
} from "@reduxjs/toolkit";
import {
  dealRound,
  dealCard,
  checkAndRefillDeck,
  processBet,
} from "../features/game/gameSlice";
import type { RootState } from "./store";
import { evaluateHand, getNPCAction } from "./logic/logic";
import type { BettingActionType } from "./types";

const deckListener = createListenerMiddleware();

/**
 * 1. DECK MANAGEMENT LISTENER
 */
deckListener.startListening({
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { deck } = state.game.currentMatch;
    if (deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

/**
 * 2. NPC BETTING TURN LISTENER
 * This watches for changes in whose turn it is.
 */
/**
 * 2. NPC BETTING TURN LISTENER
 */
/**
 * 2. NPC BETTING TURN LISTENER
 */
deckListener.startListening({
  // 1. Detect the SPECIFIC moment the turn index changes
  predicate: (_action, currentState, previousState) => {
    const currIndex = (currentState as RootState).game.currentMatch
      .activePlayerIndex;
    const prevIndex = (previousState as RootState).game.currentMatch
      .activePlayerIndex;
    return currIndex !== prevIndex && currIndex > 0;
  },
  effect: async (_, listenerApi) => {
    console.log("listen here");
    // 2. This cancels any previous instances of THIS listener
    // that might still be running (the "thinking" phase).
    listenerApi.cancelActiveListeners();

    const state = listenerApi.getState() as RootState;
    const { activePlayerIndex, opponents, difficultyLevel, pot, currentBet } =
      state.game.currentMatch;

    const npcIndex = activePlayerIndex - 1;
    const npc = opponents[npcIndex];
    if (!npc) return;

    const evaluation = selectOpponentHandEval(state, npcIndex);

    // NPC "Thinking" simulation
    const thinkTime = npc.personality?.thinkTime || 1000;

    // 3. Use delay. It automatically handles cancellation if
    // cancelActiveListeners() is called by a newer instance.
    await listenerApi.delay(thinkTime);

    const decision = getNPCAction(npc, evaluation, difficultyLevel, pot);
    const normalizedDecision = decision.toLowerCase();

    listenerApi.dispatch(
      processBet({
        playerId: npc.id ?? "unknown-npc",
        type: normalizedDecision as BettingActionType,
        amount: normalizedDecision === "raise" ? currentBet + 50 : currentBet,
      }),
    );
  },
});

const selectHeroCards = (state: RootState) => state.game.currentMatch.herosHand;

// Memoized Hero Eval
export const selectHeroHandEval = createSelector([selectHeroCards], (cards) =>
  evaluateHand(cards),
);

// Memoized Opponent Eval (handles the index)
export const selectOpponentHandEval = createSelector(
  [
    (state: RootState) => state.game.currentMatch.opponents,
    (_state: RootState, index: number) => index,
  ],
  (opponents, index) => {
    // We only want to run evaluateHand if THIS specific hand changed
    const hand = opponents[index]?.currentHand || [];
    return evaluateHand(hand);
  },
);

export default deckListener;
