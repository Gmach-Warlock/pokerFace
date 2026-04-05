import type { MatchInterface } from "../../app/interfaces/matchInterfaces";

export function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export const logGameStep = (
  stage: string,
  match: MatchInterface, // Changed from GameInterface to MatchInterface
  actionType?: string,
) => {
  const activePlayer = match.players[match.activePlayerIndex];

  console.group(
    `%c[MATCH STEP]: ${stage}`,
    "color: #00f3ff; font-weight: bold; text-shadow: 0 0 5px #00f3ff;",
  );
  console.log(
    `%cType: %c${match.matchType.toUpperCase()} | Phase: %c${match.currentPhase.phase}`,
    "font-weight: bold",
    "color: #ff00ff",
    "color: #00ff00",
  );
  console.log(
    `Active: ${activePlayer?.name || "None"} (Index: ${match.activePlayerIndex}) action type: ${actionType}`,
  );
  console.log(
    `Pot: $${match.pot} | Table Bet: $${match.currentBetOnTable} | Deck: ${match.deck.length}`,
  );

  // Monitor player status - critical for debugging "stuck" turns
  console.table(
    match.players.map((p) => ({
      name: p.name,
      chips: p.money,
      folded: p.currentMatch.isFolded,
      acted: p.currentMatch.hasActed,
      last: p.currentMatch.lastAction,
    })),
  );

  console.groupEnd();
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
