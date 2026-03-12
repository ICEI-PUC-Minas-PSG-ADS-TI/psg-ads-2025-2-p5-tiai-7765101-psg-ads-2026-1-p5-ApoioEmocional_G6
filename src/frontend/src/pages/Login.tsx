import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";
import loginIllustration from "@/assets/login-illustration.png";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="login-illustration"
      >
        <motion.img
          src={loginIllustration}
          alt="Calm meditation illustration"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="login-form-side">
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};

export default Login;
