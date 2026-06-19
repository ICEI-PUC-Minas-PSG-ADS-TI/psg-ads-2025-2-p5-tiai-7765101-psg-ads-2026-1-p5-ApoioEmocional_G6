import { motion } from "framer-motion";
import "./about.css";

const teamMembers = [
  { name: "Pedro Dias", initials: "PD" },
  { name: "Lucas Dias", initials: "LD" },
  { name: "Arthur Coelho", initials: "AC" },
  { name: "Melissa Baia", initials: "MB" },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

const TeamSection = () => {
  return (
    <section id="equipe" className="about-team" aria-label="Equipe">
      <div className="about-section">
        <div className="about-section-header">
          <span className="about-section-label">Equipe</span>
          <h2 className="about-section-title">Quem construiu o EMOTi IA</h2>
          <p className="about-section-subtitle">
            Desenvolvido por estudantes de Análise e Desenvolvimento de Sistemas
            com foco em tecnologia a serviço do bem-estar emocional.
          </p>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="about-team-card"
            >
              <div className="about-team-avatar">{member.initials}</div>
              <p className="about-team-name">{member.name}</p>
              <p className="about-team-role">Integrante</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="about-advisor"
        >
          <p className="about-advisor-label">Orientadora</p>
          <p className="about-advisor-name">Juliana Padilha</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
