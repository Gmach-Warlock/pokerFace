import type { GamePhaseType } from "../../../../app/types";

interface PhaseAlertProps {
  phase: GamePhaseType;
}

export default function PhaseAlert({ phase }: PhaseAlertProps) {
  if (!phase) return null;

  return (
    <div key={phase} className="phase-overlay">
      <h2 className="phase-text">{phase}</h2>
    </div>
  );
}
