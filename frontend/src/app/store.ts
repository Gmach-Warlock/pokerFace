import { configureStore } from "@reduxjs/toolkit";
import authorizeReducer from "../features/profile/profileSlice";
import gameReducer from "../features/game/gameSlice";
import profileReducer from "../features/profile/profileSlice";
import deckListener from "./middleware";

export const store = configureStore({
  reducer: {
    authorize: authorizeReducer,
    game: gameReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(deckListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
