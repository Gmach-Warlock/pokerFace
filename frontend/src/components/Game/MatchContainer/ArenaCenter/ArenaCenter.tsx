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

import { advancePhase, processBet } from "../../../../features/game/gameSlice";
import { processArenaAction } from "../../../../features/game/gameThunks";
import BettingForm from "../BettingForm/BettingForm";
import "./ArenaCenter.css";

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

  const handleAction = () => dispatch(processArenaAction());

  const handleBetFinalized = (amount: number, type: BettingActionType) => {
    if (!herosId) return;

    dispatch(
      processBet({
        playerId: herosId,
        amount: amount,
        type: type,
      }),
    );
    dispatch(advancePhase());
  };

  return (
    <div className="arena-center">
      <div className="deck-stack" data-design={designKey}>
        {deck.slice(-8).map((_, index) => (
          <div key={index} className={`card-back layer-${index}`} />
        ))}
        <span className="deck-count">{deck.length} Cards Remaining</span>
      </div>

      <div className="arena-center__centerpiece">
        <div>
          <button
            type="button"
            onClick={() => {
              console.log(currentMatch);
            }}
          >
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

        <div className="arena-center__deal">
          {isBettingPhase ? (
            <BettingForm
              currentPot={pot}
              heroMoney={heroMoney}
              onConfirm={handleBetFinalized}
            />
          ) : (
            <button
              type="button"
              onClick={handleAction}
              className={discardCount > 0 ? "btn-confirm-draw" : "btn-standard"}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
