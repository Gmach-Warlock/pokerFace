import type { VillainThemeType } from "../types/villainsTypes";
import type { SituationType } from "../global/global";

export interface CharacterPersonalityInterface {
  situations: Record<SituationType, number>;
  tells: {
    physical: string;
    frequency: number;
  };
  unique: {
    lines: Record<SituationType, string>;
    frequency: number;
  };
  tilt: {
    limit: number;
    comment: string;
    multiplier: number;
  };
}

// 2. A flat map of characters (e.g., just the "Classic" set)
export type PersonalityMap = Record<string, CharacterPersonalityInterface>;

// 3. The Master Map that organizes everything by Theme
// This allows you to call: allPersonalities['classic']['Arthur']
export type PersonalityMapInterface = Record<VillainThemeType, PersonalityMap>;

// 4. Your Global Dialogue Archetypes (for fallbacks)
export interface DialogueInterface {
  gritty: string[];
  classic: string[];
  modern: string[];
  classy: string[];
  pro: string[];
}

export type SituationalDialogueInterface = Record<
  SituationType,
  DialogueInterface
>;
