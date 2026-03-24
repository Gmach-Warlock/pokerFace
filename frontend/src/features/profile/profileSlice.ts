import { createSlice } from "@reduxjs/toolkit";
import type {
  CardInterface,
  DeckStyleType,
  NextLevelXpType,
} from "../../app/types";

interface ProfileInterface {
  meta: {
    authorized: boolean;
    username: string;
    email: string;
    password: string;
  };
  playerData: {
    level: number;
    xp: number;
    nextLevel: NextLevelXpType;
    wins: number;
    losses: number;
    availableDecks: DeckStyleType[];
    currentDeckChoice: DeckStyleType;
    currency: number;
    currentHand: CardInterface[] | null;
  };
}

const initialAuthorizeState: ProfileInterface = {
  meta: {
    authorized: true,
    username: "gary",
    email: "gary@mail.com",
    password: "weakpassword",
  },
  playerData: {
    level: 1,
    xp: 0,
    nextLevel: 5,
    wins: 0,
    losses: 0,
    availableDecks: ["arrowBolt"],
    currentDeckChoice: "arrowBolt",
    currency: 0,
    currentHand: null,
  },
};

const profileSlice = createSlice({
  name: "authorize",
  initialState: initialAuthorizeState,
  reducers: {
    createUser: (state, action) => {
      state.meta.username = action.payload.username;
      state.meta.email = action.payload.email;
      state.meta.password = action.payload.password;
      state.meta.authorized = true;
    },
  },
});

export const { createUser } = profileSlice.actions;
export default profileSlice.reducer;
