export function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

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
