import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import "./PublicLayout.css";

const PublicLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="public-layout">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="public-header"
      >
        <div className="public-header-inner">
          <Link to="/" className="public-header-logo">
            EMOTi IA
          </Link>

          <nav className="public-header-nav" aria-label="Navegação pública">
            {isLanding ? (
              <>
                <a href="#funcionalidades" className="public-header-link">
                  Funcionalidades
                </a>
                <a href="#sobre" className="public-header-link">
                  Sobre
                </a>
                <a href="#equipe" className="public-header-link">
                  Equipe
                </a>
              </>
            ) : (
              <>
                <Link to="/#funcionalidades" className="public-header-link">
                  Funcionalidades
                </Link>
                <Link to="/sobre" className="public-header-link">
                  Sobre nós
                </Link>
              </>
            )}
          </nav>

          <div className="public-header-actions">
            <ThemeToggle />
            <Link to="/login" className="public-header-btn public-header-btn-outline">
              Entrar
            </Link>
            <Link to="/register" className="public-header-btn public-header-btn-primary">
              Criar conta
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="public-layout-content">
        <Outlet />
      </div>

      <footer className="public-footer">
        © {new Date().getFullYear()} EMOTi IA — Apoio emocional com inteligência artificial
      </footer>
    </div>
  );
};

export default PublicLayout;
