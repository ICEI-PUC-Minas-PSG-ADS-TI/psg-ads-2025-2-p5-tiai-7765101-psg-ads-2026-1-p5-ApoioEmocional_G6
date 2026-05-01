export interface TimelineEntry {
  id: string;
  date: string;
  dayLabel: string;
  emoji: string;
  mood: string;
  intensity: number;
  preview: string;
  fullText: string;
}

export interface TimelineInsight {
  id: string;
  text: string;
  type: "pattern" | "improvement" | "alert";
}

export interface WeekGroup {
  label: string;
  entries: TimelineEntry[];
  insights: TimelineInsight[];
}
