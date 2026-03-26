// OurHero.tsx
import { useAppSelector } from "../../../../../app/hooks";
import ChipStacks from "../../../../ChipStacks/ChipStacks";
import Hand from "../../../../Hand/Hand";
import "./OurHero.css";

export default function OurHero() {
  // Assuming the human player's hand is stored in your profile or game state
  const heroName = useAppSelector((state) => state.profile.playerData.name);
  const heroMoney = useAppSelector((state) => state.profile.playerData.money);
  const heroHand =
    useAppSelector((state) => state.game.currentMatch.herosHand) || [];

  const heroChips = useAppSelector((state) => state.profile.playerData.chips);

  return (
    <div className="our-hero">
      <div className="our-hero__info">
        <div className="our-hero__title">{heroName}</div>
        <div className="our-hero__money">{`$${heroMoney}`}</div>
      </div>

      <div className="our-hero__grid">
        <div className="our-hero__hand-container">
          <Hand
            matchType="draw"
            cards={heroHand}
            currentLocation="p1"
            hand="royal-flush"
          />
        </div>

        <div className="our-hero__chips">
          <ChipStacks
            white={heroChips.white}
            green={heroChips.green}
            red={heroChips.red}
            blue={heroChips.blue}
            black={heroChips.black}
          />
        </div>
      </div>
    </div>
  );
}
