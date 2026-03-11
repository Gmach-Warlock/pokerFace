import { royalFlush } from "../../../app/assets";
import { useAppDispatch } from "../../../app/hooks";
import { goToPreGame } from "../../../features/game/gameSlice";
import Chip from "../../Chip/Chip";
import Hand from "../../Hand/Hand";
import "./Title.css";

export default function Title() {
  const winningHand = royalFlush;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(goToPreGame());
  };

  return (
    <div className="title-container">
      <h1>Poker Face</h1>

      <Hand type="draw" cards={winningHand} currentLocation="demo" hand="tbd" />

      <p className="text-shadow" onClick={handleClick}>
        Hit any key to continue
      </p>

      <Chip />
    </div>
  );
}
