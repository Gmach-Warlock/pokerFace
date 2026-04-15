import { useAppSelector } from "../../../../../../app/hooks/gameHooks";
import { selectOpponents } from "../../../../../../features/match/selectors/playerSelectors";
import ArenaCenter from "../ArenaCenter/ArenaCenter";
import "./Contestants.css";
import Opponent from "./Opponent/Opponent";
import OurHero from "./OurHero/OurHero";

export default function Contestants() {
  const opponents = useAppSelector(selectOpponents);
  const visibleOpponents = opponents.filter(
    (p) => !p.general.isDealer && p.general.type !== "human",
  );

  return (
    <div className="match__contestants">
      <div className="contestants__container">
        <div className="opponents">
          {visibleOpponents.map((opponent) => (
            <div key={opponent.general.id} className="opponent">
              <Opponent data={opponent} />
            </div>
          ))}
        </div>

        <ArenaCenter />

        <OurHero />
      </div>
    </div>
  );
}
