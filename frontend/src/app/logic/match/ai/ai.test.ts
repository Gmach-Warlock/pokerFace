import { describe, it, expect } from "vitest";
import { getNPCAction } from "./ai";
import type { PlayerInterface } from "../../../interfaces/matchInterfaces";

describe("NPC Betting Decision Logic", () => {
  const mockNPC = {
    id: "npc-1",
    npcTraits: { general: { isTroll: 0 } },
    currentMatch: { currentBet: 0 },
  } as unknown as PlayerInterface;

  it("Easy NPC should fold if the bet is too high (> 60) and hand is weak", () => {
    const evaluation = { rankValue: 50, label: "High Card" };
    const action = getNPCAction(mockNPC, evaluation, "easy", 100, 70);

    expect(action).toBe("fold");
  });

  it("Hard NPC should raise if they have a strong hand (Rank >= 300)", () => {
    const evaluation = { rankValue: 350, label: "Three of a Kind" };
    const action = getNPCAction(mockNPC, evaluation, "hard", 500, 20);

    expect(action).toBe("raise");
  });
});
