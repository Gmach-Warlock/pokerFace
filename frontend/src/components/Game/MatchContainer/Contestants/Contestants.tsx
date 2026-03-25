import { useAppSelector } from "../../../../app/hooks";
import "./Contestants.css";
import OurHero from "./OurHero/OurHero";

export default function Contestants() {
  const opponents = useAppSelector(
    (state) => state.game.currentMatch.opponents,
  );

  const deck = useAppSelector((state) => state.game.currentMatch.deck);
  const designKey = useAppSelector(
    (state) => state.game.currentMatch.deckStyle,
  );

  return (
    <div className="match__contestants">
      <div className="contestants__container">
        <div className="opponents">
          {opponents.map((opponent, index) => (
            <div key={index}>
              <p>{`Opponent ${index + 1}`}</p>
              <span>{opponent.name || "Mysterious Guest"}</span>
            </div>
          ))}
        </div>

        <div className="arena-center">
          {/* The data-design attribute tells CSS which image to use */}
          <div className="deck-stack" data-design={designKey}>
            {deck.slice(-8).map((_, index) => (
              <div key={index} className={`card-back layer-${index}`} />
            ))}
            <span className="deck-count">{deck.length} Cards Remaining</span>
          </div>

          <div className="pot-container">
            <p>Pot</p>
            <span>0</span>
          </div>
        </div>

        <div className="ourHero__container">
          <OurHero />
        </div>
      </div>
    </div>
  );
}
