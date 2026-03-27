import { cardSuitIcons } from "../../app/assets";
import type {
  CardInterface,
  CardValueType,
  IconSizeType,
} from "../../app/types";
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
  // --- Helper Sub-renderers ---

  const renderSuitIcon = (size: IconSizeType) => (
    <img
      src={cardSuitIcons[suit]}
      alt={suit}
      className={`suit-icon--${size}`}
    />
  );

  const renderCenterPiece = (val: CardValueType) => {
    // Face Card Logic (J, Q, K, A)
    if (typeof val === "string") {
      return (
        <div
          className={`card__centerpiece-face place-center items-center border-${suitColor}`}
        >
          <div>{renderSuitIcon("large")}</div>
        </div>
      );
    }

    // Number Card Logic (2-10)
    const numberMap: Record<number, string> = {
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      10: "ten",
    };

    const count = val as number;
    const prefix = numberMap[count];
    const containerClass =
      count > 8 ? "card__centerpiece-lg" : "card__centerpiece";

    return (
      <div className={containerClass}>
        {Array(count)
          .fill(null)
          .map((_, i) => {
            const isBottomHalf = i >= Math.ceil(count / 2);
            const isThreeCase = count === 3 && i === 2; // Fixed index logic for 3
            const shouldRotate = isThreeCase || (count !== 3 && isBottomHalf);

            return (
              <div
                key={i}
                className={`${prefix}-${String.fromCharCode(97 + i)} place-center ${shouldRotate ? "rotate-180" : ""}`}
              >
                {renderSuitIcon("medium")}
              </div>
            );
          })}
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
