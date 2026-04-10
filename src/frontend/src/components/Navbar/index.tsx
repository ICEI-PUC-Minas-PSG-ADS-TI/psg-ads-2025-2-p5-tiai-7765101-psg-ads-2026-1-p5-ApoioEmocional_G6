import "./Navbar.css";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { logout } from "../../services/auth";

const navItems = ["Inicio"];

interface NavbarProps {
  active?: string;
}

const Navbar = ({ active = "Inicio" }: NavbarProps) => {
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
            <button
              key={item}
              className={`navbar-link${active === item ? " active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="navbar-avatar">
          <User size={16} />
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
