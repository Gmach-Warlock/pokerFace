import { Outlet } from "react-router";
import Header from "./components/pages/Header/Header";

export default function Root() {
  return (
    <div>
      <Header />

      <Outlet />
    </div>
  );
}
