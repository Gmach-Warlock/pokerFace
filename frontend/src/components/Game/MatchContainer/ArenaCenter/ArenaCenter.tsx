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

  const handleAction = () => {
    if (phase === "ante") {
      // 1. Pay the ante
      dispatch(performAnteUp());
      // 2. Move to the next phase (e.g., 'deal')
      dispatch(advancePhase());
    } else {
      // 3. For all other phases, trigger the deal logic defined in your Map
      dispatch(dealRound());
      // Optional: advancePhase() again if you want to move to 'betting' immediately
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
        <div className="pot">
          <p>Pot</p>
          <span>{pot}</span>
        </div>
        <div className="arena-center__deal">
          <button type="button" onClick={handleAction}>
            {/* Dynamic Button Text */}
            {phase === "ante" ? "Ante Up" : "Deal Round"}
          </button>
        </div>
      </div>
    </div>
  );
}
