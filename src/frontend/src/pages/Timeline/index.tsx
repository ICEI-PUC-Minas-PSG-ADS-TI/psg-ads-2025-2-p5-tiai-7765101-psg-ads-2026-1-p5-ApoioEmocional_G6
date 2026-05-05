import { useState, useMemo, useEffect } from "react";
import { getAllEmotions } from "@/services/emotion";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter } from "lucide-react";
import { moodEmojiMap, moodCategories, periodFilters, moodCategoryMap } from "@/components/TimelineCard/data";
import { groupEntriesByWeek } from "@/components/TimelineCard/insights";
import TimelineEntryCard from "@/components/TimelineCard/index";
import "./Timeline.css";

const Timeline = () => {
  const [entries, setEntries] = useState<any[]>([]); // Estado para os dados reais
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [moodFilter, setMoodFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Fetch dos dados reais ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmotions();
        
        const formatted = data.map((item: any) => {
          const pesos: Record<string, number> = { "Otimo": 5, "Bom": 4, "Okay": 3, "Triste": 2, "Estressado": 1 };
          
          return {
            id: item.id,
            mood: item.mood, 
            emoji: moodEmojiMap[item.mood] || "😶",
            intensity: pesos[item.mood] || 3,
            date: item.createdAt,
            dayLabel: new Date(item.createdAt).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            }),
            preview: item.diary ? item.diary.substring(0, 60) + "..." : "Sem descrição",
            fullText: item.diary || "Sem descrição adicional",
          };
        });

        setEntries(formatted);
      } catch (error) {
        console.error("Erro ao carregar timeline:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FILTRAGEM (Usando os dados que vieram do banco)
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (moodFilter !== "all" && moodCategoryMap[entry.mood] !== moodFilter)
        return false;
      return true;
    });
  }, [entries, moodFilter]);

  // AGRUPAMENTO
  const weekGroups = groupEntriesByWeek(filteredEntries);

  if (loading) return <div className="timeline-empty">Carregando sua jornada...</div>;
  return (
    <main className="timeline-container timeline-main-content">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="timeline-header"
      >
        <div>
          <h1 className="heading-page">Linha do Tempo Emocional</h1>
          <p className="text-body" style={{ marginTop: "0.25rem" }}>
            Acompanhe sua jornada e observe seus padrões emocionais.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="timeline-filters"
      >
        <div className="timeline-filter-group">
          <Calendar size={14} style={{ color: "var(--muted-foreground)" }} />
          {periodFilters.map((f) => (
            <button
              key={f.value}
              className={`timeline-filter-btn${periodFilter === f.value ? " active" : ""}`}
              onClick={() => setPeriodFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="timeline-filter-group">
          <Filter size={14} style={{ color: "var(--muted-foreground)" }} />
          {moodCategories.map((f) => (
            <button
              key={f.value}
              className={`timeline-filter-btn${moodFilter === f.value ? " active" : ""}`}
              onClick={() => setMoodFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="timeline-list">
        <div className="timeline-line" />

        {weekGroups.map((group) => (
          <div key={group.label} className="timeline-week-group">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="timeline-week-label"
            >
              {group.label}
            </motion.div>

            <AnimatePresence>
              {group.entries.map((entry, i) => (
                <TimelineEntryCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  isExpanded={expandedId === entry.id}
                  onToggle={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="timeline-empty">
            <p className="text-body">
              Nenhum registro encontrado com esses filtros.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Timeline;
