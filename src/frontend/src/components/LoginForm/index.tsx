import "./LoginForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "@/components/Input";
import { login } from "@/services/auth";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, senha: password });
      onLogin();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="login-card"
    >
      <div className="login-card-inner">
        <div className="login-header">
          <h2 className="login-title">Bem-vindo de volta</h2>
          <p className="login-subtitle">
            Acompanhe suas emoções e cuide da sua mente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
          <Input label="Senha" type="password" placeholder="••••••••" value={password} onChange={setPassword} />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button type="submit" className="login-btn login-btn-primary login-btn-full">
              Login
            </button>
          </motion.div>
        </form>

        <div className="login-links">
          <Link to="register" className="login-btn-link">
            Criar conta
          </Link>
          <button className="login-btn-text">Esqueceu a senha?</button>
        </div>

        <p className="login-disclaimer">
          Esta plataforma oferece ferramentas de suporte emocional e não substitui a terapia profissional.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
