import type {
  CardInterface,
  PlayerInterface,
  EvaluatedHandInterface,
  MatchInterface,
} from "../../../interfaces/matchInterfaces";
import type { GameInterface } from "../../../interfaces/gameInterfaces";
import { getNPCAction, getAIDiscardIndices } from "../ai/ai";
import type { MatchLocationType } from "../../../types/worldMapTypes";
import type {
  CurrentLocationType,
  MatchPhaseType,
  MatchPhaseConfigType,
  MatchType,
} from "../../../types/matchTypes";
import { anteMap, matchPhaseMap } from "../../../assets/match/matchAssets";
import { INITIAL_SESSION_STATS } from "../../../assets/profile/profileAssets";
import { createChips } from "../../factory/factoryFunctions";

export const awardPotToPlayer = (state: MatchInterface, playerId: string) => {
  const winner = state.currentHand.players.find(
    (p) => p.general.id === playerId,
  );
  const potAmount = state.currentHand.pot;

  if (winner && potAmount > 0) {
    // 1. Update the Master Balance
    winner.profile.money += potAmount;

    // 2. Update the Visual Chips
    const winningChips = createChips(potAmount);
    Object.keys(winningChips).forEach((color) => {
      const key = color as keyof typeof winningChips;
      winner.state.chips[key] += winningChips[key];
    });

    // 3. Record for UI/Results
    state.results.winnerId = winner.general.id;
    state.results.lastWinAmount = potAmount;

    // 4. Reset table
    state.currentHand.pot = 0;
  }
};

export const checkLastManStanding = (state: MatchInterface) => {
  const activePlayers = getActivePlayers(state.currentHand.players);

  // If only 1 person hasn't folded
  if (
    activePlayers.length === 1 &&
    state.currentHand.currentPhase.phase !== "showdown"
  ) {
    const winner = activePlayers[0];

    // Use the unified payout logic
    awardPotToPlayer(state, winner.general.id);

    state.currentHand.currentPhase.phase = "showdown";
    state.currentHand.actionMessage = `${winner.general.name} wins the pot!`;
    return true;
  }
  return false;
};

export const executeTurn = (
  npc: PlayerInterface,
  evaluation: EvaluatedHandInterface,
  match: MatchInterface,
) => {
  const { pot, currentBetOnTable } = match.currentHand;
  const { difficultyLevel } = match.general;

  const decision = getNPCAction(
    npc,
    evaluation,
    difficultyLevel,
    pot,
    currentBetOnTable,
  );

  let amount = 0;
  if (decision === "call") {
    amount = Math.max(0, currentBetOnTable - (npc.state.currentBet || 0));
  } else if (decision === "raise") {
    amount = currentBetOnTable + 50 - (npc.state.currentBet || 0);
  }

  return {
    playerId: npc.general.id,
    type: decision,
    amount: amount,
  };
};
export const getActivePlayers = (players: PlayerInterface[]) => {
  return players.filter((p) => !p.state.isFolded);
};
export const getCardDestination = (
  matchType: MatchType,
  phase: MatchPhaseType,
  playerIndex: number,
): CurrentLocationType => {
  const config = (matchPhaseMap as MatchPhaseConfigType)[matchType]?.[phase];

  if (config?.target === "board") {
    return "board";
  }

  return `p${playerIndex + 1}` as CurrentLocationType;
};

export const getNextActivePlayerIndex = (match: MatchInterface) => {
  const totalPlayers = match.currentHand.players.length;
  // Start checking from the next person
  let nextIndex = (match.currentHand.activePlayerIndex + 1) % totalPlayers;

  for (let i = 0; i < totalPlayers; i++) {
    const player = match.currentHand.players[nextIndex];

    // ELIGIBILITY CRITERIA:
    // 1. Not the Dealer entity (if dealer is a non-playing NPC)
    // 2. Not folded
    // 3. Not all-in
    if (
      !player.general.isDealer &&
      !player.state.isFolded &&
      !player.state.isAllIn
    ) {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % totalPlayers;
  }

  return match.currentHand.activePlayerIndex;
};
export const getNPCDiscardDecision = (player: PlayerInterface): number[] => {
  if (player.general.type === "computer" && !player.state.isFolded) {
    // This is the AI logic that picks which cards to swap
    return getAIDiscardIndices(player.state.hand);
  }
  return [];
};
export const handleFoldLogic = (state: GameInterface, playerId: string) => {
  const match = state.currentMatch;

  if (playerId === match.players[0].general.id) {
    state.currentlyDisplayed = "postGame";
    return;
  } else {
    const opponent = match.players.find((o) => o.general.id === playerId);
    if (opponent) opponent.state.isFolded = true;
  }

  const activeOpponents = match.players.filter((opp) => !opp.state.isFolded);
  const heroFolded = state.currentlyDisplayed === "postGame";

  if (activeOpponents.length === 0 && !heroFolded) {
    match.players[0].profile.money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  } else if (activeOpponents.length === 1 && heroFolded) {
    activeOpponents[0].profile.money += match.pot;
    match.pot = 0;
    state.currentlyDisplayed = "postGame";
  }
};

export const logGameStep = (
  stage: string,
  match: MatchInterface,
  actionType?: string,
) => {
  const activePlayer =
    match.currentHand.players[match.currentHand.activePlayerIndex];

  console.group(
    `%c[MATCH STEP]: ${stage}`,
    "color: #00f3ff; font-weight: bold; text-shadow: 0 0 5px #00f3ff;",
  );
  console.log(
    `%cType: %c${match.general.matchType.toUpperCase()} | Phase: %c${match.currentHand.currentPhase.phase}`,
    "font-weight: bold",
    "color: #ff00ff",
    "color: #00ff00",
  );
  console.log(
    `Active: ${activePlayer?.general.name || "None"} (Index: ${match.currentHand.activePlayerIndex}) action type: ${actionType}`,
  );
  console.log(
    `Pot: $${match.currentHand.pot} | Table Bet: $${match.currentHand.currentBetOnTable} | Deck: ${match.currentHand.deck.length}`,
  );

  console.table(
    match.currentHand.players.map((p) => ({
      name: p.general.name,
      chips: p.profile.money,
      folded: p.state.isFolded,
      acted: p.state.hasActed,
      last: p.state.lastAction,
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
  nextPhase: MatchPhaseType,
) => {
  state.currentHand.currentPhase.phase = nextPhase;
  state.currentHand.currentBetOnTable = 0;
  state.currentHand.lastRaiserId = null;
  state.currentHand.players.forEach((p) => {
    p.state.hasActed = false;
    p.state.currentBet = 0;
  });
  state.currentHand.activePlayerIndex = getNextActivePlayerIndex(state);
  state.currentHand.actionMessage = `Phase: ${nextPhase.toUpperCase()}`;
  state.currentHand.messageId += 1;
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
