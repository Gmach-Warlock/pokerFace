import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const UseAppDispatch: () => AppDispatch = useDispatch;
