import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  performAnteUp,
  advancePhase,
  dealRound,
  finishMatch,
  markNpcDiscard,
} from "./matchSlice";
import type { RootState } from "../../app/store";

import { selectNpcDiscards } from "./matchSelectors";

export const processArenaAction = createAsyncThunk(
  "game/processArenaAction",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { phase } = state.game.currentMatch.currentPhase;

    switch (phase) {
      case "ante":
        dispatch(
          performAnteUp({ location: state.game.currentMatch.matchLocation }),
        );
        dispatch(dealRound());
        dispatch(advancePhase());
        break;

      case "draw": {
        const npcDiscards = selectNpcDiscards(state);

        npcDiscards.forEach((indices, idx) => {
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
