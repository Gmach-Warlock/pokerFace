import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { AnteMap } from "../../app/assets";
import { subtractHeroMoney } from "../profile/profileSlice";
import { addToPot, subtractOpponentMoney } from "../game/gameSlice";

export const performAnteUp = createAsyncThunk(
  "betting/performAnteUp",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const location = state.game.currentMatch.matchLocation;
    const anteAmount = AnteMap[location] || 1;

    dispatch(subtractHeroMoney({ amount: anteAmount }));

    state.game.currentMatch.opponents.forEach((_, index) => {
      dispatch(
        subtractOpponentMoney({ opponentIndex: index, amount: anteAmount }),
      );
    });

    const totalAnte =
      anteAmount * (state.game.currentMatch.opponents.length + 1);
    dispatch(addToPot(totalAnte));
  },
);
