import { useNavigate } from "react-router";
import { royalFlush } from "../../../app/assets";
import { useAppDispatch } from "../../../app/hooks";
import { goToPreGame } from "../../../features/game/gameSlice";
import Hand from "../../Hand/Hand";
import "./Title.css";
import { useCallback, useEffect } from "react";

export default function Title() {
  const winningHand = royalFlush;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navToPreGame = useCallback(() => {
    dispatch(goToPreGame());
    navigate("/game/preGame");
  }, [dispatch, navigate]); // 3. Add dispatch and navigate as dependencies

  useEffect(() => {
    const handleInteraction = (e: Event) => {
      if (e.type === "contextmenu") e.preventDefault();
      navToPreGame();
    };

    const events = ["keydown", "click" /*, "touchstart", "contextmenu" */];

    events.forEach((type) => window.addEventListener(type, handleInteraction));

    return () => {
      events.forEach((type) =>
        window.addEventListener(type, handleInteraction),
      );
    };
  }, [navToPreGame]);

  return (
    <div className="title">
      <h1 className="title__title manga-outline neon-glow-cyan">Poker Face</h1>

      <Hand
        matchType="draw"
        cards={winningHand}
        currentLocation="demo"
        hand="tbd"
      />

      <p className="text-shadow">Hit any key to continue</p>
    </div>
  );
}
