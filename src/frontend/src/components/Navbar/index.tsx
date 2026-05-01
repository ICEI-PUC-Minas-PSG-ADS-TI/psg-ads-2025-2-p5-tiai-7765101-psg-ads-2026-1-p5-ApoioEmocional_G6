import "./Navbar.css";
import { User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/auth";
import ThemeToggle from "../ThemeToggle";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Timeline", to: "/timeline" },
  { label: "Chat", to: "/chat" },
];

const Navbar = () => {
  const location = useLocation();

  const activeItem =
    navItems.find((item) =>
      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
    )?.label ?? "";

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">EMOTi IA</span>

        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`navbar-link${activeItem === item.label ? " active" : ""}`}
            >
              {item.label}
            </Link>
           ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          <div className="navbar-avatar">
            <User size={16} />
          </div>
          <button onClick={handleLogout} className="logout-button" aria-label="Sair" title="Sair">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
