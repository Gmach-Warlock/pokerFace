import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { selectHerosId } from "../../../../../features/match/matchSelectors";
import { foldHand } from "../../../../../features/match/matchSlice";

export default function FoldButton() {
  const dispatch = useAppDispatch();
  const herosId = useAppSelector(selectHerosId);

  const handleFold = () => {
    if (herosId) {
      dispatch(foldHand({ playerId: herosId }));
    }
  };
  return (
    <div>
      <button type="button" className="btn btn--fold" onClick={handleFold}>
        Fold
      </button>
    </div>
  );
}
