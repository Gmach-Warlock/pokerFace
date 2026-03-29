// Hand.tsx
import type { HandInterface } from "../../app/types";
import Card from "../Card/Card";
import "./Hand.css";
import { toggleDiscard } from "../../features/game/gameSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectDeckStyle } from "../../features/game/gameSelectors";

export default function Hand(props: HandInterface) {
  const { matchType, cards, currentLocation, isTitle } = props;
  const dispatch = useAppDispatch();
  const phase = useAppSelector(
    (state) => state.game.currentMatch.currentPhase.phase,
  );

  const design = useAppSelector(selectDeckStyle);

  // Helper flags
  const isHero = currentLocation === "p1";
  const isDrawPhase = phase === "draw";
  const canDiscard = isHero && isDrawPhase;

  const handleCardClick = (index: number) => {
    if (canDiscard) {
      dispatch(toggleDiscard(index));
    }
  };

  const renderDrawHand = () => (
    <div className={`hand-draw ${isTitle ? "hand-draw--animated" : ""}`}>
      {cards.map((card, index) => {
        // Construct the class string dynamically
        const wrapperClass = [
          `hand-draw-card${index + 1}`,
          canDiscard ? "card-interactive" : "",
        ]
          .join(" ")
          .trim();

        return (
          <div
            key={index}
            className={wrapperClass}
            onClick={() => handleCardClick(index)}
          >
            <Card
              value={card.value}
              suit={card.suit}
              side={card.side}
              currentLocation={currentLocation}
              isDiscarded={card.isDiscarded}
              deckDesign={design}
            />
          </div>
        );
      })}
    </div>
  );

  const renderHoldemHand = () => (
    <div className="hand-holdem place-center w-full">
      {/* Hold'em usually only shows 2 hole cards */}
      {cards.slice(0, 2).map((card, index) => (
        <div key={index} className={`hand-holdem-card${index + 1}`}>
          <Card
            {...card}
            currentLocation={currentLocation}
            deckDesign={design}
          />
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (matchType) {
      case "draw":
        return renderDrawHand();
      case "holdem":
        return renderHoldemHand();
      case "stud":
        return <div className="hand-stud">Stud layout coming soon...</div>;
      default:
        return null;
    }
  };

  return <div className="hand-container place-center">{renderContent()}</div>;
}
