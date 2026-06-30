import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import logo from "../assets/logo.png";
import { useUIStore } from "../store/uiStore";

const authLinks = [
  { path: "/login", label: "Login" },
  { path: "/signup", label: "Sign Up" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify",
  ].includes(location.pathname);

  return (
    <nav className="relative z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {!isAuthPage && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              aria-label="Open menu"
            >
              <FaBars size={20} />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-auto" />
          </Link>
        </div>

        {isAuthPage && (
          <div className="flex items-center gap-2">
            {authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {!isAuthPage && (
          <a
            href="https://www.matnite.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 px-4 py-2 hover:shadow-md transition"
          >
            <FaGraduationCap className="text-emerald-500" size={16} />
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 bg-clip-text text-sm font-semibold text-transparent">
              Matnite Infotech
            </span>
          </a>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500 opacity-60" />
    </nav>
  );
};

export default Navbar;
