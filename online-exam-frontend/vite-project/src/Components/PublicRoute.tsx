import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { decodeJwt } from "../lib/jwt";

const PublicRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    const payload = decodeJwt(token);
    return <Navigate to={payload?.role === "admin" ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
