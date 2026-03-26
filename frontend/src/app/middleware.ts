import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  dealRound,
  dealCard,
  checkAndRefillDeck,
} from "../features/game/gameSlice"; // Adjust path
import type { RootState } from "./store";
import { calculateHandValue } from "../functions/factory/factory";

const deckListener = createListenerMiddleware();

deckListener.startListening({
  // Watch for any action that removes cards from the deck
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { deck } = state.game.currentMatch;
    const threshold = 15;

    // Trigger the refill if we hit the threshold
    if (deck.length < threshold) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

export const selectHeroScore = (state: RootState) =>
  calculateHandValue(state.game.currentMatch.herosHand);

export const selectDealerScore = (state: RootState) =>
  calculateHandValue(state.game.currentMatch.dealersHand);

export const selectOpponentScore = (state: RootState, index: number) => {
  const hand = state.game.currentMatch.opponents[index]?.currentHand || [];
  return calculateHandValue(hand);
};

export default deckListener;
