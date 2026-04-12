import type { BettingInterface } from "../../../../app/interfaces/matchInterfaces";
import { useAppSelector } from "../../../../app/hooks/gameHooks";
import "./BettingForm.css";
import { useState, useEffect } from "react";
import CallButton from "./CallButton/CallButton";
import FoldButton from "./FoldButton/FoldButton";
import RaiseButton from "./RaiseButton/RaiseButton";
import QuarterInButton from "./QuarterInButton/QuarterInButton";
import HalfInButton from "./HalfButton/HalfInButton";
import ThreeQuartersInButton from "./ThreeQuartersInButton/ThreeQuartersInButton";
import { selectPot } from "../../../../features/match/selectors/stateSelectors";
import AllInButton from "./AllInButton/AllInButton";
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
  const displayMoney = heroMoney && heroMoney > 0 ? heroMoney : 0;

  useEffect(() => {
    setBetAmount(callAmount);
  }, [callAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBetAmount(val);
  };

  const handleQuickBet = (percentage: number) => {
    const amount = Math.floor((heroMoney ?? 0) * percentage);

    const minRaise = currentTableBet + 5;
    const clampedAmount = Math.min(displayMoney, Math.max(amount, minRaise));

    setBetAmount(clampedAmount);
  };

  const handlePotBet = (multiplier: number) => {
    const potSize = currentPot + callAmount;
    const amount = Math.floor(potSize * multiplier);

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
          min={currentTableBet + 5}
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
