import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter } from "lucide-react";
import { mockEntries, moodCategories, periodFilters, moodCategoryMap } from "@/components/TimelineCard/data";
import { groupEntriesByWeek } from "@/components/TimelineCard/insights";
import TimelineEntryCard from "@/components/TimelineCard/index";
import "./Timeline.css";

const Timeline = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [moodFilter, setMoodFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const filteredEntries = mockEntries.filter((entry) => {
    if (moodFilter !== "all" && moodCategoryMap[entry.mood] !== moodFilter)
      return false;
    return true;
  });

  const weekGroups = groupEntriesByWeek(filteredEntries);

  const allInsights = useMemo(
    () => weekGroups.flatMap((g) => g.insights),
    [weekGroups]
  );
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
