import {
  createListenerMiddleware,
  isAnyOf,
  createSelector,
} from "@reduxjs/toolkit";
import {
  advancePhase,
  dealRound,
  dealCard,
  checkAndRefillDeck,
  processBet,
} from "../features/game/gameSlice";
import type { RootState } from "./store";
import { evaluateHand, getNPCAction } from "./logic/logic";
import type { BettingActionType } from "./types";

const deckListener = createListenerMiddleware();

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

deckListener.startListening({
  predicate: (_action, currentState, previousState) => {
    const currIndex = (currentState as RootState).game.currentMatch
      .activePlayerIndex;
    const prevIndex = (previousState as RootState).game.currentMatch
      .activePlayerIndex;
    return currIndex !== prevIndex && currIndex > 0;
  },
  effect: async (_, listenerApi) => {
    console.log("listen here");

    const state = listenerApi.getState() as RootState;
    const { activePlayerIndex, opponents, difficultyLevel, pot, currentBet } =
      state.game.currentMatch;

    const npcIndex = activePlayerIndex - 1;
    const npc = opponents[npcIndex];
    if (!npc || npc.isFolded || npc.isAllin) return;

    const thinkTime = npc.personality?.thinkTime || 1000;

    await listenerApi.delay(thinkTime);

    const evaluation = selectOpponentHandEval(state, npcIndex);
    const decision = getNPCAction(
      npc,
      evaluation,
      difficultyLevel,
      pot,
      currentBet,
    );
    const normalizedDecision = decision.toLowerCase();
    const type = decision.toLowerCase() as BettingActionType;

    let amountToSend = 0;
    if (type === "call") {
      // If currentBet is 10 and NPC already put in 5, they only owe 5.
      amountToSend = Math.max(0, currentBet - (npc.currentBet || 0));
    } else if (type === "raise") {
      // Raise to currentBet + a fixed amount (e.g., 50)
      const totalTargetBet = currentBet + 50;
      amountToSend = totalTargetBet - (npc.currentBet || 0);
    }
    console.log(normalizedDecision, amountToSend, type);
    listenerApi.dispatch(
      processBet({
        playerId: npc.id ?? "unknown-npc",
        type: normalizedDecision as BettingActionType,
        amount: amountToSend,
      }),
    );
  },
});

const selectHeroCards = (state: RootState) =>
  state.game.currentMatch.hero.currentHand;

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

// Add this to your deckListener.ts
deckListener.startListening({
  actionCreator: processBet,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const match = state.game.currentMatch;

    const everyoneActed =
      match.hero.hasActed &&
      match.opponents.every((o) => o.isFolded || o.hasActed);

    // Check if bets are equal (everyone called the highest bet)
    const activePlayers = [match.hero, ...match.opponents].filter(
      (p) => !p.isFolded,
    );
    const betsEqual = activePlayers.every(
      (p) => p.currentBet === match.currentBet,
    );

    if (everyoneActed && betsEqual) {
      await listenerApi.delay(500);
      listenerApi.dispatch(advancePhase());
    }
  },
});

export default deckListener;
