import "../LoginForm/LoginForm.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "@/components/Input";
import { register } from "@/services/auth";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({
        nome: firstName,
        sobrenome: lastName,
        email,
        senha: password,
      });

      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar:", error);
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
          <h2 className="login-title">Crie sua conta</h2>
          <p className="login-subtitle">
            Comece a acompanhar suas emoções e cuidar da sua mente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome"
              value={firstName}
              onChange={setFirstName}
            />
            <Input
              label="Sobrenome"
              type="text"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={setLastName}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button type="submit" className="login-btn login-btn-primary login-btn-full">
              Registrar
            </button>
          </motion.div>
        </form>

        <div className="login-links">
          <Link to="/" className="login-btn-link">
            Já tem conta? Entrar
          </Link>
        </div>

        <p className="login-disclaimer">
          Esta plataforma oferece ferramentas de suporte emocional e não substitui a terapia profissional.
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
