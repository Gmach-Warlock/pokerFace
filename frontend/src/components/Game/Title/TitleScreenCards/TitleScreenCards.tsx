import { useState } from "react";
import "./TitleScreenCards.css";
import "./TitleScreenAnimations.css";
import Hand from "../../../Hand/Hand";
import { royalFlush } from "../../../../app/assets/matchAssets";

const PATTERNS = [
  "standard",
  "mirror",
  "glitch",
  "high-rise",
  "twist",
  "twist-mirror",
];

export default function TitleScreenCards() {
  const [currentPattern, setCurrentPattern] = useState("standard");
  const [cycleCount, setCycleCount] = useState(0);

  const handleAnimationLoop = () => {
    const nextCycle = cycleCount + 1;

    if (nextCycle >= 2) {
      const otherPatterns = PATTERNS.filter((p) => p !== currentPattern);
      const randomPattern =
        otherPatterns[Math.floor(Math.random() * otherPatterns.length)];

      setCurrentPattern(randomPattern);
      setCycleCount(0);
    } else {
      setCycleCount(nextCycle);
    }
  };

  return (
    <div
      className="deck-container"
      data-animation-pattern={currentPattern}
      onAnimationIteration={handleAnimationLoop}
    >
      <Hand
        key={`${currentPattern}-${cycleCount}`}
        matchType="draw"
        cards={royalFlush}
        currentLocation="demo"
        isTitle={true}
        hand="royal-flush"
      />
    </div>
  );
}
