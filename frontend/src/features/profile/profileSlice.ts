import { createSlice } from "@reduxjs/toolkit";
import type {
  CardInterface,
  ChipMapInterface,
  DeckStyleType,
  MatchLocationType,
  NextLevelXpType,
} from "../../app/types";
import { startingChips } from "../../app/assets";
import { type PayloadAction } from "@reduxjs/toolkit";

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
    currentHand: CardInterface[];
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
    currentHand: [],
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
    subtractHeroMoney: (state, action: PayloadAction<{ amount: number }>) => {
      state.playerData.money -= action.payload.amount;
      // Here you would also call your chip calculator logic to update state.playerData.chips
    },
  },
});

export const { createUser, subtractHeroMoney } = profileSlice.actions;
export default profileSlice.reducer;
