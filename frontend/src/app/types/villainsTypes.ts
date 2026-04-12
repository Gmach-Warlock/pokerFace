export type PlayStyleType = "passive" | "loose" | "tight" | "aggressive";

export type VillainThemeType =
  | "classic"
  | "gritty"
  | "modern"
  | "classy"
  | "pro";

export type ClassicNameType =
  | "Arthur"
  | "Eleanor"
  | "Raymond"
  | "Martha"
  | "Harvey"
  | "Janet"
  | "Greg"
  | "Bonnnie"
  | "Kyle"
  | "Mary"
  | "Clark"
  | "Donna";

export type ClassyNameType =
  | "Julian"
  | "Beatrice"
  | "Bob"
  | "Madelaine"
  | "Gemma"
  | "Hubert"
  | "Lindsay"
  | "Veronica"
  | "Winthrop"
  | "Joseph"
  | "Gerald"
  | "Kathleen"
  | "Derek";

export type GrittyNameType =
  | "Jax"
  | "Mickey"
  | "Sloane"
  | "Rocco"
  | "Vinnie"
  | "Ripley"
  | "Moxie"
  | "Gunnar"
  | "Jinx"
  | "Aria"
  | "Sledge"
  | "Vanna"
  | "Steel"
  | "Gutter"
  | "Tank"
  | "Li";

export type ModernNameType =
  | "Leo"
  | "Sienna"
  | "Kai"
  | "Ezra"
  | "Luna"
  | "Ryker"
  | "Nova"
  | "Xiomar"
  | "Rhodes"
  | "Zadie"
  | "Merrick"
  | "Lana"
  | "Vaughn";
export type PlayerEmotionType =
  | "zen" // Default/Neutral
  | "hyper" // On a heater / high win streak
  | "tilted" // After a big loss or bad beat
  | "stoic" // Hiding a strong hand (Bluffing/StrongHand)
  | "shook" // Just got raised big / low chips
  | "smug" // Gloating / Egging others on
  | "salty" // Sulking / Nagging
  | "wired" // High stakes / thinking hard
  | "deadpan";
export type ProNameType =
  | "Doyle"
  | "Stu"
  | "Phil"
  | "Johnny"
  | "Annette"
  | "Barbara"
  | "Linda"
  | "Carlos"
  | "Jennifer"
  | "Michael";

export type DialogueToneType =
  | "aggressive" // Used when "egging" or "bluffing"
  | "defensive" // Used when "shook" or "weakHand"
  | "dismissive" // Used when "gloating" or "neutral"
  | "sympathetic" // Used for "nagging" (mocking sympathy)
  | "cryptic"; // The high-level "Poker Face" dialogue
