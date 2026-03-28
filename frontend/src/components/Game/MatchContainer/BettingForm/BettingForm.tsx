import type { BettingActionType } from "../../../../app/types";
import "./BettingForm.css";

// BettingForm.tsx
import { useState } from "react";

interface BettingFormProps {
  currentPot: number;
  heroMoney: number; // You'll need to pass this from state
  onConfirm: (amount: number, type: BettingActionType) => void;
}

export default function BettingForm({
  currentPot,
  heroMoney,
  onConfirm,
}: BettingFormProps) {
  const [betAmount, setBetAmount] = useState(0);

  return (
    <div className="betting-form-container">
      <h3>Place Your Bet</h3>
      <p>Pot: ${currentPot}</p>

      <div className="bet-slider-group">
        <label>Bet: ${betAmount}</label>
        <input
          type="range"
          min="0"
          max={heroMoney}
          step="5"
          value={betAmount}
          title="bet-input"
          onChange={(e) => setBetAmount(Number(e.target.value))}
        />
      </div>

      <div className="betting-form-actions">
        <button
          type="button"
          className="btn-bet fold"
          onClick={() => onConfirm(0, "fold")}
        >
          Fold
        </button>
        <button
          type="button"
          className="btn-bet confirm"
          onClick={() => onConfirm(betAmount, betAmount > 0 ? "raise" : "call")}
        >
          {betAmount > 0 ? `Raise $${betAmount}` : "Check/Call"}
        </button>
      </div>
    </div>
  );
}
