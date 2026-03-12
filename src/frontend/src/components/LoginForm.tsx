import { useState } from "react";
import { motion } from "framer-motion";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Track your emotions and take care of your mind.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button type="submit" className="btn btn-primary btn-full">
              Login
            </button>
          </motion.div>
        </form>

        <div className="login-links">
          <button className="btn-link">Create account</button>
          <button className="btn-text">Forgot password?</button>
        </div>

        <p className="login-disclaimer">
          This platform offers emotional support tools and does not replace professional therapy.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
