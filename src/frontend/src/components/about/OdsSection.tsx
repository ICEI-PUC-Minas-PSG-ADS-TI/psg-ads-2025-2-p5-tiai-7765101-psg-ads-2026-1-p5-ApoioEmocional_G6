import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import "./about.css";

const OdsSection = () => {
  return (
    <section className="about-ods" aria-label="ODS 3">
      <div className="about-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="about-ods-card"
        >
          <div className="about-ods-icon">
            <Globe size={28} />
          </div>
          <div className="about-ods-content">
            <h3>ODS 3 — Saúde e Bem-Estar</h3>
            <p>
              Alinhado ao Objetivo de Desenvolvimento Sustentável 3 da ONU,
              promovemos uma vida saudável e o bem-estar para todos, oferecendo
              uma ferramenta acessível de reflexão e monitoramento emocional.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OdsSection;
