import type { GameInterface } from "../../app/interfaces/gameInterfaces";

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
  state: GameInterface,
  actionType?: string,
) => {
  const match = state.currentMatch;
  const activePlayer = match.players[match.activePlayerIndex];

  console.group(
    `%c[GAME STEP]: ${stage}`,
    "color: #00ffff; font-weight: bold;",
  );
  console.log(
    `%cAction Type: %c${actionType || "N/A"}`,
    "font-weight: bold",
    "color: #ff00ff",
  );
  console.log(`Current Phase: ${match.currentPhase.phase}`);
  console.log(
    `Active Player: ${activePlayer?.name} (Index: ${match.activePlayerIndex})`,
  );
  console.log(`Pot: $${match.pot} | Current Bet: $${match.currentBetOnTable}`);

  // Quick view of all players to check 'isFolded' or 'hasActed'
  console.table(
    match.players.map((p) => ({
      name: p.name,
      money: p.money,
      isFolded: p.currentMatch.isFolded,
      hasActed: p.currentMatch.hasActed,
      lastAction: p.currentMatch.lastAction,
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
