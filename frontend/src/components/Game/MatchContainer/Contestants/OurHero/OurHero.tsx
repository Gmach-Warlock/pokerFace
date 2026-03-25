// OurHero.tsx
import { useAppSelector } from "../../../../../app/hooks";
import { type CardInterface } from "../../../../../app/types";
import ChipStacks from "../../../../ChipStacks/ChipStacks";
import Hand from "../../../../Hand/Hand";
import "./OurHero.css";

export default function OurHero() {
  // Assuming the human player's hand is stored in your profile or game state
  const heroHand =
    useAppSelector((state) => state.profile.playerData.currentHand) || [];

  const heroChips = useAppSelector((state) => state.profile.playerData.chips);

  // Mocking 5 face-up cards for the Hero so you can test the 'draw' layout
  const mockHeroHand: CardInterface[] =
    heroHand.length > 0
      ? heroHand
      : [
          { value: 10, suit: "heart", side: "face-up", currentLocation: "p1" },
          { value: "J", suit: "heart", side: "face-up", currentLocation: "p1" },
          { value: "Q", suit: "heart", side: "face-up", currentLocation: "p1" },
          { value: "K", suit: "heart", side: "face-up", currentLocation: "p1" },
          { value: "A", suit: "heart", side: "face-up", currentLocation: "p1" },
        ];

  return (
    <div className="our-hero">
      <div className="our-hero__title">Your Hand</div>
      <div className="our-hero__hand-container">
        <Hand
          matchType="draw"
          cards={mockHeroHand}
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
  );
}
