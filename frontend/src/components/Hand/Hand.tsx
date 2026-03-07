import type { HandInterface } from "../../app/types";
import Card from "../Card/Card";
import "./Hand.css";

export default function Hand() {
  const hand: HandInterface = {
    type: "draw",
    cards: [
      {
        value: "A",
        suit: "heart",
        side: "face-up",
      },
      {
        value: "K",
        suit: "heart",
        side: "face-up",
      },
      {
        value: "Q",
        suit: "heart",
        side: "face-up",
      },
      {
        value: "J",
        suit: "heart",
        side: "face-up",
      },
      {
        value: 10,
        suit: "heart",
        side: "face-up",
      },
    ],
    hand: "tbd",
    currentLocation: "demo",
  };

  switch (hand.type) {
    case "draw":
      return (
        <div className="hand-draw place-center w-full">
          <div className="hand-draw-card1">
            <Card value={`A`} suit="heart" side="face-up" />
          </div>
          <div className="hand-draw-card2">
            <Card value={`K`} suit="heart" side="face-up" />
          </div>
          <div className="hand-draw-card3">
            <Card value={`Q`} suit="heart" side="face-up" />
          </div>
          <div className="hand-draw-card4">
            <Card value={`J`} suit="heart" side="face-up" />
          </div>
          <div className="hand-draw-card5">
            <Card value={10} suit="heart" side="face-up" />
          </div>
        </div>
      );
    case "holdem":
      return "coming";
    case "stud":
      return "soon";
  }

  return (
    <div className="hand-container place-center">
      <div className="hand-draw place-center w-full">
        <div className="hand-draw-card1">
          <Card value={`A`} suit="heart" side="face-up" />
        </div>
        <div className="hand-draw-card2">
          <Card value={`K`} suit="heart" side="face-up" />
        </div>
        <div className="hand-draw-card3">
          <Card value={`Q`} suit="heart" side="face-up" />
        </div>
        <div className="hand-draw-card4">
          <Card value={`J`} suit="heart" side="face-up" />
        </div>
        <div className="hand-draw-card5">
          <Card value={10} suit="heart" side="face-up" />
        </div>
      </div>
    </div>
  );
}
