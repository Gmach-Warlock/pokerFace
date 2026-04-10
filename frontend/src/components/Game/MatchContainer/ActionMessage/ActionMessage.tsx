import { useAppSelector } from "../../../../app/hooks/gameHooks";
import "./ActionMessage.css";

export default function ActionMessage() {
  const actionMessage = useAppSelector(
    (state) => state.match.currentHand.actionMessage,
  );

  return (
    <div>
      <p>{actionMessage}</p>
    </div>
  );
}
