import { motion } from "framer-motion";
import { Heart, Target } from "lucide-react";
import "./about.css";

const MissionSection = () => {
  return (
    <section id="sobre" className="about-mission" aria-label="Missão">
      <div className="about-section about-mission-grid">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="about-section-label">Nossa missão</span>
          <h2 className="about-section-title" style={{ textAlign: "left" }}>
            Um espaço digital para autoconsciência emocional
          </h2>
          <p className="about-mission-text">
            Milhões de pessoas adiam a reflexão sobre suas emoções por falta de
            ferramentas acessíveis e pelo estigma em torno da saúde mental. O
            EMOTi IA nasce para preencher essa lacuna.
          </p>
          <p className="about-mission-text">
            Oferecemos um meio simples para registro diário de humor, desabafos
            em texto livre e visualização de tendências emocionais — com apoio
            de inteligência artificial e recursos de acolhimento quando
            necessário.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="about-mission-card"
        >
          <div className="about-mission-card-icon">
            <Target size={22} />
          </div>
          <h3 className="about-mission-card-title">Para quem é</h3>
          <p className="about-mission-text">
            Jovens e adultos que desejam acompanhar a própria saúde emocional,
            refletir sobre o humor e identificar padrões ao longo do tempo —
            sem necessariamente estar em acompanhamento psicológico.
          </p>
          <div className="about-mission-card-icon" style={{ marginTop: "1.5rem" }}>
            <Heart size={22} />
          </div>
          <h3 className="about-mission-card-title">Como ajudamos</h3>
          <p className="about-mission-text" style={{ marginBottom: 0 }}>
            Democratizamos o acesso a recursos de autocuidado emocional,
            incentivamos a autoconsciência e conectamos usuários à ajuda
            profissional quando necessário.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
