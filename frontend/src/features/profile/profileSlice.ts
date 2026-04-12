import { createSlice } from "@reduxjs/toolkit";
import type {
  ProfileInterface,
  SessionStatsInterface,
} from "../../app/interfaces/profileInterfaces";
import { startingChips } from "../../app/assets/match/matchAssets";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  INITIAL_LIFETIME_STATS,
  INITIAL_SESSION_STATS,
} from "../../app/assets/profile/profileAssets";

const initialProfileState: ProfileInterface = {
  meta: {
    authorized: true,
    id: "abcde123",
    username: "gary",
    email: "gary@mail.com",
    password: "",
  },
  playerData: {
    general: {
      id: "abcde123",
      name: "GMach",
      type: "human",
      isDealer: false,
    },
    state: {
      hand: [],
      chips: startingChips,
      currentBet: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
      lastAction: "check",
      lastActionValue: 0,
      isDiscarding: false,
      position: 0,
    },
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 5,
      money: 1000,
      plei: 0,
      availableLocations: ["shelter", "halls"],
      availableDecks: ["arrowBolt", "inBloom", "theFlyingCow"],
      currentDeckChoice: "arrowBolt",
      locationsVisited: [],
      locationsMastered: [],
      isSpecial: false,
    },
    flags: {
      isInitialLoad: true,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: false,
    },
    stats: {
      lifetime: INITIAL_LIFETIME_STATS,
      session: INITIAL_SESSION_STATS,
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
      }
    },

    createUser: (state, action) => {
      state.meta.username = action.payload.username;
      state.meta.email = action.payload.email;
      state.meta.password = action.payload.password;
      state.meta.authorized = true;
    },

    syncMatchResults: (
      state,
      action: PayloadAction<{ money: number; xp: number }>,
    ) => {
      const { money, xp } = action.payload;
      if (state.playerData.profile) {
        state.playerData.profile.money = money;

        state.playerData.profile.xp += xp;

        if (state.playerData.profile.xp >= state.playerData.profile.nextLevel) {
          state.playerData.profile.level += 1;
          state.playerData.profile.xp = 0;
          state.playerData.profile.nextLevel = Math.floor(
            state.playerData.profile.nextLevel * 1.5,
          );
        }
      }
    },

    updateAchievements: (
      state,
      action: PayloadAction<SessionStatsInterface>,
    ) => {
      const stats = action.payload;
      const profile = state.playerData;

      if (!profile || !profile.achievements) return;

      profile.achievements.forEach((ach) => {
        if (ach.isUnlocked) return;

        if (ach.id === "high_roller_1") {
          ach.currentProgress = profile.profile.plei ?? 0;
        }

        if (ach.id === "bluff_master") {
          ach.currentProgress = stats.activity.bluffsSucceeded;
        }

        if (ach.currentProgress >= ach.targetValue) {
          ach.isUnlocked = true;
          if (profile.profile.plei !== null) {
            profile.profile.plei += ach.rewardPlei;
          }
        }
      });
    },

    updateMoney: (state, action: PayloadAction<number>) => {
      state.playerData.profile.money += action.payload;
    },
  },
});

export const {
  addExperience,
  createUser,
  syncMatchResults,
  updateAchievements,
  updateMoney,
} = profileSlice.actions;

export default profileSlice.reducer;
