import { UseAppSelector } from "./app/hooks";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";

export default function Root() {
  const authorized = UseAppSelector((state) => state.authorize.authorized);
  return (
    <div>
      <Header />
      <div className="place-center">{authorized ? <Game /> : <Home />}</div>
    </div>
  );
}
