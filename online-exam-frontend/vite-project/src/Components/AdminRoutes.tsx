// src/Components/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { decodeJwt } from "../lib/jwt";

const AdminRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeJwt(token);
  if (payload?.role !== "admin") {
    // Logged in, but not an admin — send back to the student dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;