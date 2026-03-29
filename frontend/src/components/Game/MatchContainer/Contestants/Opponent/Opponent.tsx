import { type PlayerInterface } from "../../../../../app/types";
import "./Opponent.css";
import { useAppSelector, useMediaQuery } from "../../../../../app/hooks";
import ChipStacks from "../../../../ChipStacks/ChipStacks";
import {
  selectDeckStyle,
  selectOpponentStatusClass,
  selectPlayerChips,
  selectPlayerName,
  selectPlayerMoney,
} from "../../../../../features/game/gameSelectors";

interface OpponentPropsInterface {
  data: PlayerInterface;
}

export default function Opponent({ data }: OpponentPropsInterface) {
  const playerId = data.id;
  const name = useAppSelector((state) => selectPlayerName(state, playerId));
  const money = useAppSelector((state) => selectPlayerMoney(state, playerId));
  const chipMap = useAppSelector((state) => selectPlayerChips(state, playerId));
  const designKey = useAppSelector(selectDeckStyle);
  const cardStatusClass = useAppSelector((state) =>
    selectOpponentStatusClass(state, playerId),
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      className={`opponent__card ${cardStatusClass}`}
      data-design={designKey}
    >
      {isLargeScreen && (
        <div className="opponent__chips">
          <ChipStacks {...chipMap} />
        </div>
      )}

      <div className="opponent__info">
        <h3 className="opponent__name">{name}</h3>
        <p className="opponent__stats">${money}</p>
        <p>{playerId}</p>
      </div>

      {/* Note: You could even move data.isFolded to a selector if you want to be 100% Redux-led! */}
      {data.isFolded && (
        <div className="opponent__fold-overlay">
          <span>FOLDED</span>
        </div>
      )}

      <div className="opponent__bubble" />
      <button
        type="button"
        onClick={() => console.log("Debug Player ID:", playerId, data)}
      >
        check state
      </button>
    </div>
  );
}
