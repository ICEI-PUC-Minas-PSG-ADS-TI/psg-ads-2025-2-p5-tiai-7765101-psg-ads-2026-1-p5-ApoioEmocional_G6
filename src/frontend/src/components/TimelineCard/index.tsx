import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TimelineEntry } from "../../types/timelineCard";
import "./TimelineCard.css";

const intensityColor = (intensity: number) => {
  if (intensity >= 4) return "var(--primary)";
  if (intensity >= 3) return "var(--secondary)";
  return "var(--muted-foreground)";
};

interface Props {
  entry: TimelineEntry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const TimelineEntryCard = ({ entry, index, isExpanded, onToggle }: Props) => {
  const isIntense = entry.intensity >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`timeline-item${isIntense ? " intense" : ""}`}
      onClick={onToggle}
    >
      <div
        className="timeline-dot"
        style={{ borderColor: intensityColor(entry.intensity) }}
      >
        <span className="timeline-dot-emoji">{entry.emoji}</span>
      </div>

      <div className="timeline-item-body">
        <div className="timeline-item-top">
          <span className="timeline-date">{entry.dayLabel}</span>
          <div className="timeline-meta">
            <span
              className="timeline-mood-badge"
              style={{
                background: `color-mix(in srgb, ${intensityColor(entry.intensity)} 12%, transparent)`,
                color: intensityColor(entry.intensity),
              }}
            >
              {entry.mood}
            </span>
            <div className="timeline-intensity">
              {[1, 2, 3, 4, 5].map((dot) => (
                <span
                  key={dot}
                  className="timeline-intensity-dot"
                  style={{
                    background:
                      dot <= entry.intensity
                        ? intensityColor(entry.intensity)
                        : "var(--border)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="timeline-preview">
          {isExpanded ? entry.fullText : entry.preview}
        </p>

        <button className="timeline-expand-btn">
          {isExpanded ? (
            <>
              <ChevronUp size={14} /> Recolher
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Ler mais
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default TimelineEntryCard;
