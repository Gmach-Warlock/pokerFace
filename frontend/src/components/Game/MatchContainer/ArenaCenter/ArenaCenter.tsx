import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks/gameHooks";
import { useEffect } from "react";

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
import { processBet } from "../../../../features/match/matchSlice";
import BettingForm from "../BettingForm/BettingForm";
import "./ArenaCenter.css";
import DrawButton from "./buttons/DrawButton/DrawButton";
import DealButton from "./buttons/DealButton/DealButton";
import { processArenaAction } from "../../../../features/match/matchThunks";
import { useRef } from "react";
import ActionMessage from "../ActionMessage/ActionMessage";

export default function ArenaCenter() {
  const dispatch = useAppDispatch();

  const currentMatch = useAppSelector(selectMatch);
  const deck = useAppSelector(selectDeck);
  const designKey = useAppSelector(selectDeckStyle);
  const pot = useAppSelector(selectPot);
  const phase = useAppSelector(selectCurrentPhase);
  const herosId = useAppSelector(selectHerosId);
  const heroMoney = useAppSelector(selectHeroMoney);
  const discardCount = useAppSelector(selectDiscardCount);
  const isBettingPhase = useAppSelector(selectIsBettingPhase);
  const buttonLabel = useAppSelector(selectActionButtonLabel);
  const currentPlayerIndex = useAppSelector(
    (state) => state.match.activePlayerIndex,
  );
  const playingMatch = useAppSelector((state) => state.game.isPlaying);

  const cleanedKey = designKey.replace("/", "").replace(".png", "");

  const hasInitialFired = useRef(false);

  useEffect(() => {
    if (playingMatch && phase === "notInGameYet" && !hasInitialFired.current) {
      hasInitialFired.current = true;
      dispatch(processArenaAction());
    }

    if (!playingMatch) {
      hasInitialFired.current = false;
    }
  }, [playingMatch, phase, dispatch]);

  const handleBetFinalized = (amount: number, type: BettingActionType) => {
    if (!herosId) return;
    dispatch(processBet({ playerId: herosId, amount, type }));
  };

  const isHerosTurn = isBettingPhase && currentPlayerIndex === 0;
  const renderActionArea = () => {
    if (isHerosTurn && isBettingPhase) {
      return (
        <BettingForm
          key={`betting-form-${currentPlayerIndex}-${phase}`}
          currentPot={pot}
          heroMoney={heroMoney}
          onConfirm={handleBetFinalized}
        />
      );
    }

    if (phase === "draw") {
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
        <div className="debug-info">
          <button type="button" onClick={() => console.log(currentMatch)}>
            State
          </button>
        </div>

        {currentMatch.actionMessage && (
          <div key={currentMatch.messageId} className="action-message-flash">
            <ActionMessage />
          </div>
        )}

        <div className="arena-center__action-container">
          {renderActionArea()}
        </div>
      </div>
    </div>
  );
}
