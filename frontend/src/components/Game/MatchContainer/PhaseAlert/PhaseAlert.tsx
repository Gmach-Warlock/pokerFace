import type { GamePhaseType } from "../../../../app/types/matchTypes";
import "./PhaseAlert.css";

interface PhaseAlertProps {
  phase: GamePhaseType;
}

export default function PhaseAlert({ phase }: PhaseAlertProps) {
  if (!phase || phase === "notInGameYet") return null;

  // You can derive this from your 'locale' or 'level' in the future
  const animationType = "zoom-depth";

  return (
    <div key={phase} className="phase-overlay" data-animation={animationType}>
      <h2 className="phase-text">{phase.replace(/([A-Z])/g, " $1")}</h2>
    </div>
  );
}
