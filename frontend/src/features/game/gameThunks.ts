import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectCurrentPhase, selectMatchLocation } from "./gameSelectors";
import { performAnteUp, advancePhase, dealRound } from "./gameSlice";
import type { RootState } from "../../app/store";

export const processArenaAction = createAsyncThunk(
  "game/processArenaAction",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;

    const phase = selectCurrentPhase(state);
    const matchLocation = selectMatchLocation(state);

    switch (phase) {
      case "ante":
        dispatch(performAnteUp({ location: matchLocation }));
        dispatch(advancePhase());
        break;
      case "deal":
        dispatch(dealRound());
        dispatch(advancePhase());
        break;
      case "draw":
        dispatch(dealRound());
        dispatch(advancePhase());
        break;
      default:
        dispatch(advancePhase());
        break;
    }
  },
);
