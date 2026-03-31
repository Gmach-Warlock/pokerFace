import { useAppSelector } from "../../../../app/hooks";
import { selectOpponents } from "../../../../features/match/matchSelectors";
import ArenaCenter from "../ArenaCenter/ArenaCenter";
import "./Contestants.css";
import Opponent from "./Opponent/Opponent";
import OurHero from "./OurHero/OurHero";

export default function Contestants() {
  const opponents = useAppSelector(selectOpponents);

  return (
    <div className="match__contestants">
      <div className="contestants__container">
        <div className="opponents">
          {opponents.map((opponent, index) => (
            <div key={index} className="opponent">
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
