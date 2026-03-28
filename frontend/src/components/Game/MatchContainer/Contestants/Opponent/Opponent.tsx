import { type PlayerInterface } from "../../../../../app/types";
import "./Opponent.css";
import { useAppSelector } from "../../../../../app/hooks";
import ChipStacks from "../../../../ChipStacks/ChipStacks";
import { useEffect, useState } from "react";

interface OpponentPropsInterface {
  data: PlayerInterface;
}

export default function Opponent({ data }: OpponentPropsInterface) {
  const designKey = useAppSelector(
    (state) => state.game.currentMatch.deckStyle,
  );

  const cardStatusClass = data.isFolded ? "opponent__card--folded" : "";
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    const mediaQuery = window.matchMedia(`(min-width: 1024px)`);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const chipMap = data.chips;

  const handleClick = () => {
    console.log(data);
  };

  return (
    <div
      className={`opponent__card ${cardStatusClass}`}
      data-design={designKey}
    >
      {isLargeScreen && (
        <div className="opponent__chips">
          <ChipStacks
            white={chipMap.white}
            red={chipMap.red}
            blue={chipMap.blue}
            green={chipMap.green}
            black={chipMap.black}
          />
        </div>
      )}

      <div className="opponent__info">
        <h3 className="opponent__name">{data.name}</h3>
        <p className="opponent__stats">${data.money}</p>
      </div>
      {data.isFolded && (
        <div className="opponent__fold-overlay">
          <span>FOLDED</span>
        </div>
      )}
      <div className="opponent__bubble"></div>
      <div>
        <button type="button" onClick={handleClick}>
          check state
        </button>
      </div>
    </div>
  );
}
