import { motion } from "framer-motion";
import {
  Smile,
  LineChart,
  Clock,
  MessageCircle,
  Wind,
  Phone,
} from "lucide-react";
import "./about.css";

const features = [
  {
    icon: Smile,
    title: "Registro de emoções",
    description:
      "Registre como você se sente todos os dias com humores e anotações em texto livre.",
  },
  {
    icon: LineChart,
    title: "Dashboard e insights",
    description:
      "Visualize gráficos semanais e mensais para identificar padrões emocionais ao longo do tempo.",
  },
  {
    icon: Clock,
    title: "Linha do tempo",
    description:
      "Revise seu histórico completo de registros com filtros por emoção e período.",
  },
  {
    icon: MessageCircle,
    title: "Chat com IA",
    description:
      "Converse com um assistente de apoio emocional disponível quando você precisar desabafar.",
  },
  {
    icon: Wind,
    title: "Acalme-se agora",
    description:
      "Técnicas guiadas de respiração e relaxamento para momentos de ansiedade ou estresse.",
  },
  {
    icon: Phone,
    title: "Contatos de ajuda",
    description:
      "Encaminhamento para órgãos competentes, como o CVV (188), em momentos de crise.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const FeaturesSection = () => {
  return (
    <section id="funcionalidades" className="about-section" aria-label="Funcionalidades">
      <div className="about-section-header">
        <span className="about-section-label">Funcionalidades</span>
        <h2 className="about-section-title">Tudo que você precisa para o autocuidado</h2>
        <p className="about-section-subtitle">
          Ferramentas pensadas para ajudar você a refletir, acompanhar e cuidar
          da sua saúde emocional no dia a dia.
        </p>
      </div>

      <div className="about-features-grid">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className="about-feature-card"
          >
            <div className="about-feature-icon">
              <feature.icon size={22} />
            </div>
            <h3 className="about-feature-title">{feature.title}</h3>
            <p className="about-feature-desc">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
