import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./ContextApi";

export const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};