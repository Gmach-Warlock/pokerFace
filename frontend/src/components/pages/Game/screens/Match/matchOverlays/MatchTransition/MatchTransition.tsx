import { useEffect, useState } from "react";
import "./MatchTransition.css";

export interface MatchTransitionPropsType {
  location: string;
  opponentCount: number;
  onComplete: () => void;
}

export default function MatchTransition({
  location,
  opponentCount,
  onComplete,
}: MatchTransitionPropsType) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Punch-Out style timing sequence
    const timer1 = setTimeout(() => setStage(1), 500); // Show "GET READY"
    const timer2 = setTimeout(() => setStage(2), 2000); // Show Location info
    const timer3 = setTimeout(() => onComplete(), 3500); // Move to Game

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="punchout-overlay">
      <div className={`transition-content ${stage >= 1 ? "visible" : ""}`}>
        <h1 className="retro-text blink">GET READY!</h1>

        {stage >= 2 && (
          <div className="match-details">
            <p className="location-text">LOCATION: {location.toUpperCase()}</p>
            <p className="opponent-text">
              {opponentCount} OPPONENTS STANDING BY
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
