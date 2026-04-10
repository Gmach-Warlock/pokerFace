import "./LevelUpOverlay.css";
import { useEffect } from "react";

interface LevelUpProps {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpOverlay({ newLevel, onClose }: LevelUpProps) {
  useEffect(() => {
    // Trigger the jingle when the component mounts
    const audio = new Audio("/assets/sounds/level-up-jingle.mp3");
    audio.volume = 0.5;
    audio.play();
  }, []);

  return (
    <div className="levelup-overlay">
      <div className="levelup-content">
        <h1 className="glitch-text">NETWORK SYNC COMPLETE</h1>
        <p>GARY HAS ASCENDED TO</p>
        <div className="level-number">LEVEL {newLevel}</div>

        <button className="ok-button" onClick={onClose}>
          ACKNOWLEDGE
        </button>
      </div>
    </div>
  );
}
