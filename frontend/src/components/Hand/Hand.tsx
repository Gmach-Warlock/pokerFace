import type { HandInterface } from "../../app/types";
import Card from "../Card/Card";
import "./Hand.css";

export default function Hand(props: HandInterface) {
  const hand: HandInterface = {
    type: props.type,
    cards: [
      {
        value: props.cards[0].value,
        suit: props.cards[0].suit,
        side: props.cards[0].side,
        currentLocation: props.cards[0].currentLocation,
      },
      {
        value: props.cards[1].value,
        suit: props.cards[1].suit,
        side: props.cards[1].side,
        currentLocation: props.cards[1].currentLocation,
      },
      {
        value: props.cards[2].value,
        suit: props.cards[2].suit,
        side: props.cards[2].side,
        currentLocation: props.cards[2].currentLocation,
      },
      {
        value: props.cards[3].value,
        suit: props.cards[3].suit,
        side: props.cards[3].side,
        currentLocation: props.cards[3].currentLocation,
      },
      {
        value: props.cards[4].value,
        suit: props.cards[4].suit,
        side: props.cards[4].side,
        currentLocation: props.cards[4].currentLocation,
      },
    ],
    hand: props.hand,
    currentLocation: props.currentLocation,
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
