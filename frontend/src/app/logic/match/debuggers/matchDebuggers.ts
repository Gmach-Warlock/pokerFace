import type { MatchInterface } from "../../../interfaces/matchInterfaces";

export const logBettingState = (context: string, match: MatchInterface) => {
  const activePlayers = match.players.filter((p) => !p.currentMatch.isFolded);

  console.group(
    `%c BETTING DEBUGGER: ${context} `,
    "background: #222; color: #bada55; font-weight: bold;",
  );
  console.log(`Current Phase: ${match.currentPhase.phase}`);
  console.log(`Table Bet: $${match.currentBetOnTable}`);
  console.log(`Pot: $${match.pot}`);
  console.log(
    `Active Player Index: ${match.activePlayerIndex} (${match.players[match.activePlayerIndex]?.name})`,
  );

  console.table(
    activePlayers.map((p) => ({
      Name: p.name,
      Type: p.type,
      Money: `$${p.money}`,
      CurrentBet: `$${p.currentMatch.currentBet}`,
      HasActed: p.currentMatch.hasActed,
      IsAllIn: p.currentMatch.isAllin,
      MatchesTable:
        p.currentMatch.currentBet === match.currentBetOnTable ? "✅" : "❌",
    })),
  );

  const allActed = activePlayers.every((p) => p.currentMatch.hasActed);
  const betsEqual = activePlayers.every(
    (p) => p.currentMatch.currentBet === match.currentBetOnTable,
  );

  console.log(`Round Over Criteria: 
    - All Acted: ${allActed ? "✅" : "❌"} 
    - Bets Equal: ${betsEqual ? "✅" : "❌"}`);

  if (allActed && !betsEqual) {
    console.warn(
      "⚠️ LOGIC HANG DETECTED: Everyone acted but bets are not equal!",
    );
  }

  console.groupEnd();
};
