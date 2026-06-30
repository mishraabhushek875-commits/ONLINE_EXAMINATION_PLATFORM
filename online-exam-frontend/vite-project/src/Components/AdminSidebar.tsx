import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaLayerGroup,
  FaClipboardList,
  FaQuestionCircle,
  FaUserCheck,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { FaRightLong } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";

const nav = [
  { id: 1, name: "Dashboard", to: "/admin", icon: FaHome },
  { id: 2, name: "Students", to: "/admin/students", icon: FaUsers },
  { id: 3, name: "Question Banks", to: "/admin/question-banks", icon: FaLayerGroup },
  { id: 4, name: "Exams", to: "/admin/exams", icon: FaClipboardList },
  { id: 5, name: "Questions", to: "/admin/questions", icon: FaQuestionCircle },
  { id: 6, name: "Assignments", to: "/admin/assignments", icon: FaUserCheck },
  { id: 7, name: "Results", to: "/admin/results", icon: FaChartBar },
  { id: 8, name: "Settings", to: "/admin/settings", icon: FaCog },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
      <div className="space-y-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === "/admin"}
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
                    <Icon size={16} />
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
    </aside>
  );
};

export default AdminSidebar;