import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import "./about.css";

const AboutHero = () => {
  return (
    <section className="about-hero" aria-label="Apresentação">
      <div className="about-hero-bg" aria-hidden="true" />
      <div className="about-hero-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="about-hero-badge"
        >
          <Sparkles size={14} />
          Apoio emocional com IA
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="about-hero-title"
        >
          Cuide da sua saúde emocional com{" "}
          <span>EMOTi IA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="about-hero-subtitle"
        >
          Registre seu humor diário, descubra padrões emocionais, converse com
          um assistente de apoio e acesse técnicas de relaxamento — tudo em um
          espaço seguro e acolhedor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="about-hero-actions"
        >
          <Link to="/register" className="about-btn about-btn-primary">
            Começar agora
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="about-btn about-btn-outline">
            Já tenho conta
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
