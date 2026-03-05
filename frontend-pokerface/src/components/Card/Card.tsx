import { SuitIcons } from "../../app/assets";
import type { CardSuitType, CardValueType } from "../../app/types";
import "./Card.css";

export default function Card() {
  const cardValue = 8;
  const cardSuit = "spade";

  const determineTextColor = (cardSuit: CardSuitType) => {
    switch (cardSuit) {
      case "club":
        return "black";
      case "diamond":
        return "red";
      case "heart":
        return "red";
      case "spade":
        return "black";
    }
  };

  const cardTextColor = determineTextColor(cardSuit);

  const createSmallSuitIcon = (cardSuit: CardSuitType) => {
    switch (cardSuit) {
      case "club":
        return (
          <img src={SuitIcons.club} alt="club" className="small-suit-icon" />
        );
      case "diamond":
        return (
          <img
            src={SuitIcons.diamond}
            alt="diamond"
            className="small-suit-icon"
          />
        );
      case "heart":
        return (
          <img src={SuitIcons.heart} alt="heart" className="small-suit-icon" />
        );
      case "spade":
        return (
          <img src={SuitIcons.spade} alt="spade" className="small-suit-icon" />
        );
    }
  };

  const createMediumSuitIcon = (cardSuit: CardSuitType) => {
    switch (cardSuit) {
      case "club":
        return (
          <img src={SuitIcons.club} alt="club" className="medium-suit-icon" />
        );
      case "diamond":
        return (
          <img
            src={SuitIcons.diamond}
            alt="diamond"
            className="medium-suit-icon"
          />
        );
      case "heart":
        return (
          <img src={SuitIcons.heart} alt="heart" className="medium-suit-icon" />
        );
      case "spade":
        return (
          <img src={SuitIcons.spade} alt="spade" className="medium-suit-icon" />
        );
    }
  };

  const createLargeSuitIcon = (cardSuit: CardSuitType) => {
    switch (cardSuit) {
      case "club":
        return (
          <img src={SuitIcons.club} alt="club" className="large-suit-icon" />
        );
      case "diamond":
        return (
          <img
            src={SuitIcons.diamond}
            alt="diamond"
            className="large-suit-icon"
          />
        );
      case "heart":
        return (
          <img src={SuitIcons.heart} alt="heart" className="large-suit-icon" />
        );
      case "spade":
        return (
          <img src={SuitIcons.spade} alt="spade" className="large-suit-icon" />
        );
    }
  };

  const smallSuitIcon = createSmallSuitIcon(cardSuit);
  const mediumSuitIcon = createMediumSuitIcon(cardSuit);
  const largeSuitIcon = createLargeSuitIcon(cardSuit);

  const createCenterPiece = (cardValue: CardValueType) => {
    const pieceFor2 = (
      <div className={`card-centerpiece`}>
        <div className="two-a place-center">{mediumSuitIcon}</div>
        <div className="two-b rotate-180 place-center">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor3 = (
      <div className={`card-centerpiece`}>
        <div className="three-a place-center">{mediumSuitIcon}</div>
        <div className="three-b place-center">{mediumSuitIcon}</div>
        <div className="three-c place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor4 = (
      <div className={`card-centerpiece`}>
        <div className="four-a place-center">{mediumSuitIcon}</div>
        <div className="four-b place-center">{mediumSuitIcon}</div>
        <div className="four-c rotate-180 place-center">{mediumSuitIcon}</div>
        <div className="four-d rotate-180 place-center">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor5 = (
      <div className={`card-centerpiece`}>
        <div className="five-a place-center">{mediumSuitIcon}</div>
        <div className="five-b place-center">{mediumSuitIcon}</div>
        <div className="five-c place-center">{mediumSuitIcon}</div>
        <div className="five-d place-center rotate-180">{mediumSuitIcon}</div>
        <div className="five-e place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor6 = (
      <div className={`card-centerpiece`}>
        <div className="six-a place-center">{mediumSuitIcon}</div>
        <div className="six-b place-center">{mediumSuitIcon}</div>
        <div className="six-c place-center">{mediumSuitIcon}</div>
        <div className="six-d place-center">{mediumSuitIcon}</div>
        <div className="six-e place-center rotate-180">{mediumSuitIcon}</div>
        <div className="six-f place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor7 = (
      <div className={`card-centerpiece`}>
        <div className="seven-a place-center">{mediumSuitIcon}</div>
        <div className="seven-b place-center">{mediumSuitIcon}</div>
        <div className="seven-c place-center">{mediumSuitIcon}</div>
        <div className="seven-d place-center">{mediumSuitIcon}</div>
        <div className="seven-e place-center">{mediumSuitIcon}</div>
        <div className="seven-f place-center rotate-180">{mediumSuitIcon}</div>
        <div className="seven-g place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor8 = (
      <div className={`card-centerpiece`}>
        <div className="eight-a place-center">{mediumSuitIcon}</div>
        <div className="eight-b place-center">{mediumSuitIcon}</div>
        <div className="eight-c place-center">{mediumSuitIcon}</div>
        <div className="eight-d place-center">{mediumSuitIcon}</div>
        <div className="eight-e place-center">{mediumSuitIcon}</div>
        <div className="eight-f place-center rotate-180">{mediumSuitIcon}</div>
        <div className="eight-g place-center rotate-180">{mediumSuitIcon}</div>
        <div className="eight-h place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor9 = (
      <div className={`card-centerpiece-lg`}>
        <div className="nine-a place-center">{mediumSuitIcon}</div>
        <div className="nine-b place-center">{mediumSuitIcon}</div>
        <div className="nine-c place-center">{mediumSuitIcon}</div>
        <div className="nine-d place-center">{mediumSuitIcon}</div>
        <div className="nine-e place-center rotate-180">{mediumSuitIcon}</div>
        <div className="nine-f place-center rotate-180">{mediumSuitIcon}</div>
        <div className="nine-g place-center rotate-180">{mediumSuitIcon}</div>
        <div className="nine-h place-center rotate-180">{mediumSuitIcon}</div>
        <div className="nine-i place-center">{mediumSuitIcon}</div>
      </div>
    );
    const pieceFor10 = (
      <div className={`card-centerpiece-lg`}>
        <div className="ten-a place-center">{mediumSuitIcon}</div>
        <div className="ten-b place-center">{mediumSuitIcon}</div>
        <div className="ten-c place-center">{mediumSuitIcon}</div>
        <div className="ten-d place-center">{mediumSuitIcon}</div>
        <div className="ten-e place-center rotate-180">{mediumSuitIcon}</div>
        <div className="ten-f place-center rotate-180">{mediumSuitIcon}</div>
        <div className="ten-g place-center rotate-180">{mediumSuitIcon}</div>
        <div className="ten-h place-center rotate-180">{mediumSuitIcon}</div>
        <div className="ten-i place-center">{mediumSuitIcon}</div>
        <div className="ten-j place-center rotate-180">{mediumSuitIcon}</div>
      </div>
    );
    const pieceForJack = (
      <div className={`card-centerpiece-face border-${cardTextColor}`}>
        <div className="face-card">{cardValue}</div>
      </div>
    );
    const pieceForQueen = (
      <div className={`card-centerpiece-face border-${cardTextColor}`}>
        <div className="face-card">{cardValue}</div>
      </div>
    );
    const pieceForKing = (
      <div className={`card-centerpiece-face border-${cardTextColor}`}>
        <div className="face-card">{cardValue}</div>
      </div>
    );
    const pieceForAce = (
      <div className={`card-centerpiece-face border-${cardTextColor}`}>
        <div className="face-card">{largeSuitIcon}</div>
      </div>
    );
    switch (cardValue) {
      case 2:
        return pieceFor2;
      case 3:
        return pieceFor3;
      case 4:
        return pieceFor4;
      case 5:
        return pieceFor5;
      case 6:
        return pieceFor6;
      case 7:
        return pieceFor7;
      case 8:
        return pieceFor8;
      case 9:
        return pieceFor9;
      case 10:
        return pieceFor10;
      case "J":
        return pieceForJack;
      case "Q":
        return pieceForQueen;
      case "K":
        return pieceForKing;
      case "A":
        return pieceForAce;
    }
  };

  const centerPiece = createCenterPiece(cardValue);

  return (
    <div className={`playing-card text-${cardTextColor}`}>
      <div className="card-left-row flex-column">
        <div className="icon">{cardValue}</div>
        <div className="icon">{smallSuitIcon}</div>
      </div>
      {centerPiece}
      <div className="card-right-row flex-column rotate-180">
        <div>{cardValue}</div>
        <div>{smallSuitIcon}</div>
      </div>
    </div>
  );
}
