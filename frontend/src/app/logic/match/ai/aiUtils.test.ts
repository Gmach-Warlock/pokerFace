import { describe, it, expect } from "vitest";
import { getAIDiscardIndices } from "./ai";
import type { CardInterface } from "../../../interfaces/matchInterfaces";

describe("AI Discard Logic", () => {
  it("should discard nothing if the hand is strong (Rank >= 400)", () => {
    // Mocking a Straight or better
    const hand = [
      { value: 10, suit: "heart" },
      { value: "J", suit: "heart" },
      { value: "Q", suit: "heart" },
      { value: "K", suit: "heart" },
      { value: "A", suit: "heart" },
    ] as CardInterface[];

    const result = getAIDiscardIndices(hand);
    expect(result).toEqual([]);
  });

  it("should keep a pair and discard the rest", () => {
    const hand = [
      { value: 8, suit: "heart" },
      { value: 8, suit: "spade" }, // Pair
      { value: 2, suit: "club" },
      { value: 5, suit: "diamond" },
      { value: "K", suit: "heart" },
    ] as CardInterface[];

    const result = getAIDiscardIndices(hand);
    // Should discard indices 2, 3, and 4
    expect(result).toEqual([2, 3, 4]);
  });
});
