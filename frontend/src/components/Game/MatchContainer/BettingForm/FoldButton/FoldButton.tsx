import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../app/hooks/gameHooks";
import { selectHerosId } from "../../../../../features/match/selectors/heroSelectors";
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
