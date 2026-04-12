import type {
  MatchInterface,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";

export const canAdvancePhaseLogic = (match: MatchInterface): boolean => {
  const { players, currentBetOnTable, currentPhase } = match.currentHand;
  const phase = currentPhase.phase.toLowerCase();

  // --- 1. THE SYSTEM PASS ---
  // If we are dealing cards or showing hands, the guard should always stay open.
  if (phase === "deal" || phase === "showdown" || phase === "notingameyet") {
    return true;
  }

  const activeContestants = players.filter((p) => !p.general.isDealer);

  // --- 2. ANTE LOGIC ---
  if (phase === "ante") {
    return activeContestants.every((p) => p.state.hasActed);
  }

  const playersWhoMustAct = activeContestants.filter(
    (p) => !p.state.isFolded && !p.state.isAllIn,
  );

  const everyoneActed = playersWhoMustAct.every((p) => p.state.hasActed);
  const betsMatch = playersWhoMustAct.every(
    (p) => p.state.currentBet === currentBetOnTable,
  );

  return everyoneActed && betsMatch;
};

export const getInitialActivePlayerIndex = (
  players: PlayerInterface[],
  dealerIdx: number,
): number => {
  // Start searching from the next seat (index + 1)
  let searchIdx = (dealerIdx + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    const candidate = players[searchIdx];

    // Logic: A player can start if they aren't the dealer
    // and haven't folded (or are not out of money)
    if (!candidate.general.isDealer && !candidate.state.isFolded) {
      return searchIdx;
    }

    // Move to the next seat if the candidate was the dealer or folded
    searchIdx = (searchIdx + 1) % players.length;
  }

  return 0; // Default fallback to Hero
};

export const rotateDealerIndex = (
  currentDealerIdx: number,
  totalPlayers: number,
): number => {
  // If dealer is at 0, they wrap to the last seat (index length - 1)
  if (currentDealerIdx <= 0) {
    return totalPlayers - 1;
  }
  return currentDealerIdx - 1;
};
