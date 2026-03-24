import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../app/hooks";

export default function Protected() {
  const authorized = useAppSelector((state) => state.profile.meta.authorized);

  if (!authorized) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
