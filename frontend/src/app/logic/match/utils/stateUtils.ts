import type {
  MatchInterface,
  PlayerInterface,
} from "../../../interfaces/matchInterfaces";

export const canAdvancePhaseLogic = (match: MatchInterface): boolean => {
  const { players, currentBetOnTable, currentPhase } = match.currentHand;
  const phase = currentPhase.phase.toLowerCase();

  if (phase === "deal" || phase === "showdown" || phase === "notingameyet") {
    return true;
  }

  const activeContestants = players.filter((p) => !p.general.isDealer);

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
  let searchIdx = (dealerIdx + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    const candidate = players[searchIdx];

    if (!candidate.general.isDealer && !candidate.state.isFolded) {
      return searchIdx;
    }

    searchIdx = (searchIdx + 1) % players.length;
  }

  return 0;
};

export const rotateDealerIndex = (
  currentDealerIdx: number,
  totalPlayers: number,
): number => {
  if (currentDealerIdx <= 0) {
    return totalPlayers - 1;
  }
  return currentDealerIdx - 1;
};
