import { cardSuitIcons } from "../../app/assets";
import type {
  CardInterface,
  CardSideType,
  CardSuitType,
  CardValueType,
} from "../../app/types";
import "./Card.css";

export default function Card(props: CardInterface) {
  const value: CardValueType = props.value;
  const suit: CardSuitType = props.suit;

  const side: CardSideType = props.side;

  const determineSuitColor = (cardSuit: CardSuitType) => {
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
  const suitColor = determineSuitColor(suit);

  const smallSuitIcons = {
    club: (
      <img src={cardSuitIcons.club} alt="club" className="small-suit-icon" />
    ),
    diamond: (
      <img
        src={cardSuitIcons.diamond}
        alt="diamond"
        className="small-suit-icon"
      />
    ),
    heart: (
      <img src={cardSuitIcons.heart} alt="heart" className="small-suit-icon" />
    ),
    spade: (
      <img src={cardSuitIcons.spade} alt="spade" className="small-suit-icon" />
    ),
  };

  const createSmallIcon = (suit: CardSuitType) => {
    switch (suit) {
      case "club":
        return smallSuitIcons.club;
      case "diamond":
        return smallSuitIcons.diamond;
      case "heart":
        return smallSuitIcons.heart;
      case "spade":
        return smallSuitIcons.spade;
    }
  };

  const mediumSuitIcons = {
    club: (
      <img src={cardSuitIcons.club} alt="club" className="medium-suit-icon" />
    ),
    diamond: (
      <img
        src={cardSuitIcons.diamond}
        alt="diamond"
        className="medium-suit-icon"
      />
    ),
    heart: (
      <img src={cardSuitIcons.heart} alt="heart" className="medium-suit-icon" />
    ),
    spade: (
      <img src={cardSuitIcons.spade} alt="spade" className="medium-suit-icon" />
    ),
  };

  const createMediumIcon = (suit: CardSuitType) => {
    switch (suit) {
      case "club":
        return mediumSuitIcons.club;
      case "diamond":
        return mediumSuitIcons.diamond;
      case "heart":
        return mediumSuitIcons.heart;
      case "spade":
        return mediumSuitIcons.spade;
    }
  };

  const largeSuitIcons = {
    club: (
      <img src={cardSuitIcons.club} alt="club" className="large-suit-icon" />
    ),
    diamond: (
      <img
        src={cardSuitIcons.diamond}
        alt="diamond"
        className="large-suit-icon"
      />
    ),
    heart: (
      <img src={cardSuitIcons.heart} alt="heart" className="large-suit-icon" />
    ),
    spade: (
      <img src={cardSuitIcons.spade} alt="spade" className="large-suit-icon" />
    ),
  };

  const createLargeIcon = (suit: CardSuitType) => {
    switch (suit) {
      case "club":
        return largeSuitIcons.club;
      case "diamond":
        return largeSuitIcons.diamond;
      case "heart":
        return largeSuitIcons.heart;
      case "spade":
        return largeSuitIcons.spade;
    }
  };

  const centerFor2 = (
    <div className="playing-card-centerpiece">
      <div className="two-a place-center">{createMediumIcon(suit)}</div>
      <div className="two-b place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor3 = (
    <div className="playing-card-centerpiece">
      <div className="three-a place-center">{createMediumIcon(suit)}</div>
      <div className="three-b place-center">{createMediumIcon(suit)}</div>
      <div className="three-c place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor4 = (
    <div className="playing-card-centerpiece">
      <div className="four-a place-center">{createMediumIcon(suit)}</div>
      <div className="four-b place-center">{createMediumIcon(suit)}</div>
      <div className="four-c place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="four-d place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor5 = (
    <div className="playing-card-centerpiece">
      <div className="five-a place-center">{createMediumIcon(suit)}</div>
      <div className="five-b place-center">{createMediumIcon(suit)}</div>
      <div className="five-c place-center">{createMediumIcon(suit)}</div>
      <div className="five-d place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="five-e place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor6 = (
    <div className="playing-card-centerpiece">
      <div className="six-a place-center">{createMediumIcon(suit)}</div>
      <div className="six-b place-center">{createMediumIcon(suit)}</div>
      <div className="six-c place-center">{createMediumIcon(suit)}</div>
      <div className="six-d place-center">{createMediumIcon(suit)}</div>
      <div className="six-e place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="six-f place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor7 = (
    <div className="playing-card-centerpiece">
      <div className="seven-a place-center">{createMediumIcon(suit)}</div>
      <div className="seven-b place-center">{createMediumIcon(suit)}</div>
      <div className="seven-c place-center">{createMediumIcon(suit)}</div>
      <div className="seven-d place-center">{createMediumIcon(suit)}</div>
      <div className="seven-e place-center">{createMediumIcon(suit)}</div>
      <div className="seven-f place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="seven-g place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor8 = (
    <div className="playing-card-centerpiece">
      <div className="eight-a place-center">{createMediumIcon(suit)}</div>
      <div className="eight-b place-center">{createMediumIcon(suit)}</div>
      <div className="eight-c place-center">{createMediumIcon(suit)}</div>
      <div className="eight-d place-center">{createMediumIcon(suit)}</div>
      <div className="eight-e place-center">{createMediumIcon(suit)}</div>
      <div className="eight-f place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="eight-g place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="eight-h place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor9 = (
    <div className="playing-card-centerpiece-lg">
      <div className="nine-a place-center">{createMediumIcon(suit)}</div>
      <div className="nine-b place-center">{createMediumIcon(suit)}</div>
      <div className="nine-c place-center">{createMediumIcon(suit)}</div>
      <div className="nine-d place-center">{createMediumIcon(suit)}</div>
      <div className="nine-e place-center">{createMediumIcon(suit)}</div>
      <div className="nine-f place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="nine-g place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="nine-h place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="nine-i place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerFor10 = (
    <div className="playing-card-centerpiece-lg">
      <div className="ten-a place-center">{createMediumIcon(suit)}</div>
      <div className="ten-b place-center">{createMediumIcon(suit)}</div>
      <div className="ten-c place-center">{createMediumIcon(suit)}</div>
      <div className="ten-d place-center">{createMediumIcon(suit)}</div>
      <div className="ten-e place-center">{createMediumIcon(suit)}</div>
      <div className="ten-f place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="ten-g place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="ten-h place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="ten-i place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
      <div className="ten-j place-center rotate-180">
        {createMediumIcon(suit)}
      </div>
    </div>
  );

  const centerForJack = (
    <div
      className={`playing-card-centerpiece-face place-center items-center border-${suitColor}`}
    >
      <div>{createLargeIcon(suit)}</div>
    </div>
  );

  const centerForQueen = (
    <div
      className={`playing-card-centerpiece-face place-center items-center border-${suitColor}`}
    >
      <div>{createLargeIcon(suit)}</div>
    </div>
  );

  const centerForKing = (
    <div
      className={`playing-card-centerpiece-face place-center items-center border-${suitColor}`}
    >
      <div>{createLargeIcon(suit)}</div>
    </div>
  );

  const centerForAce = (
    <div
      className={`playing-card-centerpiece-face place-center items-center border-${suitColor}`}
    >
      <div>{createLargeIcon(suit)}</div>
    </div>
  );

  const createCenterPiece = (value: CardValueType) => {
    switch (value) {
      case 2:
        return centerFor2;
      case 3:
        return centerFor3;
      case 4:
        return centerFor4;
      case 5:
        return centerFor5;
      case 6:
        return centerFor6;
      case 7:
        return centerFor7;
      case 8:
        return centerFor8;
      case 9:
        return centerFor9;
      case 10:
        return centerFor10;
      case "J":
        return centerForJack;
      case "Q":
        return centerForQueen;
      case "K":
        return centerForKing;
      case "A":
        return centerForAce;
    }
  };

  const chooseSide = (side: CardSideType) => {
    switch (side) {
      case "face-up":
        return (
          <div className={`playing-card text-${suitColor}`}>
            <div className="playing-card-side-column">
              <div className="place-center">{value}</div>
              <div className="place-center">{createSmallIcon(suit)}</div>
            </div>
            {createCenterPiece(value)}
            <div className="playing-card-side-column rotate-180">
              <div className="place-center">{value}</div>
              <div className="place-center">{createSmallIcon(suit)}</div>
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
