import type {
  CardInterface,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";
import type {
  BettingActionType,
  DifficultyType,
} from "../../../types/matchTypes";
import { evaluatePokerHand } from "../evaluators/evaluators";

export const getAIDiscardIndices = (hand: CardInterface[]): number[] => {
  const evaluation = evaluatePokerHand(hand);

  if (evaluation.rankValue >= 400) return [];

  const numericValues = hand.map((c) => {
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    return typeof c.value === "number" ? c.value : map[c.value] || 0;
  });

  const counts: Record<number, number> = {};
  numericValues.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

  const keeperValues = Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([val]) => Number(val));

  const indicesToDiscard: number[] = [];

  hand.forEach((card, index) => {
    const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
    const val =
      typeof card.value === "number" ? card.value : map[card.value] || 0;

    if (!keeperValues.includes(val)) {
      indicesToDiscard.push(index);
    }
  });

  if (indicesToDiscard.length === 5) {
    const highCardVal = Math.max(...numericValues);
    const highCardIndex = numericValues.indexOf(highCardVal);
    return indicesToDiscard.filter((i) => i !== highCardIndex);
  }

  return indicesToDiscard.slice(0, 4);
};

export const getNPCAction = (
  npc: PlayerInterface,
  evaluation: { rankValue: number; label: string }, // Matches evaluatePokerHand
  currentDifficulty: DifficultyType,
  currentPot: number,
  currentBet: number,
): BettingActionType => {
  const { rankValue } = evaluation;

  const normalizedStrength = (rankValue / 900) * 100;

  const amountToCall = currentBet - (npc.currentMatch.currentBet || 0);
  const canCheck = amountToCall <= 0;

  const defaultPassAction: BettingActionType = canCheck ? "check" : "call";
  const defaultFailAction: BettingActionType = canCheck ? "check" : "fold";
  console.log(amountToCall, normalizedStrength);
  switch (currentDifficulty) {
    case "easy":
      if (rankValue >= 200) return "raise";
      if (rankValue >= 100) return "call";

      if (rankValue < 300 && amountToCall > 60) return "fold";
      return defaultPassAction;

    case "normal":
      // Raise on Pair or better
      if (rankValue >= 100) {
        console.log(`${currentBet} ${evaluation}, ${normalizedStrength} raise`);
        return "raise";
      }
      // Call if we have a decent high card or the pot is worth it
      if (normalizedStrength > 15) {
        console.log(`${currentBet} ${evaluation}, ${normalizedStrength} call`);
        return "call";
      }
      return defaultFailAction;

    case "hard": {
      const isTroll = npc.npcTraits?.general.isTroll ?? 0;
      // Bluffing logic
      if (isTroll && Math.random() < 0.3) return "raise";

      const potCommitment = currentPot > 500 ? 10 : 0;

      if (rankValue >= 300 || normalizedStrength + potCommitment > 85)
        return "raise";
      if (normalizedStrength + potCommitment > 50) return "call";
      return defaultFailAction;
    }

    default:
      return defaultPassAction;
  }
};

/* function getSituation(player: PlayerInterface, personality: CharacterPersonality): CurrentSituationType {
  // 1. Priority Checks (Time-sensitive/Action-sensitive)
  if (isHeroTakingTooLong) return "nagging";
  
  // 2. Performance Checks
  if (player.sessionStats.currentWinStreak >= 2) return "gloating";
  if (player.sessionStats.currentLossStreak >= 2) return "sulking";

  // 3. Hand Strength (Your existing logic)
  const strength = calculateHandStrength(player.currentHand);
  if (strength > 0.8) return "strongHand";
  if (strength < 0.2) return "weakHand";

  return "neutral";
} */

/*   const shouldSpeak = Math.random() < personality.unique.frequency;

if (shouldSpeak) {
  const situation = getSituation(player, personality);
  const dialogueOptions = dialogueMap[theme][situation]; // Pulled from your DialogueInterface
  const randomLine = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
  displayDialogue(player.id, randomLine);
} */
