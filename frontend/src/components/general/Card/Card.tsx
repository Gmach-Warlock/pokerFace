import { useMemo } from "react";
import { cardSuitIcons } from "../../../app/assets/match/matchAssets";
import type {
  CardValueType,
  IconSizeType,
} from "../../../app/types/matchTypes";
import type { CardInterface } from "../../../app/interfaces/matchInterfaces";
import { numberToTextMap, getPipRotation } from "../../../app/utils/cardUtils";
import "./Card.css";

export default function Card({
  value,
  suit,
  side,
  isDiscarded,
}: CardInterface) {
  const isRed = suit === "heart" || suit === "diamond";
  const suitColor = isRed ? "red" : "black";
  const cardClass = `card-face ${isDiscarded ? "card-discarded" : ""}`;

  const renderSuitIcon = (size: IconSizeType) => (
    <img
      src={cardSuitIcons[suit]}
      alt={suit}
      className={`suit-icon--${size}`}
    />
  );
  const containerClass = useMemo(() => {
    // Handle Face Cards (Strings: 'A', 'J', 'Q', 'K')
    if (typeof value === "string") {
      return "card__centerpiece-face";
    }

    // Handle Pip Cards (Numbers)
    switch (true) {
      case value >= 9:
        return "card__centerpiece-lg";
      default:
        return "card__centerpiece";
    }
  }, [value]);

  const renderCenterPiece = (val: CardValueType) => {
    if (typeof val === "string") {
      return (
        <div
          className={`card__centerpiece-face place-center items-center border-${suitColor}`}
        >
          {renderSuitIcon("large")}
        </div>
      );
    }

    const count = val as number;
    const prefix = numberToTextMap[count];

    return (
      <div className={containerClass}>
        {Array(count)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className={`${prefix}-${String.fromCharCode(97 + i)} place-center ${getPipRotation(count, i) ? "rotate-180" : ""}`}
            >
              {renderSuitIcon("medium")}
            </div>
          ))}
      </div>
    );
  };

  // --- Main Render Logic ---

  if (side === "face-down") {
    // Added 'card-back' so your data-design selectors finally work!
    return <div className="card card-back card--face-down" />;
  }

  return (
    <div className={`card text-${suitColor} ${cardClass}`}>
      {/* Top Left Corner */}
      <div className="card__side-column">
        <div className="place-center">{value}</div>
        <div className="place-center">{renderSuitIcon("small")}</div>
      </div>

      {/* Main Art Area */}
      {renderCenterPiece(value)}

      {/* Bottom Right Corner */}
      <div className="card__side-column rotate-180">
        <div className="place-center">{value}</div>
        <div className="place-center">{renderSuitIcon("small")}</div>
      </div>
    </div>
  );
}
