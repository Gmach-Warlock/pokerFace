import { CLUB, DIAMOND, HEART, SPADE } from "../../app/global";
import type {
  CardIntegerType,
  CardParamsType,
  CardSuitType,
} from "../../app/types";

export default function Card(props: CardParamsType) {
  const cardValue: CardIntegerType = props.cardValue;
  const suit = props.cardSuit;

  const diamondUrl = DIAMOND;
  const heartUrl = HEART;
  const clubUrl = CLUB;
  const spadeUrl = SPADE;

  const chooseTextColor = (suit: CardSuitType) => {
    if (suit === "club" || suit === "spade") {
      return "black";
    } else {
      return "red-600";
    }
  };

  const textColor = chooseTextColor(suit);

  const chooseSuitUrl = (suit: CardSuitType) => {
    switch (suit) {
      case "heart":
        return heartUrl;
      case "diamond":
        return diamondUrl;
      case "club":
        return clubUrl;
      case "spade":
        return spadeUrl;
      default:
        return;
    }
  };

  const suitUrl = chooseSuitUrl(suit);

  const cardSuitSmall = (
    <img src={suitUrl} alt="heart" className="w-4 h-auto" />
  );

  const cardSuitMedium = (
    <img src={suitUrl} alt="heart" className="w-6 h-auto" />
  );

  const createNewCenterPiece = () => {
    const newCenterPieceFor2 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-2 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-2 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor3 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-2 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-2 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor4 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor5 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor6 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor7 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-2 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor8 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-5 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-2 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-4 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor9 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-7 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-4 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    const newCenterPieceFor10 = (
      <div className="w-[70%] grid grid-cols-3 grid-rows-7 justify-between items-between my-5 p-1">
        <div className="col-start-1 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-3 justify-self-center">{cardSuitMedium}</div>
        <div className="col-start-1 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-3 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-5 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-1 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-3 row-start-7 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-2 justify-self-center">
          {cardSuitMedium}
        </div>
        <div className="col-start-2 row-start-6 transform rotate-180 justify-self-center">
          {cardSuitMedium}
        </div>
      </div>
    );

    if (cardValue < 3) {
      return newCenterPieceFor2;
    } else if (cardValue > 2 && cardValue < 4) {
      return newCenterPieceFor3;
    } else if (cardValue > 3 && cardValue < 5) {
      return newCenterPieceFor4;
    } else if (cardValue > 4 && cardValue < 6) {
      return newCenterPieceFor5;
    } else if (cardValue > 5 && cardValue < 7) {
      return newCenterPieceFor6;
    } else if (cardValue > 6 && cardValue < 8) {
      return newCenterPieceFor7;
    } else if (cardValue > 7 && cardValue < 9) {
      return newCenterPieceFor8;
    } else if (cardValue > 8 && cardValue < 10) {
      return newCenterPieceFor9;
    } else if (cardValue > 9 && cardValue < 11) {
      return newCenterPieceFor10;
    }
  };

  const newCenterpiece = createNewCenterPiece();

  return (
    <div
      className={`w-35 h-49 bg-white text-${textColor} flex rounded-md py-1 shadow-2xl`}
    >
      <div className="w-[15%] flex flex-col items-center">
        <div>{cardValue}</div>
        <div>{cardSuitSmall}</div>
      </div>

      {newCenterpiece}

      <div className="w-[15%] flex flex-col items-center transform rotate-180">
        <div>{cardValue}</div>
        <div>{cardSuitSmall}</div>
      </div>
    </div>
  );
}
