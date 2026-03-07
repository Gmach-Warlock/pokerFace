import Card from "../Card/Card";
import "./Hand.css";

export default function Hand() {
  return (
    <div className="hand-container place-center">
      <div className="hand-draw place-center">
        <div className="hand-draw-card1">
          <Card value={`A`} suit="spade" side="face-up" />
        </div>
        <div className="hand-draw-card2">
          <Card value={`K`} suit="spade" side="face-up" />
        </div>
        <div className="hand-draw-card3">
          <Card value={`Q`} suit="spade" side="face-up" />
        </div>
        <div className="hand-draw-card4">
          <Card value={`J`} suit="spade" side="face-up" />
        </div>
        <div className="hand-draw-card5">
          <Card value={10} suit="spade" side="face-up" />
        </div>
      </div>
    </div>
  );
}
