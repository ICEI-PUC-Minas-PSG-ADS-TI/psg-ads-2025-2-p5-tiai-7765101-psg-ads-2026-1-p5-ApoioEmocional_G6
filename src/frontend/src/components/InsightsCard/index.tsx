import "./InsightsCard.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { getWeeklyEmotions } from "@/services/emotion";
import type { EmotionDailyGroupResponse, EmotionResponse } from "@/types/emotion";

interface InsightsCardProps {
  refreshTrigger?: number;
}

const InsightsCard = ({ refreshTrigger = 0 }: InsightsCardProps) => {
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pesosMood: Record<string, number> = {
    "Otimo": 5, "Bom": 4, "Okay": 3, "Triste": 2, "Estressado": 1
  };
  const nomesMood: Record<number, string> = {
    5: "Ótimo", 4: "Bom", 3: "Okay", 2: "Triste", 1: "Estressado"
  };

  const getMoodValue = (mood: string) => pesosMood[mood] || 0;
  const getDisplayMoodLabel = (moodValue: number) => nomesMood[Math.round(moodValue)] || "Não definido";
  const normalizeDate = (value?: string) => {
    if (!value) return new Date();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };
  const formatDay = (dateValue?: string) =>
    normalizeDate(dateValue)
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .toUpperCase();
  const extractEmotionMood = (emotion: EmotionResponse & Record<string, unknown>) =>
    typeof emotion.mood === "string"
      ? emotion.mood
      : typeof emotion.Mood === "string"
        ? (emotion.Mood as string)
        : "";
  const extractGroupEmotions = (group: EmotionDailyGroupResponse & Record<string, unknown>) => {
    if (Array.isArray(group.emotions)) return group.emotions as EmotionResponse[];
    if (Array.isArray(group.Emotions)) return group.Emotions as EmotionResponse[];
    return [];
  };
  const extractGroupDate = (group: EmotionDailyGroupResponse & Record<string, unknown>) =>
    typeof group.date === "string"
      ? group.date
      : typeof group.Date === "string"
        ? (group.Date as string)
        : "";

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosDaApi = await getWeeklyEmotions();
        const formatadoParaLinha = dadosDaApi.flatMap((group) => {
          const emotions = extractGroupEmotions(group as EmotionDailyGroupResponse & Record<string, unknown>);
          const dayLabel = formatDay(extractGroupDate(group as EmotionDailyGroupResponse & Record<string, unknown>));

          return emotions.map((emotion, index) => {
            const moodValue = getMoodValue(
              extractEmotionMood(emotion as EmotionResponse & Record<string, unknown>)
            );

            return {
              day: dayLabel,
              xKey: `${dayLabel}-${index + 1}`,
              showDayLabel: index === 0,
              mood: moodValue,
              labelMood: getDisplayMoodLabel(moodValue),
            };
          });
        });

        const allEmotions = dadosDaApi.flatMap((group) =>
          extractGroupEmotions(group as EmotionDailyGroupResponse & Record<string, unknown>)
        );

        const positivos = allEmotions.filter((emotion) => {
          const valor = getMoodValue(extractEmotionMood(emotion as EmotionResponse & Record<string, unknown>));
          return valor >= 4;
        }).length;

        const negativos = allEmotions.filter((emotion) => {
          const valor = getMoodValue(extractEmotionMood(emotion as EmotionResponse & Record<string, unknown>));
          return valor < 4 && valor > 0;
        }).length;

        setLineChartData(formatadoParaLinha);
        setBarChartData([
          { name: "Positivo", value: positivos },
          { name: "Negativo", value: negativos },
        ]);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    const pollId = setInterval(carregarDados, 30000);
    return () => clearInterval(pollId);
  }, [refreshTrigger]);

  if (loading) {
    return <div className="insights-card">Carregando insights...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="insights-card insights-section"
    >
      <h3 className="insights-heading">Insights Emocionais</h3>

      <div>
        <p className="chart-label">Tendência de humor esta semana</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineChartData}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90E2" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4A90E2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="xKey" 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(_value: string, index: number) =>
                  lineChartData[index]?.showDayLabel ? lineChartData[index].day : ""
                }
                style={{ fontSize: "0.75rem" }} 
              />
              <YAxis hide domain={[0, 5]} />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => {
                  return [props.payload.labelMood, "Humor"];
                }}
                labelStyle={{ display: "none" }} 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#4A90E2"
                fill="url(#moodGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="chart-label">Positivo vs Negativo</p>
        <div className="chart-container-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                style={{ fontSize: "0.75rem" }} 
                width={70} 
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightsCard;