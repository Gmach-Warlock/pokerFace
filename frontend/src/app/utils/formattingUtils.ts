import type { PlayerInterface } from "../interfaces/matchInterfaces";
import type { MatchType } from "../types/matchTypes";
import type { MatchLocationType } from "../types/worldMapTypes";

export const formatLocation = (text: string): string =>
  text
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const mapFormToMatchSettings = (
  formData: FormData,
  location: MatchLocationType,
  hero: PlayerInterface,
) => ({
  numberOfOpponents: Number(formData.get("number-of-opponents")),
  difficultyLevel: formData.get("difficulty-level") || "normal",
  matchLocation: location,
  matchType: formData.get("matchType") || "draw",
  numberOfDecks: Number(formData.get("number-of-decks")),
  deckStyle: formData.get("deck-style"),
  hero,
});

export const generateMatchId = (
  playerId: string,
  matchType: MatchType,
  location: MatchLocationType,
) => {
  // Format date to be more URL/Database friendly (YYYYMMDD)
  const dateStamp = new Date().toISOString().split("T")[0].replace(/-/g, "");

  // Create a 4-character random suffix
  const entropy = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine components into a slug
  return `${playerId}-${matchType}-${location}-${dateStamp}-${entropy}`.toUpperCase();
};
