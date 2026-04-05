import type { BettingInterface } from "../../../../app/interfaces/matchInterfaces";
import "./BettingForm.css";
import { useState, useEffect } from "react";
import CallButton from "./CallButton/CallButton";
import FoldButton from "./FoldButton/FoldButton";
import RaiseButton from "./RaiseButton/RaiseButton";
import QuarterInButton from "./QuarterInButton/QuarterInButton";
import HalfInButton from "./HalfButton/HalfInButton";
import ThreeQuartersInButton from "./ThreeQuartersInButton/ThreeQuartersInButton";
import AllInButton from "./AllInButton/AllInButton";
import { selectPot } from "../../../../features/match/matchSelectors";
import { useAppSelector } from "../../../../app/hooks/gameHooks";
import MatchPotButton from "./MatchPotButton/MatchPotButton";

export default function BettingForm({
  heroMoney,
  onConfirm,
  currentTableBet = 0,
  currentPlayerBet,
}: BettingInterface) {
  const playerBet = currentPlayerBet ?? 0;

  const callAmount = Math.max(0, currentTableBet - playerBet);
  const [betAmount, setBetAmount] = useState(callAmount);
  const currentPot = useAppSelector(selectPot);

  useEffect(() => {
    setBetAmount(callAmount);
  }, [callAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBetAmount(val);
  };

  const handleQuickBet = (percentage: number) => {
    // Calculate the fraction of heroMoney
    const amount = Math.floor((heroMoney ?? 0) * percentage);

    // Optional: Ensure it's at least the minimum call/raise amount
    const clampedAmount = Math.max(amount, currentTableBet + 5);

    setBetAmount(clampedAmount);
  };

  const handlePotBet = (multiplier: number) => {
    // Assuming 'currentPot' is passed in as a prop
    const potSize = currentPot + callAmount;
    const amount = Math.floor(potSize * multiplier);

    // Keep using your clamped logic!
    setBetAmount(Math.min(amount, heroMoney ?? 0));
  };

  return (
    <div className="betting-form-container">
      <div className="bet__table-status">
        <p>
          Current Table Bet: <strong>${currentTableBet}</strong>
        </p>
        {callAmount > 0 ? (
          <p className="call-warning">
            To Stay: <strong>${callAmount}</strong>
          </p>
        ) : (
          <p className="check-msg">Pot is checked to you.</p>
        )}
      </div>

      <div className="bet__input">
        <label htmlFor="bet__manual-entry">Enter Bet Amount</label>
        <input
          type="number"
          name="bet__manual-entry"
          id="bet__manual-entry"
          className="bet__manual-entry"
          value={betAmount}
          onChange={handleInputChange}
        />
      </div>

      <div className="bet__quick">
        <QuarterInButton onClick={() => handleQuickBet(0.25)} />
        <HalfInButton onClick={() => handleQuickBet(0.5)} />
        <ThreeQuartersInButton onClick={() => handleQuickBet(0.75)} />
        <AllInButton onClick={() => handleQuickBet(1.0)} />
        <MatchPotButton onClick={() => handlePotBet(1.0)} />
      </div>

      <div>
        <input
          title="betting input"
          type="range"
          min={currentTableBet + 5} // Min raise is usually 1 increment above table bet
          max={heroMoney}
          value={betAmount}
          onChange={handleInputChange}
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
