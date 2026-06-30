import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />

      {/* Mobile-only topbar with hamburger */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
          aria-label="Open menu"
        >
          <FaBars size={16} />
        </button>
        <span className="font-bold text-gray-800">Admin Panel</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;