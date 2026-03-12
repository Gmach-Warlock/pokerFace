import { createSlice } from "@reduxjs/toolkit";
import type { DeckStyleType } from "../../app/types";

interface AuthorizeInterface {
  authorized: boolean;
  username: string;
  email: string;
  password: string;
  level: number;
  xp: number;
  availableDecks: DeckStyleType[];
}

const initialAuthorizeState: AuthorizeInterface = {
  authorized: true,
  username: "",
  email: "",
  password: "",
  level: 1,
  xp: 0,
  availableDecks: ["arrowBolt"],
};

const authorizeSlice = createSlice({
  name: "authorize",
  initialState: initialAuthorizeState,
  reducers: {
    createUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.authorized = true;
    },
  },
});

export const { createUser } = authorizeSlice.actions;
export default authorizeSlice.reducer;
