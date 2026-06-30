import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaClipboardList, FaChartBar } from "react-icons/fa";
import { FaRightLong, FaXmark } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

const nav = [
  { id: 1, name: "Dashboard", to: "/", icon: FaHome },
  { id: 2, name: "My Exams", to: "/my-exams", icon: FaClipboardList },
  { id: 3, name: "Results", to: "/results", icon: FaChartBar },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const NavItems = () => (
    <>
      <div className="space-y-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => isSidebarOpen && toggleSidebar()}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-green-100 text-green-700 shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300 ${
                      isActive ? "bg-orange-500" : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-green-500 text-white"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div
        onClick={handleLogout}
        className="rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-2 px-4 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 cursor-pointer w-full flex items-center justify-between"
      >
        <button type="button">Log Out</button>
        <FaRightLong />
      </div>
    </>
  );

  return (
    <>
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-transparent">
            MAT TEST
          </span>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <FaXmark size={18} />
          </button>
        </div>
        <NavItems />
      </aside>

      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 p-5 flex-col justify-between">
        <NavItems />
      </aside>
    </>
  );
};

export default Sidebar;
