import { useEffect, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks/gameHooks";
import {
  selectMatch,
  selectCurrentPhase,
  selectPot,
  selectActivePlayerIndex,
  selectIsPlaying,
  selectIsHerosTurn,
} from "../../../../features/match/selectors/stateSelectors";
import {
  selectActionButtonLabel,
  selectDiscardCount,
  selectCurrentTableBet,
} from "../../../../features/match/selectors/stateSelectors";
import {
  selectDeck,
  selectHeroMoney,
  selectHerosId,
  selectCleanedDeckKey,
  selectHeroCurrentBet,
} from "../../../../features/match/selectors/heroSelectors";
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
  const currentMatch = useAppSelector(selectMatch);
  const deck = useAppSelector(selectDeck);
  const pot = useAppSelector(selectPot);
  const herosId = useAppSelector(selectHerosId);
  const heroMoney = useAppSelector(selectHeroMoney);
  const discardCount = useAppSelector(selectDiscardCount);
  const isHerosTurn = useAppSelector(selectIsHerosTurn);
  const buttonLabel = useAppSelector(selectActionButtonLabel);
  const { phase } = useAppSelector(selectCurrentPhase);
  const currentPlayerIndex = useAppSelector(selectActivePlayerIndex);
  const playingMatch = useAppSelector(selectIsPlaying);
  const cleanedKey = useAppSelector(selectCleanedDeckKey);

  const currentTableBet = useAppSelector(selectCurrentTableBet); // Ensure you have this selector
  const heroCurrentBet = useAppSelector(selectHeroCurrentBet); // And this one

  // 1. Initial Game Trigger
  useEffect(() => {
    const shouldStartGame =
      playingMatch && phase === "notInGameYet" && !hasInitialFired.current;

    if (shouldStartGame) {
      hasInitialFired.current = true;
      dispatch(processArenaAction());
    }

    if (!playingMatch) hasInitialFired.current = false;
  }, [playingMatch, phase, dispatch]);

  // 2. Action Area Mapper
  const phaseComponents: Record<string, React.ReactNode> = {
    draw: <DrawButton label={buttonLabel} isConfirming={discardCount > 0} />,
    deal: <DealButton label={buttonLabel} />, // Default/Generic phase
    // Add more phases here as the game grows (e.g., flop, turn, river)
  };
  const renderActionArea = () => {
    const isBettingPhase = phase === "bettingOne" || phase === "bettingTwo";
    if (isHerosTurn && isBettingPhase) {
      return (
        <BettingForm
          key={`betting-form-${currentPlayerIndex}-${phase}`}
          currentPot={pot}
          heroMoney={heroMoney}
          currentTableBet={currentTableBet} // Add this!
          currentPlayerBet={heroCurrentBet} // Add this!
          onConfirm={(amount, type) => {
            console.log("Confirming bet:", amount, type); // Debug log
            if (herosId) {
              dispatch(handleBet({ playerId: herosId, amount, type }));
            } else {
              console.error("No Hero ID found!");
            }
          }}
        />
      );
    }

    // Priority 2: Return mapped component or fallback to DealButton
    return (
      phaseComponents[phase as string] || <DealButton label={buttonLabel} />
    );
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
      <button
        onClick={() => console.log(currentMatch)}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
      >
        FORCE LOG
      </button>
    </div>
  );
}
