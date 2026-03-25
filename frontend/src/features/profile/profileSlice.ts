import { createSlice } from "@reduxjs/toolkit";
import type {
  CardInterface,
  ChipMapInterface,
  DeckStyleType,
  MatchLocationType,
  NextLevelXpType,
} from "../../app/types";
import { startingChips } from "../../app/assets";

interface ProfileInterface {
  meta: {
    authorized: boolean;
    id: string;
    username: string;
    email: string;
    password: string;
  };
  playerData: {
    id: string;
    name: string;
    type: "human";
    cards: CardInterface[];
    money: number;
    chips: ChipMapInterface;
    level: number;
    xp: number;
    nextLevel: NextLevelXpType;
    wins: number;
    losses: number;
    availableDecks: DeckStyleType[];
    currentDeckChoice: DeckStyleType;
    availableLocations: MatchLocationType[];
    plei: number;
    currentHand: CardInterface[] | null;
  };
}

const initialAuthorizeState: ProfileInterface = {
  meta: {
    authorized: true,
    id: "abcde123",
    username: "gary",
    email: "gary@mail.com",
    password: "weakpassword",
  },
  playerData: {
    id: "abcde123",
    name: "GMach",
    type: "human",
    cards: [],
    money: 500,
    chips: startingChips,
    level: 1,
    xp: 0,
    nextLevel: 5,
    wins: 0,
    losses: 0,
    availableDecks: ["arrowBolt"],
    currentDeckChoice: "arrowBolt",
    availableLocations: ["shelter"],
    plei: 0,
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
