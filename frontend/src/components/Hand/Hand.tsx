// Hand.tsx
import type { HandInterface } from "../../app/interfaces";
import Card from "../Card/Card";
import "./Hand.css";
import { toggleDiscard } from "../../features/match/matchSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectDeckStyle } from "../../features/match/matchSelectors";

export default function Hand(props: HandInterface) {
  const { matchType, cards, currentLocation, isTitle } = props;
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.match.currentPhase.phase);

  const design = useAppSelector(selectDeckStyle);

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
