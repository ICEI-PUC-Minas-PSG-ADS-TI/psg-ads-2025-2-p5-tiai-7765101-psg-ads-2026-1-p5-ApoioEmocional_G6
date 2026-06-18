import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { getInsights } from "@/services/insights";
import type { InsightsResponse } from "@/types/insights";
import "./ShortInsightsCard.css";

interface ShortInsightsCardProps {
  refreshTrigger?: number;
}

const ShortInsightsCard = ({ refreshTrigger = 0 }: ShortInsightsCardProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInsights();
        setInsights(data.insights || []);
      } catch (err) {
        console.error("Erro ao carregar insights:", err);
        const errorMessage = err instanceof Error ? err.message : "Não foi possível gerar insights no momento. Tente novamente mais tarde.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadInsights();
  }, [refreshTrigger]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="card stat-card insights-modern"
    >
      <div className="insights-modern-head">
        <Sparkles size={18} className="insights-modern-icon" />
        <h3 className="heading-card">Insights emocionais</h3>
      </div>

      {loading ? (
        <p className="text-small">Gerando insights com a IA...</p>
      ) : error ? (
        <div className="insights-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : insights.length === 0 ? (
        <p className="text-small">
          Ainda não há registros de diário suficientes para gerar insights.
          Registre pelo menos um texto no diário para que a IA possa analisar.
        </p>
      ) : (
        <div className="insights-modern-list">
          {insights.map((insight, index) => (
            <div key={index} className="insight-pill">
              <Sparkles size={14} />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ShortInsightsCard;
