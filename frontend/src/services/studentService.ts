import api from "./api";
import { ApiResponse, User } from "@/types";

// NOTE: your backend doesn't expose a users-list route yet.
// Add this in a new userController + userRoutes (admin-only):
//   GET /api/users?role=student&page=&limit=&search=
//   PATCH /api/users/:id/status   (activate / deactivate)
export const studentService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<User[]>>("/users", { params: { role: "student", ...params } }),

  updateStatus: (id: number, status: "active" | "inactive") =>
    api.patch<ApiResponse<User>>(`/users/${id}/status`, { status }),
};
