import "./Halls.css";
import Contestants from "../../Contestants/Contestants";

export default function Halls() {
  return (
    <div className="match__arena halls">
      {/* Background Decorative Elements */}
      <div className="halls__backdrop">
        <div className="halls__ceiling-vault" />
        <div className="halls__pillar left" />
        <div className="halls__pillar right" />
        <div className="halls__floor-shadow" />
      </div>

      {/* Main Game Content */}
      <div className="halls__content">
        <Contestants />
      </div>
    </div>
  );
}
