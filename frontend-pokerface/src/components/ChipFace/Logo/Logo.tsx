import { createTextColor } from "../../../functions/createTextColor";
import "./Logo.css";

export default function Logo() {
  const color = "black";

  const textColor = createTextColor(color);

  return (
    <div className={`logo-container text-${textColor}`}>
      <div className="letter-p">P</div>
      <div className="letter-f">F</div>
    </div>
  );
}
