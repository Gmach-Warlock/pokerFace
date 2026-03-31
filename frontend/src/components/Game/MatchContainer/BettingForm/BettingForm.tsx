import { type BettingInterface } from "../../../../app/types";
import "./BettingForm.css";
import { useState, useEffect } from "react";
import CallButton from "./CallButton/CallButton";
import FoldButton from "./FoldButton/FoldButton";
import RaiseButton from "./RaiseButton/RaiseButton";

export default function BettingForm({
  heroMoney,
  onConfirm,
  currentTableBet = 0,
  currentPlayerBet,
}: BettingInterface) {
  const playerBet = currentPlayerBet ?? 0;

  const callAmount = Math.max(0, currentTableBet - playerBet);
  const [betAmount, setBetAmount] = useState(callAmount);

  useEffect(() => {
    setBetAmount(callAmount);
  }, [callAmount]);

  return (
    <div className="betting-form-container">
      <input
        title="betting input"
        type="range"
        min={currentTableBet + 5} // Min raise is usually 1 increment above table bet
        max={heroMoney}
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
      />

      <div className="betting-form-actions">
        <FoldButton />

        <CallButton
          currentTableBet={currentTableBet}
          currentPlayerBet={playerBet}
          onConfirm={onConfirm}
        />

        {/* Only show Raise if the slider is actually a raise */}
        {betAmount > currentTableBet && (
          <RaiseButton
            currentPlayerBet={playerBet}
            sliderValue={betAmount}
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
}
