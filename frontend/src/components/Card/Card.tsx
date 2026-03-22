import { cardSuitIcons } from "../../app/assets";
import type {
  CardInterface,
  CardSideType,
  CardSuitType,
  CardValueType,
  IconSizeType,
} from "../../app/types";
import "./Card.css";

export default function Card(props: CardInterface) {
  const { value, suit, side } = props;

  const isRed = suit === "heart" || suit === "diamond";
  const suitColor = isRed ? "red" : "black";

  const createSuitIcon = (suit: CardSuitType, size: IconSizeType) => {
    switch (suit) {
      case "club":
        return (
          <img
            src={cardSuitIcons.club}
            alt="club"
            className={`${size}-suit-icon`}
          />
        );
      case "diamond":
        return (
          <img
            src={cardSuitIcons.diamond}
            alt="diamond"
            className={`${size}-suit-icon`}
          />
        );
      case "heart":
        return (
          <img
            src={cardSuitIcons.heart}
            alt="heart"
            className={`${size}-suit-icon`}
          />
        );
      case "spade":
        return (
          <img
            src={cardSuitIcons.spade}
            alt="spade"
            className={`${size}-suit-icon`}
          />
        );
    }
  };

  const createCenterPiece = (val: CardValueType) => {
    if (typeof val === "string") {
      return (
        <div
          className={`playing-card-centerpiece-face place-center items-center border-${suitColor}`}
        >
          <div>{createSuitIcon(suit, "large")}</div>
        </div>
      );
    }
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
      count > 8 ? "playing-card-centerpiece-lg" : "playing-card-centerpiece";

    return (
      <div className={containerClass}>
        {Array(count)
          .fill(null)
          .map((_, i) => {
            const letter = String.fromCharCode(97 + i);
            const isBottomHalf = i >= Math.ceil(count / 2);
            const isThreeCase = count === 3 && i === 3;
            const isStandardRotation = count !== 3 && isBottomHalf;

            const shouldRotate = isThreeCase || isStandardRotation;

            return (
              <div
                key={i}
                className={`${prefix}-${letter} place-center ${shouldRotate ? "rotate-180" : ""}`}
              >
                {createSuitIcon(suit, "medium")}
              </div>
            );
          })}
      </div>
    );
  };

  const chooseSide = (side: CardSideType) => {
    switch (side) {
      case "face-up":
        return (
          <div className={`playing-card text-${suitColor}`}>
            <div className="playing-card-side-column">
              <div className="place-center">{value}</div>
              <div className="place-center">
                {createSuitIcon(suit, "small")}
              </div>
            </div>
            {createCenterPiece(value)}
            <div className="playing-card-side-column rotate-180">
              <div className="place-center">{value}</div>
              <div className="place-center">
                {createSuitIcon(suit, "small")}
              </div>
            </div>
          </div>
        );
      case "face-down":
        return <div className="playing-card face-down"></div>;
    }
  };

  const newSide = chooseSide(side);

  return <>{newSide}</>;
}
