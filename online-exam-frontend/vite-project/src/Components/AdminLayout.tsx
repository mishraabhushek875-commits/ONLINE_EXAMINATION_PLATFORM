import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;