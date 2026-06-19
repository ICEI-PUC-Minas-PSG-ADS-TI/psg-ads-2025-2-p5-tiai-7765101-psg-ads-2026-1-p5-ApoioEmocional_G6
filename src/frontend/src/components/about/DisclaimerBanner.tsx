import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import "./about.css";

const DisclaimerBanner = () => {
  return (
    <section className="about-disclaimer" aria-label="Aviso legal">
      <div className="about-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="about-disclaimer-banner"
        >
          <ShieldAlert size={22} className="about-disclaimer-icon" />
          <p className="about-disclaimer-text">
            <strong>Importante:</strong> o EMOTi IA é uma ferramenta de apoio e
            autoconsciência emocional.{" "}
            <strong>
              Não substitui psicólogos, terapia ou qualquer diagnóstico
              psicológico.
            </strong>{" "}
            Em situações de crise, busque ajuda profissional — o CVV está
            disponível 24h pelo telefone <strong>188</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DisclaimerBanner;
