import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  performAnteUp,
  advancePhase,
  dealRound,
  finishMatch,
  markNpcDiscard,
} from "./matchSlice";
import type { RootState } from "../../app/store/store";

import { selectNpcDiscards } from "./matchSelectors";
import { logGameStep } from "../../functions/utils/utils";

export const processArenaAction = createAsyncThunk(
  "match/processArenaAction", // Changed prefix to match/ for consistency
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    logGameStep("Thunk Triggered", state.game);

    // FIX: Pull from state.match instead of state.game
    const { currentPhase, matchLocation } = state.match;
    const { phase } = currentPhase;

    switch (phase) {
      case "ante":
        // FIX: Reference state.match for location
        dispatch(performAnteUp({ location: matchLocation }));
        dispatch(dealRound());
        dispatch(advancePhase());
        break;

      case "draw": {
        // selectNpcDiscards already uses state.match internally
        // if you updated it in our previous step!
        const npcDiscards = selectNpcDiscards(state);

        npcDiscards.forEach((indices, idx) => {
          // idx 0 is usually the Hero, so we skip them
          if (idx > 0 && indices.length > 0) {
            dispatch(
              markNpcDiscard({
                playerIndex: idx,
                cardIndices: indices,
              }),
            );
          }
        });

        dispatch(dealRound());
        dispatch(advancePhase());
        break;
      }

      case "showdown":
        dispatch(finishMatch());
        break;

      default:
        dispatch(advancePhase());
        break;
    }
  },
);
