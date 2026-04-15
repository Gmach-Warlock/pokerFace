import { useNavigate } from "react-router";
import { useAppSelector } from "../../../app/hooks/gameHooks";
import { useEffect } from "react";
import "./Home.css";
import { API_URL } from "../../../app/global/global";

export default function Home() {
  const authorized = useAppSelector((state) => state.profile.meta.authorized);
  const navigate = useNavigate();

  const myapiurl = API_URL;
  useEffect(() => {
    if (authorized) {
      navigate("/game");
    }
  }, [authorized, navigate]);

  return (
    <div>
      <h1>Poker Face</h1>
      <div className="banner"></div>
      <p>Join the Beta!</p>
      <button type="button">Join</button>
      <span>{myapiurl}</span>
    </div>
  );
}
