import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import type { BettingActionType } from "../../../../app/types";
import {
  selectActionButtonLabel,
  selectCurrentMatch,
  selectCurrentPhase,
  selectDeck,
  selectDeckStyle,
  selectDiscardCount,
  selectHeroMoney,
  selectHerosId,
  selectIsBettingPhase,
  selectPot,
} from "../../../../features/game/gameSelectors";
import {
  completeDrawPhase,
  processBet,
} from "../../../../features/game/gameSlice";
import { processArenaAction } from "../../../../features/game/gameThunks";
import BettingForm from "../BettingForm/BettingForm";
import "./ArenaCenter.css";
import DrawButton from "./buttons/DrawButton/DrawButton";
import DealButton from "./buttons/DealButton/DealButton";

export default function ArenaCenter() {
  const dispatch = useAppDispatch();

  const currentMatch = useAppSelector(selectCurrentMatch);
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
    (state) => state.game.currentMatch.activePlayerIndex,
  );

  const cleanedKey = designKey.replace("/", "").replace(".png", "");

  const handleAction = () => {
    if (phase === "draw" && discardCount === 0) {
      dispatch(completeDrawPhase());
    } else {
      dispatch(processArenaAction());
    }
  };

  const handleBetFinalized = (amount: number, type: BettingActionType) => {
    if (!herosId) return;
    dispatch(processBet({ playerId: herosId, amount, type }));
  };

  const renderActionArea = () => {
    if (isBettingPhase) {
      return (
        <BettingForm
          currentPot={pot}
          heroMoney={heroMoney}
          onConfirm={handleBetFinalized}
        />
      );
    }

    if (phase === "draw") {
      return (
        <DrawButton
          onClick={handleAction}
          label={buttonLabel}
          isConfirming={discardCount > 0}
        />
      );
    }

    return <DealButton onClick={handleAction} label={buttonLabel} />;
  };

  return (
    <div className="arena-center">
      {/* Deck Stack Visuals */}
      <div className="deck-stack" data-design={cleanedKey}>
        {deck.slice(-8).map((_, index) => (
          <div key={index} className={`card-back layer-${index}`} />
        ))}
        <span className="deck-count">{deck.length} Cards Remaining</span>
      </div>

      <div className="arena-center__centerpiece">
        <div className="debug-info">
          <span>Player: {currentPlayerIndex}</span>
          <button type="button" onClick={() => console.log(currentMatch)}>
            State
          </button>
        </div>

        <div className="arena-center__phase-display">
          <p>{phase}</p>
        </div>

        <div className="pot">
          <p>Pot</p>
          <span>{pot}</span>
        </div>

        {/* This container now cleanly swaps between Form and Buttons */}
        <div className="arena-center__action-container">
          {renderActionArea()}
        </div>
      </div>
    </div>
  );
}
