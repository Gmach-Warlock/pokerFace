import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { performAnteUp } from "../../../../features/betting/bettingActions";
import { dealRound, advancePhase } from "../../../../features/game/gameSlice";
import "./ArenaCenter.css";

export default function ArenaCenter() {
  const dispatch = useAppDispatch();

  // State Selectors
  const deck = useAppSelector((state) => state.game.currentMatch.deck);
  const designKey = useAppSelector(
    (state) => state.game.currentMatch.deckStyle,
  );
  const pot = useAppSelector((state) => state.game.currentMatch.pot);
  const phase = useAppSelector(
    (state) => state.game.currentMatch.currentPhase.phase,
  );
  const heroHand = useAppSelector((state) => state.game.currentMatch.herosHand);

  const discardCount = heroHand.filter((card) => card.isDiscarded).length;

  const handleAction = () => {
    if (phase === "ante") {
      dispatch(performAnteUp());
      dispatch(advancePhase());
    } else if (phase === "draw") {
      // 1. Swap the cards in the state (requires updating dealRound logic)
      dispatch(dealRound());
      // 2. Move to the next betting round or showdown
      dispatch(advancePhase());
    } else {
      // Handles initial 'deal' phase
      dispatch(dealRound());
      dispatch(advancePhase());
    }
  };

  // Determine Dynamic Button Label
  const getButtonLabel = () => {
    switch (phase) {
      case "ante":
        return "Ante Up";
      case "deal":
        return "Deal Round";
      case "draw":
        return discardCount > 0
          ? `Confirm Draw (${discardCount})`
          : "Stand Pat";
      default:
        return "Next Round";
    }
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
        <div className="arena-center__phase-display">
          <p>{phase}</p>
        </div>
        <div className="pot">
          <p>Pot</p>
          <span>{pot}</span>
        </div>
        <div className="arena-center__deal">
          <button
            type="button"
            onClick={handleAction}
            // Dynamic styling for visual feedback
            className={discardCount > 0 ? "btn-confirm-draw" : "btn-standard"}
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
