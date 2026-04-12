import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  advancePhase,
  checkAndRefillDeck,
  dealCard,
  dealRound,
  handleBet,
} from "../../features/match/matchSlice";
import type { RootState } from "../store/store";
import { processArenaAction } from "../../features/match/matchThunks";
import {
  selectCurrentPhaseName,
  selectIsBettingPhase,
  selectIsRoundOver,
  selectIsHerosTurn,
  selectCurrentTurnPlayer,
} from "../../features/match/selectors/stateSelectors";

const deckListener = createListenerMiddleware();

deckListener.startListening({
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    if (state.match.currentHand.deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});
deckListener.startListening({
  matcher: isAnyOf(handleBet, advancePhase),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    const phaseName = selectCurrentPhaseName(state);
    const isBettingPhase = selectIsBettingPhase(state);
    const isHerosTurn = selectIsHerosTurn(state);
    const isRoundOver = selectIsRoundOver(state);
    const currentPlayer = selectCurrentTurnPlayer(state);
    const isSystemPhase = ["ante", "deal", "draw"].includes(phaseName);

    if (isHerosTurn && !isRoundOver) {
      console.log("MIDDLEWARE: Hero turn detected. Standing by...");
      return;
    }

    if (isSystemPhase) {
      await listenerApi.delay(1000);
      listenerApi.dispatch(processArenaAction());
      return;
    }

    if (isBettingPhase) {
      if (isRoundOver) {
        if (action.type !== advancePhase.type) {
          console.log("!!! Round complete. Advancing Phase !!!");
          await listenerApi.delay(1000);
          listenerApi.dispatch(advancePhase());
        }
        return;
      }

      if (currentPlayer?.general.isDealer) {
        listenerApi.dispatch(processArenaAction());
        return;
      }

      if (
        currentPlayer?.general.type === "computer" &&
        !currentPlayer.state.hasActed
      ) {
        await listenerApi.delay(1200);
        listenerApi.dispatch(processArenaAction());
      }
    }
  },
});

export default deckListener;
