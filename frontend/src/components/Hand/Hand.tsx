// Hand.tsx
import type { HandInterface } from "../../app/types";
import Card from "../Card/Card";
import "./Hand.css";

export default function Hand(props: HandInterface) {
  const { matchType, cards, currentLocation } = props;

  // 1. Define sub-renderers for different game types
  const renderDrawHand = () => (
    <div className="hand-draw place-center w-full">
      {cards.map((card, index) => (
        <div key={index} className={`hand-draw-card${index + 1}`}>
          <Card
            value={card.value}
            suit={card.suit}
            side={card.side}
            currentLocation={currentLocation}
          />
        </div>
      ))}
    </div>
  );

  const renderHoldemHand = () => (
    <div className="hand-holdem place-center w-full">
      {/* Hold'em usually only shows 2 hole cards */}
      {cards.slice(0, 2).map((card, index) => (
        <div key={index} className={`hand-holdem-card${index + 1}`}>
          <Card {...card} currentLocation={currentLocation} />
        </div>
      ))}
    </div>
  );

  // 2. The "Switcher" logic
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
