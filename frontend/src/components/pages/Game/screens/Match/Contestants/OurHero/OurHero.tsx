import {
  useAppSelector,
  useMediaQuery,
} from "../../../../../../../app/hooks/gameHooks";
import ChipStacks from "../../../../../../general/ChipStacks/ChipStacks";
import "./OurHero.css";
import { selectDeckStyle } from "../../../../../../../features/match/selectors/baseSelectors";
import {
  selectHeroName,
  selectHeroMoney,
  selectHeroHand,
  selectHeroChips,
  selectHeroIsFolded,
  selectHeroHandRank,
} from "../../../../../../../features/match/selectors/heroSelectors";

import Hand from "../../../../../../general/Hand/Hand";

export default function Hero() {
  const name = useAppSelector(selectHeroName);
  const money = useAppSelector(selectHeroMoney);
  const chipMap = useAppSelector(selectHeroChips);
  const hand = useAppSelector(selectHeroHand);
  const isFolded = useAppSelector(selectHeroIsFolded);
  const designKey = useAppSelector(selectDeckStyle);
  const handRank = useAppSelector(selectHeroHandRank);
  const matchType = useAppSelector(
    (state) => state.game.currentMatch.matchType,
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      className={`hero__container ${isFolded ? "hero--folded" : ""}`}
      data-design={designKey}
    >
      <div className="hero__visuals">
        <div className="hero__info">
          <div className="hero__identity">
            <h2 className="hero__name">{name}</h2>
            <p className="hero__amount">${money}</p>

            {!isFolded && hand.length >= 5 && (
              <span className="hero__hand-rank">{handRank.label}</span>
            )}
          </div>
        </div>
        <div className="hero__hand">
          <Hand
            matchType={matchType}
            cards={hand}
            hand="tbd"
            currentLocation="p1"
          />
        </div>

        {isLargeScreen && (
          <div className="hero__chips">
            <ChipStacks {...chipMap} />
          </div>
        )}
      </div>

      {isFolded && <div className="hero__status-tag">FOLDED</div>}
    </div>
  );
}
