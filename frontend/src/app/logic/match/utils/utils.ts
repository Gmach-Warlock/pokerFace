import type {
  CardInterface,
  PlayerInterface,
  EvaluatedHandInterface,
  MatchInterface,
} from "../../../interfaces/matchInterfaces";
import type { GameInterface } from "../../../interfaces/gameInterfaces";
import { getNPCAction } from "../ai/ai";
import type { MatchLocationType } from "../../../types/worldMapTypes";
import type {
  CurrentLocationType,
  GamePhaseType,
  GamePhaseConfigType,
  MatchType,
} from "../../../types/matchTypes";
import { anteMap, matchPhaseMap } from "../../../assets/match/matchAssets";
import { INITIAL_SESSION_STATS } from "../../../assets/profile/profileAssets";

export const checkLastManStanding = (state: MatchInterface) => {
  const activePlayers = getActivePlayers(state.players);

  if (activePlayers.length === 1 && state.currentPhase.phase !== "showdown") {
    const winner = activePlayers[0];
    winner.money += state.pot;
    state.winnerId = winner.id ?? "";
    state.pot = 0;
    state.currentPhase.phase = "showdown";
    return true;
  }
  return false;
};
export const executeTurn = (
  npc: PlayerInterface,
  evaluation: EvaluatedHandInterface,
  match: MatchInterface,
) => {
  const { difficultyLevel, pot, currentBetOnTable } = match;

  const decision = getNPCAction(
    npc,
    evaluation,
    difficultyLevel,
    pot,
    currentBetOnTable,
  );

  let amount = 0;
  if (decision === "call") {
    amount = Math.max(
      0,
      currentBetOnTable - (npc.currentMatch.currentBet || 0),
    );
  } else if (decision === "raise") {
    amount = currentBetOnTable + 50 - (npc.currentMatch.currentBet || 0);
  }

  return {
    playerId: npc.id,
    type: decision,
    amount: amount,
  };
};
export const getActivePlayers = (players: PlayerInterface[]) => {
  return players.filter((p) => !p.currentMatch.isFolded);
};
export const getCardDestination = (
  matchType: MatchType,
  phase: GamePhaseType,
  playerIndex: number,
): CurrentLocationType => {
  const config = (matchPhaseMap as GamePhaseConfigType)[matchType]?.[phase];

  if (config?.target === "board") {
    return "board";
  }

  return `p${playerIndex + 1}` as CurrentLocationType;
};

export const getNextActivePlayerIndex = (match: MatchInterface) => {
  const totalPlayers = match.players.length;
  let nextIndex = (match.activePlayerIndex + 1) % totalPlayers;

  for (let i = 0; i < totalPlayers; i++) {
    const player = match.players[nextIndex];

    if (!player.currentMatch.isFolded && !player.currentMatch.isAllin) {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % totalPlayers;
  }

  return match.activePlayerIndex; // Fallback
};

export const handleFoldLogic = (state: GameInterface, playerId: string) => {
  const match = state.currentMatch;

  if (playerId === match.players[0].id) {
    state.currentlyDisplayed = "postGame";
    return;
  } else {
    const opponent = match.players.find((o) => o.id === playerId);
    if (opponent) opponent.currentMatch.isFolded = true;
  }

  const activeOpponents = match.players.filter(
    (opp) => !opp.currentMatch.isFolded,
  );
  const heroFolded = state.currentlyDisplayed === "postGame";

  if (activeOpponents.length === 0 && !heroFolded) {
    match.players[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  } else if (activeOpponents.length === 1 && heroFolded) {
    activeOpponents[0].money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  }
};

export const logGameStep = (
  stage: string,
  match: MatchInterface,
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

export const pickAnteAmount = (location: MatchLocationType) => {
  const amount = anteMap[location as keyof typeof anteMap];

  return amount;
};

export const pickWeightedIndex = (arrayLength: number): number => {
  const skewedRandom = Math.pow(Math.random(), 2);
  return Math.floor(skewedRandom * arrayLength);
};

export const prepareNewPhase = (
  state: MatchInterface,
  nextPhase: GamePhaseType,
) => {
  state.currentPhase.phase = nextPhase;
  state.currentBetOnTable = 0;
  state.lastRaiserId = null;
  state.players.forEach((p) => {
    p.currentMatch.hasActed = false;
    p.currentMatch.currentBet = 0;
  });
  state.activePlayerIndex = getNextActivePlayerIndex(state);
  state.actionMessage = `Phase: ${nextPhase.toUpperCase()}`;
  state.messageId += 1;
};

export const shuffleDeck = (deck: CardInterface[]): CardInterface[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
export const spawnLocation = (id: MatchLocationType) => ({
  id,
  stats: { ...INITIAL_SESSION_STATS },
  bossDefeated: false,
  rank: 0,
});
