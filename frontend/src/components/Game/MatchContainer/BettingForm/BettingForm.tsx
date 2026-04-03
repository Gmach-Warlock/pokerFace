import type { BettingInterface } from "../../../../app/interfaces";
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
      <div className="bet__input"></div>

      <div className="bet__quick"></div>

      <div>
        <input
          title="betting input"
          type="range"
          min={currentTableBet + 5} // Min raise is usually 1 increment above table bet
          max={heroMoney}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
        />
      </div>

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

/* 
const handleSliderChange = (e) => {
  const val = parseFloat(e.target.value); // 0 to 1
  
  // Using Math.pow(val, 2) creates a curve 
  // where the left side of the slider is much more precise.
  const curvedValue = Math.pow(val, 2); 
  
  const actualBet = Math.floor(minBet + (maxBet - minBet) * curvedValue);
  setPendingBet(actualBet);
};

// HTML
<input 
  type="range" 
  min="0" 
  max="1" 
  step="0.01" 
  onChange={handleSliderChange} 
/>
// Helper to handle Quick Bets
const handleQuickBet = (ratio: number) => {
  const calculated = Math.floor(currentPot * ratio);
  // Clamp between minBet and player's total money
  const finalBet = Math.max(minBet, Math.min(calculated, playerMoney));
  setBetAmount(finalBet);
};

// Helper for Manual Input
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseInt(e.target.value) || 0;
  setBetAmount(Math.min(value, playerMoney));
};

<div className="betting-quick-actions" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
  <button onClick={() => handleQuickBet(0.5)}>1/2 Pot</button>
  <button onClick={() => handleQuickBet(0.75)}>3/4 Pot</button>
  <button onClick={() => handleQuickBet(1)}>Pot</button>
  <button onClick={() => setBetAmount(playerMoney)}>Max</button>
</div>

<input 
  type="number" 
  value={betAmount} 
  onChange={handleInputChange}
  className="bet-input-field"
/> */
