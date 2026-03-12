import { Outlet } from "react-router";

export default function Game() {
  return (
    <div className="game-container">
      <Outlet />
    </div>
  );
}
