import { useAppDispatch } from "../../../app/hooks";
import { goToPreGame } from "../../../features/game/gameSlice";
import "./Title.css";

export default function Title() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(goToPreGame());
  };

  return (
    <div className="title-container">
      <div className="table-wood-outer-border">
        <div className="table-felt-outer-border">
          <h1>Poker Face</h1>

          <p className="text-shadow" onClick={handleClick}>
            Hit any key to continue
          </p>
        </div>
      </div>
    </div>
  );
}
