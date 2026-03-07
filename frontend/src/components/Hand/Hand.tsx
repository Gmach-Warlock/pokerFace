import type { HandInterface, HandPropsInterface } from "../../app/types";
import Card from "../Card/Card";
import "./Hand.css";

export default function Hand(props: HandPropsInterface) {
  const hand: HandInterface = {
    type: props.hand.type,
    cards: [
      {
        value: props.hand.cards[0].value,
        suit: props.hand.cards[0].suit,
        side: props.hand.cards[0].side,
        currentLocation: props.hand.cards[0].currentLocation,
      },
      {
        value: props.hand.cards[1].value,
        suit: props.hand.cards[1].suit,
        side: props.hand.cards[1].side,
        currentLocation: props.hand.cards[1].currentLocation,
      },
      {
        value: props.hand.cards[2].value,
        suit: props.hand.cards[2].suit,
        side: props.hand.cards[2].side,
        currentLocation: props.hand.cards[2].currentLocation,
      },
      {
        value: props.hand.cards[3].value,
        suit: props.hand.cards[3].suit,
        side: props.hand.cards[3].side,
        currentLocation: props.hand.cards[3].currentLocation,
      },
      {
        value: props.hand.cards[4].value,
        suit: props.hand.cards[4].suit,
        side: props.hand.cards[4].side,
        currentLocation: props.hand.cards[4].currentLocation,
      },
    ],
    hand: "tbd",
    currentLocation: "demo",
  };

  const configureHand = (hand: HandInterface) => {
    switch (hand.type) {
      case "draw":
        return (
          <div className="hand-draw place-center w-full">
            <div className="hand-draw-card1">
              <Card
                value={hand.cards[0].value}
                suit={hand.cards[0].suit}
                side={hand.cards[0].side}
                currentLocation="demo"
              />
            </div>
            <div className="hand-draw-card2">
              <Card
                value={hand.cards[1].value}
                suit={hand.cards[1].suit}
                side={hand.cards[1].side}
                currentLocation="demo"
              />
            </div>
            <div className="hand-draw-card3">
              <Card
                value={hand.cards[2].value}
                suit={hand.cards[2].suit}
                side={hand.cards[2].side}
                currentLocation="demo"
              />
            </div>
            <div className="hand-draw-card4">
              <Card
                value={hand.cards[3].value}
                suit={hand.cards[3].suit}
                side={hand.cards[3].side}
                currentLocation="demo"
              />
            </div>
            <div className="hand-draw-card5">
              <Card
                value={hand.cards[4].value}
                suit={hand.cards[4].suit}
                side={hand.cards[4].side}
                currentLocation="demo"
              />
            </div>
          </div>
        );
      case "holdem":
        return "coming";
      case "stud":
        return "soon";
    }
  };

  const configuredHand = configureHand(hand);

  return <div className="hand-container place-center">{configuredHand}</div>;
}
