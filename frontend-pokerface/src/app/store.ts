import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/game/gameSlice";
import authorizeReducer from "../features/authorize/authorizeSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    authorize: authorizeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
