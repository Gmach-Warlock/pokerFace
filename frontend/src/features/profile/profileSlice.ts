import { createSlice } from "@reduxjs/toolkit";
import type {
  CardInterface,
  DeckStyleType,
  NextLevelXpType,
} from "../../app/types";

interface ProfileInterface {
  authorized: boolean;
  username: string;
  email: string;
  password: string;
  level: number;
  xp: number;
  nextLevel: NextLevelXpType;
  wins: number;
  losses: number;
  availableDecks: DeckStyleType[];
  currentHand: CardInterface[] | null;
}

const initialAuthorizeState: ProfileInterface = {
  authorized: true,
  username: "gary",
  email: "gary@mail.com",
  password: "weakpassword",
  level: 1,
  xp: 0,
  nextLevel: 5,
  wins: 0,
  losses: 0,
  availableDecks: ["arrowBolt"],
  currentHand: null,
};

const profileSlice = createSlice({
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

export const { createUser } = profileSlice.actions;
export default profileSlice.reducer;
