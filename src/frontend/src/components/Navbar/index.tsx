import "./Navbar.css";
import { User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getToken, logout } from "../../services/auth";
import ThemeToggle from "../ThemeToggle";
import { motion } from "framer-motion";
const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Chat", to: "/chat" },
  { label: "Linha do Tempo", to: "/timeline" },
];

const Navbar = () => {
  const location = useLocation();
  const token = getToken();

  if (!token) return null;

  const currentItem = navItems.find((item) => item.to === location.pathname);
  const active = currentItem?.label ?? "Inicio";

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="navbar"
    >
      <div className="navbar-inner">
        <span className="navbar-logo">EMOTi IA</span>

        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`navbar-link${active === item.label ? " active" : ""}`}
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
    </motion.nav>
  );
};

export default Navbar;
