import { useAppSelector, useMediaQuery } from "../../../../../app/hooks";
import ChipStacks from "../../../../ChipStacks/ChipStacks";
import Hand from "../../../../Hand/Hand";
import "./OurHero.css";
import { selectHeroHandEval } from "../../../../../app/middleware";

export default function OurHero() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const hero = useAppSelector((state) => state.game.currentMatch.hero);

  const heroHand = useAppSelector(
    (state) => state.game.currentMatch.hero.currentHand ?? [],
  );
  const heroChips = useAppSelector(
    (state) => state.game.currentMatch.hero.chips,
  );
  const heroEval = useAppSelector(selectHeroHandEval);

  return (
    <div className="our-hero">
      <div className="our-hero__info">
        <div className="our-hero__title-row">
          <p className="our-hero__name">{hero.name}</p>
        </div>
        <div className="our-hero__money">{`$${hero.money}`}</div>
        <div>
          {" "}
          <span className="our-hero__hand-label">{heroEval.displayName}</span>
        </div>
      </div>
      <div className="our-hero__grid">
        <div className="our-hero__hand-container">
          <Hand
            matchType="draw"
            cards={heroHand}
            currentLocation="p1"
            hand={heroEval.handType}
          />
        </div>
        {isLargeScreen && (
          <div className="our-hero__chips">
            <ChipStacks
              white={heroChips.white}
              green={heroChips.green}
              red={heroChips.red}
              blue={heroChips.blue}
              black={heroChips.black}
            />
          </div>
        )}
      </div>
    </div>
  );
}
