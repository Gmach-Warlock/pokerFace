import { useEffect, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks/gameHooks";

import type { BettingActionType } from "../../../../app/types/matchTypes";
import {
  selectActionButtonLabel,
  selectMatch,
  selectCurrentPhase,
  selectDeck,
  selectDeckStyle,
  selectDiscardCount,
  selectHeroMoney,
  selectHerosId,
  selectIsBettingPhase,
  selectPot,
} from "../../../../features/match/matchSelectors";

import { handleBet } from "../../../../features/match/matchSlice";
import { processArenaAction } from "../../../../features/match/matchThunks";

import BettingForm from "../BettingForm/BettingForm";
import ActionMessage from "../ActionMessage/ActionMessage";
import DrawButton from "./buttons/DrawButton/DrawButton";
import DealButton from "./buttons/DealButton/DealButton";
import "./ArenaCenter.css";

export default function ArenaCenter() {
  const dispatch = useAppDispatch();
  const hasInitialFired = useRef(false);

  // Selectors
  const currentMatch = useAppSelector(selectMatch);
  const deck = useAppSelector(selectDeck);
  const designKey = useAppSelector(selectDeckStyle);
  const pot = useAppSelector(selectPot);

  // Destructure phase and type from the object-returning selector
  const { phase } = useAppSelector(selectCurrentPhase);

  const herosId = useAppSelector(selectHerosId);
  const heroMoney = useAppSelector(selectHeroMoney);
  const discardCount = useAppSelector(selectDiscardCount);
  const isBettingPhase = useAppSelector(selectIsBettingPhase);
  const buttonLabel = useAppSelector(selectActionButtonLabel);
  const currentPlayerIndex = useAppSelector(
    (state) => state.match.currentHand.activePlayerIndex,
  );
  const playingMatch = useAppSelector((state) => state.game.isPlaying);

  const cleanedKey = designKey.replace("/", "").replace(".png", "");

  // 1. Initial Game Trigger
  useEffect(() => {
    // We cast phase as a string here to satisfy TS string-literal comparisons
    const currentPhaseStr = phase as string;

    if (
      playingMatch &&
      currentPhaseStr === "notInGameYet" &&
      !hasInitialFired.current
    ) {
      hasInitialFired.current = true;
      dispatch(processArenaAction());
    }

    if (!playingMatch) {
      hasInitialFired.current = false;
    }
  }, [playingMatch, phase, dispatch]);

  // 2. Betting Logic
  const handleBetFinalized = (amount: number, betType: BettingActionType) => {
    if (!herosId) return;
    dispatch(handleBet({ playerId: herosId, amount, type: betType }));
  };

  const isHerosTurn = isBettingPhase && currentPlayerIndex === 0;

  const renderActionArea = () => {
    const currentPhaseStr = phase as string;

    if (isHerosTurn && isBettingPhase) {
      return (
        <BettingForm
          key={`betting-form-${currentPlayerIndex}-${currentPhaseStr}`}
          currentPot={pot}
          heroMoney={heroMoney}
          onConfirm={handleBetFinalized}
        />
      );
    }

    if (currentPhaseStr === "draw") {
      return <DrawButton label={buttonLabel} isConfirming={discardCount > 0} />;
    }

    return <DealButton label={buttonLabel} />;
  };

  return (
    <div className="arena-center">
      <div className="deck-stack" data-design={cleanedKey}>
        {deck.slice(-8).map((_, index) => (
          <div key={index} className={`card-back layer-${index}`} />
        ))}
        <span className="deck-count">{deck.length} Cards Remaining</span>
      </div>

      <div className="arena-center__centerpiece">
        <div className="pot">
          <span>Pot </span>
          <span>{pot}</span>
        </div>

        {currentMatch.currentHand.actionMessage && (
          <div
            key={`${currentMatch.currentHand.messageId}-${currentMatch.currentHand.actionMessage}`}
            className="action-message-flash"
          >
            <ActionMessage />
          </div>
        )}

        <div className="arena-center__action-container">
          {renderActionArea()}
        </div>

        <div className="debug-info">
          <button type="button" onClick={() => console.log(currentMatch)}>
            Log State
          </button>
        </div>
      </div>
    </div>
  );
}
