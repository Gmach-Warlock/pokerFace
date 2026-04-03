import { createSlice } from "@reduxjs/toolkit";
import type {
  DeckStyleType,
  MatchLocationType,
  NextLevelXpType,
} from "../../app/types";
import type {
  AchievementInterface,
  CardInterface,
  ChipMapInterface,
  SessionStatsInterface,
} from "../../app/interfaces";
import { startingChips } from "../../app/assets";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    achievements: AchievementInterface[];
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
    availableDecks: ["arrowBolt", "inBloom", "theFlyingCow"],
    currentDeckChoice: "arrowBolt",
    availableLocations: ["shelter", "halls"],
    plei: 0,
    achievements: [],
  },
};

const profileSlice = createSlice({
  name: "authorize",
  initialState: initialAuthorizeState,
  reducers: {
    addExperience: () => {},
    createUser: (state, action) => {
      state.meta.username = action.payload.username;
      state.meta.email = action.payload.email;
      state.meta.password = action.payload.password;
      state.meta.authorized = true;
    },
    unlockLocation: () => {},
    updateAchievements: (
      state,
      action: PayloadAction<SessionStatsInterface>,
    ) => {
      const stats = action.payload;

      state.playerData.achievements.forEach((ach) => {
        if (ach.isUnlocked) return; // Skip already finished ones

        // Logic for specific IDs
        if (ach.id === "high_roller_1") {
          ach.currentProgress = state.playerData.plei;
        }

        if (ach.id === "bluff_master") {
          ach.currentProgress = stats.bluffsSucceeded;
        }

        // Check for Unlock
        if (ach.currentProgress >= ach.targetValue) {
          ach.isUnlocked = true;
          state.playerData.plei += ach.rewardPlei;
          // You could also trigger a "Pop-up" message here!
        }
      });
    },
    updateLocationStats: () => {},
  },
});

export const {
  addExperience,
  createUser,
  unlockLocation,
  updateLocationStats,
} = profileSlice.actions;
export default profileSlice.reducer;
