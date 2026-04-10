import type {
  MatchInterface,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";
import type { BettingActionType } from "../../../types/matchTypes";

export const logBettingState = (context: string, match: MatchInterface) => {
  const activePlayers = match.currentHand.players.filter(
    (p) => !p.state.isFolded,
  );

  console.group(
    `%c BETTING DEBUGGER: ${context} `,
    "background: #222; color: #bada55; font-weight: bold;",
  );
  console.log(`Current Phase: ${match.currentHand.currentPhase.phase}`);
  console.log(`Table Bet: $${match.currentHand.currentBetOnTable}`);
  console.log(`Pot: $${match.currentHand.pot}`);
  console.log(
    `Active Player Index: ${match.currentHand.activePlayerIndex} (${match.currentHand.players[match.currentHand.activePlayerIndex]?.general.name})`,
  );

  console.table(
    activePlayers.map((p) => ({
      Name: p.general.name,
      Type: p.general.type,
      Money: `$${p.account.totalMoney}`,
      CurrentBet: `$${p.state.currentBet}`,
      HasActed: p.state.hasActed,
      IsAllIn: p.state.isAllIn,
      MatchesTable:
        p.state.currentBet === match.currentHand.currentBetOnTable
          ? "✅"
          : "❌",
    })),
  );

  const allActed = activePlayers.every((p) => p.state.hasActed);
  const betsEqual = activePlayers.every(
    (p) => p.state.currentBet === match.currentHand.currentBetOnTable,
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

export const logNPCDecision = (
  npc: PlayerInterface,
  evaluation: { rankValue: number; label: string },
  decision: BettingActionType,
  context: { strength: number; toCall: number; pot: number; diff: string },
) => {
  const color = decision === "raise" ? "🟢" : decision === "fold" ? "🔴" : "🟡";

  console.groupCollapsed(
    `${color} NPC ACTION: ${npc.general.name} -> ${decision.toUpperCase()}`,
  );
  console.log(
    `Hand: %c${evaluation.label} (Rank: ${evaluation.rankValue})`,
    "color: #00ff00; font-weight: bold;",
  );
  console.table({
    Difficulty: context.diff,
    "Normalized Strength": `${context.strength.toFixed(2)}%`,
    "Amount to Call": `$${context.toCall}`,
    "Current Pot": `$${context.pot}`,
    "Personality (Troll)": npc.personality?.traits.isTroll ?? 0,
  });
  console.groupEnd();
};
