import "./Opponent.css";
import type { PlayerInterface } from "../../../../../app/interfaces/matchInterfaces";
import {
  useAppSelector,
  useMediaQuery,
} from "../../../../../app/hooks/gameHooks";
import ChipStacks from "../../../../general/ChipStacks/ChipStacks";
import {
  selectDeckStyle,
  selectOpponentStatusClass,
  selectPlayerChips,
  selectPlayerName,
  selectPlayerMoney,
} from "../../../../../features/match/matchSelectors";

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
      </div>

      {data.currentMatch.isFolded && (
        <div className="opponent__fold-overlay">
          <span>FOLDED</span>
        </div>
      )}

      <div className="opponent__bubble"></div>
      {/*       <button
        type="button"
        onClick={() => console.log("Debug Player ID:", playerId, data)}
      >
        state
      </button> */}
    </div>
  );
}
