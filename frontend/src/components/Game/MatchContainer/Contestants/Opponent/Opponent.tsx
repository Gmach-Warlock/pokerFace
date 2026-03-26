import { type PlayerInterface } from "../../../../../app/types";
import "./Opponent.css";
import { useAppSelector } from "../../../../../app/hooks";

interface OpponentPropsInterface {
  data: PlayerInterface;
}

export default function Opponent({ data }: OpponentPropsInterface) {
  // Grab the design key just like in ArenaCenter
  const designKey = useAppSelector(
    (state) => state.game.currentMatch.deckStyle,
  );

  return (
    /* Apply the data-design attribute here */
    <div className="opponent-card" data-design={designKey}>
      <div className="opponent-info">
        <h3 className="opponent-name">{data.name}</h3>
        <p className="opponent-stats">${data.money}</p>
      </div>

      <div className="opponent-hand-wrapper"></div>
    </div>
  );
}
