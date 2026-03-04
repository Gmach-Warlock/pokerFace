import { UseAppSelector } from "./app/hooks";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";

export default function Root() {
  const isPlaying = UseAppSelector((state) => state.game.isPlaying);

  return (
    <div className="bg-black text-white">
      <Header />
      {isPlaying ? <Game /> : <Home />}
    </div>
  );
}
