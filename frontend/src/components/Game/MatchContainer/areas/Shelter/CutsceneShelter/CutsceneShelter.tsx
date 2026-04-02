import { useEffect, useState } from "react";
import { useSound } from "../../../../../../app/hooks";

export interface SoundTrackInterface {
  play: (sprite?: string | number) => number;
  stop: (id?: number) => this;
  fade: (from: number, to: number, duration: number, id?: number) => this;
  unload: () => void;
}
export interface MatchTransitionPropsType {
  location: string;
  opponentCount: number;
  message?: string; // Optional custom message (defaults to GET READY!)
  track: string; // The specific audio asset to play
  onComplete: () => void;
}

export default function MatchTransition({
  location,
  opponentCount,
  message = "GET READY!",
  track,
  onComplete,
}: MatchTransitionPropsType) {
  const [stage, setStage] = useState(0);
  const { playSound } = useSound();

  useEffect(() => {
    // 1. Start the passed track immediately
    const ambientMusic = playSound(track, 0.4, true);

    // 2. Timing sequence
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 2000);
    const timer3 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (ambientMusic) {
        ambientMusic.fade(0.4, 0, 1000);
        setTimeout(() => {
          ambientMusic.stop();
          ambientMusic.unload();
        }, 1000);
      }
    };
  }, [onComplete, playSound, track]); // Track is now a dependency

  return (
    <div className="punchout-overlay">
      <div className={`transition-content ${stage >= 1 ? "visible" : ""}`}>
        {/* Dynamic Message */}
        <h1 className="retro-text blink">{message.toUpperCase()}</h1>

        {stage >= 2 && (
          <div className="match-details animate-slide-up">
            <p className="location-text">LOCATION: {location.toUpperCase()}</p>
            <div className="divider" />
            <p className="opponent-text">
              {opponentCount} OPPONENTS STANDING BY
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
