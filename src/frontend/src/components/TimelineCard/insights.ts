import { TimelineEntry, TimelineInsight, WeekGroup } from "../../types/timelineCard";
import { moodCategoryMap } from "./data";

function getMoodCategory(mood: string): string {
  return moodCategoryMap[mood] || "neutral";
}

function generateInsightsForEntries(entries: TimelineEntry[]): TimelineInsight[] {
  if (entries.length < 2) return [];
  const insights: TimelineInsight[] = [];
  
  // Detect consecutive negative days
  let negStreak = 0;
  let negStreakStart = -1;
  for (let i = 0; i < entries.length; i++) {
    if (getMoodCategory(entries[i].mood) === "negative") {
      if (negStreak === 0) negStreakStart = i;
      negStreak++;
    } else {
      if (negStreak >= 2) {
        insights.push({
          id: `neg-streak-${negStreakStart}`,
          text: `Você teve ${negStreak} dias seguidos com emoções mais difíceis. Lembre-se de ser gentil consigo mesmo durante esses momentos.`,
          type: "alert",
        });
      }
      negStreak = 0;
    }
  }
  if (negStreak >= 2) {
    insights.push({
      id: `neg-streak-${negStreakStart}`,
      text: `Você teve ${negStreak} dias seguidos com emoções mais difíceis. Lembre-se de ser gentil consigo mesmo durante esses momentos.`,
      type: "alert",
    });
  }

  // Detect improvement after a bad day
  for (let i = 0; i < entries.length - 1; i++) {
    const curr = getMoodCategory(entries[i].mood);
    const next = getMoodCategory(entries[i + 1].mood);
    if (next === "negative" && (curr === "positive" || curr === "neutral")) {
      insights.push({
        id: `improvement-${i}`,
        text: `Após um dia mais intenso, houve uma melhora no dia seguinte. Isso mostra sua capacidade de recuperação. 💛`,
        type: "improvement",
      });
      break;
    }
  }

  // Detect high intensity peak
  const maxIntensity = Math.max(...entries.map((e) => e.intensity));
  if (maxIntensity >= 5) {
    const peakEntry = entries.find((e) => e.intensity === 5);
    if (peakEntry) {
      insights.push({
        id: `peak-${peakEntry.id}`,
        text: `O dia ${peakEntry.dayLabel.split(",")[0]} teve intensidade emocional elevada. Pode ser interessante refletir sobre o que impactou esse dia.`,
        type: "pattern",
      });
    }
  }

  // Positive streak
  let posStreak = 0;
  for (let i = 0; i < entries.length; i++) {
    if (getMoodCategory(entries[i].mood) === "positive") {
      posStreak++;
    } else {
      if (posStreak >= 2) {
        insights.push({
          id: `pos-streak-${i}`,
          text: `Você teve ${posStreak} dias positivos em sequência. Que bom! Observe o que contribuiu para esse período. ✨`,
          type: "improvement",
        });
      }
      posStreak = 0;
    }
  }
  if (posStreak >= 2) {
    insights.push({
      id: `pos-streak-end`,
      text: `Você teve ${posStreak} dias positivos em sequência. Que bom! Observe o que contribuiu para esse período. ✨`,
      type: "improvement",
    });
  }

  return insights;
}

export function groupEntriesByWeek(entries: TimelineEntry[]): WeekGroup[] {
  // entries are sorted newest first; group by ISO week
  const groups: Map<string, TimelineEntry[]> = new Map();
  const now = new Date("2026-03-28");

  for (const entry of entries) {
    const entryDate = new Date(entry.date);
    const diffDays = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let label: string;
    if (diffDays < 7) {
      label = "Esta semana";
    } else if (diffDays < 14) {
      label = "Semana anterior";
    } else if (diffDays < 21) {
      label = "Há 2 semanas";
    } else if (diffDays < 30) {
      label = "Há 3 semanas";
    } else {
      label = "Mais antigos";
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(entry);
  }

  const result: WeekGroup[] = [];
  for (const [label, groupEntries] of groups) {
    result.push({
      label,
      entries: groupEntries,
      insights: generateInsightsForEntries(groupEntries),
    });
  }

  return result;
}
