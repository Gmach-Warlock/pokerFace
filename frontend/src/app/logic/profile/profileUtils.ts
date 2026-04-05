import {
  getXpRequiredForLevel,
  MAX_LEVEL,
} from "../../assets/profile/profileAssets";
import type { PlayerInterface } from "../../interfaces/matchInterfaces";

export const awardXp = (player: PlayerInterface, amount: number) => {
  if (!player.profile || player.profile.level >= MAX_LEVEL) return;

  player.profile.xp += amount;

  // Level Cycling: Keep leveling up as long as we have enough XP
  let nextLevelThreshold = getXpRequiredForLevel(player.profile.level);

  while (
    player.profile.xp >= nextLevelThreshold &&
    player.profile.level < MAX_LEVEL
  ) {
    player.profile.xp -= nextLevelThreshold;
    player.profile.level += 1;

    // Recalculate for the next level in the cycle
    nextLevelThreshold = getXpRequiredForLevel(player.profile.level);

    console.log(`LEVEL UP! Gary is now Level ${player.profile.level}`);
    // Trigger any "Unlock" toast or sound effects here
  }
};
