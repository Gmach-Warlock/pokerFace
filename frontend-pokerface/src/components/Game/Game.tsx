import Card from "../Card/Card";
import ChipFace from "../ChipFace/ChipFace";
import ChipSide from "../ChipSide/ChipSide";

export default function Game() {
  return (
    <div className="main-container">
      <h1>Poker Face</h1>
      <Card />
      <p className="text-shadow p-2">Hit any key to continue</p>
      <ChipFace />
      <ChipSide />
    </div>
  );
}
