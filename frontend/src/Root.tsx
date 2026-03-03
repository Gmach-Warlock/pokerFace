import { UseAppSelector } from "./app/hooks";
import Game from "./components/Game/Game";
import Home from "./components/Home/Home";

export default function Root() {
  const isPlaying = UseAppSelector((state) => state.game.isPlaying);

  return (
    <div className="bg-black text-white">{isPlaying ? <Game /> : <Home />}</div>
  );
}
