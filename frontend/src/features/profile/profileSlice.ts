import { createSlice } from "@reduxjs/toolkit";
import type { SessionStatsInterface } from "../../app/interfaces/matchInterfaces";
import type { ProfileInterface } from "../../app/interfaces/profileInterfaces";
import { startingChips } from "../../app/assets/matchAssets";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialProfileState: ProfileInterface = {
  meta: {
    authorized: true,
    id: "abcde123",
    username: "gary",
    email: "gary@mail.com",
    password: "",
  },
  playerData: {
    id: "abcde123",
    name: "GMach",
    type: "human",
    money: 500,
    // --- NESTED MATCH DATA ---
    currentMatch: {
      chips: startingChips,
      currentBet: 0,
      hasActed: false,
      isFolded: false,
      isAllin: false,
      currentHand: [],
      sessionStats: {} as SessionStatsInterface,
    },
    // --- NESTED PERMANENT DATA ---
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 5,
      plei: 0,
      availableLocations: ["shelter", "halls"],
      availableDecks: ["arrowBolt", "inBloom", "theFlyingCow"],
      currentDeckChoice: "arrowBolt",
      locationsVisited: [],
      locationsMastered: [],
      stats: {
        lifetime: {} as SessionStatsInterface,
      },
      // Ensure achievements are initialized here if they aren't coming from a DB
      achievements: [],
      isSpecial: false,
    },
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    addExperience: (state, action: PayloadAction<number>) => {
      if (state.playerData.profile) {
        state.playerData.profile.xp += action.payload;
        // You can add level-up logic here later!
      }
    },
    createUser: (state, action) => {
      state.meta.username = action.payload.username;
      state.meta.email = action.payload.email;
      state.meta.password = action.payload.password;
      state.meta.authorized = true;
    },
    updateAchievements: (
      state,
      action: PayloadAction<SessionStatsInterface>,
    ) => {
      const stats = action.payload;
      const profile = state.playerData.profile;

      if (!profile || !profile.achievements) return;

      profile.achievements.forEach((ach) => {
        if (ach.isUnlocked) return;

        // Trace change: plei is now inside profile
        if (ach.id === "high_roller_1") {
          ach.currentProgress = profile.plei ?? 0;
        }

        if (ach.id === "bluff_master") {
          ach.currentProgress = stats.bluffsSucceeded;
        }

        // Check for Unlock
        if (ach.currentProgress >= ach.targetValue) {
          ach.isUnlocked = true;
          // Trace change: updating plei inside the nest
          if (profile.plei !== null) {
            profile.plei += ach.rewardPlei;
          }
        }
      });
    },
    // Logic for updating money or match status can go here
    updateMoney: (state, action: PayloadAction<number>) => {
      state.playerData.money += action.payload;
    },
  },
});

export const { addExperience, createUser, updateAchievements, updateMoney } =
  profileSlice.actions;

export default profileSlice.reducer;
