import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, X, Flame } from "lucide-react";
import { moodEmojiMap } from "@/components/TimelineCard/data";
import ShortInsightsCard from "@/components/ShortInsightsCard";
import { getAllEmotions } from "@/services/emotion";
import { getUserProfile, UserProfileResponse } from "@/services/auth";
import type { TimelineEntry } from "@/types/timelineCard";
import "./Profile.css";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const MOOD_INTENSITY: Record<string, number> = {
  Otimo: 5,
  Bom: 4,
  Okay: 3,
  Triste: 2,
  Estressado: 1,
};

type EntryWithTime = TimelineEntry & { time: string };

function formatDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Converte a lista plana de registos de emoções recebidas do Backend para o mapa do calendário
function buildEntryMap(emotions: any[]): Map<string, EntryWithTime> {
  const map = new Map<string, EntryWithTime>();
  if (!emotions || !Array.isArray(emotions)) return map;

  // Ordena por data decrescente (do mais recente para o mais antigo)
  const sorted = [...emotions].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.CreatedAt).getTime();
    const dateB = new Date(b.createdAt || b.CreatedAt).getTime();
    return dateB - dateA;
  });

  for (const emotion of sorted) {
    if (!emotion) continue;

    const rawDate = emotion.createdAt || emotion.CreatedAt;
    const createdAt = new Date(rawDate);
    if (isNaN(createdAt.getTime())) continue;

    const dateKey = formatDateKey(createdAt);

    // Se já foi adicionado um registo mais recente deste dia, ignora os mais antigos
    if (map.has(dateKey)) continue;

    const rawMood = emotion.mood || emotion.Mood || emotion.emotion || emotion.Emotion || "";
    const cleanMood = rawMood ? rawMood.trim() : "";
    const diaryText = emotion.diary || emotion.Diary || "";

    map.set(dateKey, {
      id: emotion.id || emotion.Id,
      date: dateKey,
      mood: cleanMood,
      emoji: moodEmojiMap[cleanMood] || "😶",
      intensity: MOOD_INTENSITY[cleanMood] || 3,
      dayLabel: createdAt.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }),
      preview: diaryText ? `${diaryText.substring(0, 60)}...` : "Sem descrição",
      fullText: diaryText || "Sem descrição adicional",
      time: createdAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  return map;
}

const Profile = () => {
  const navigate = useNavigate();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<EntryWithTime | null>(null);
  const [entryMap, setEntryMap] = useState<Map<string, EntryWithTime>>(() => new Map());
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [userInitial, setUserInitial] = useState("?");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Chamada resiliente 1: Histórico de Emoções
      try {
        const emotionsData = await getAllEmotions();
        setEntryMap(buildEntryMap(emotionsData));
      } catch (error) {
        console.error("Erro ao carregar histórico de emoções:", error);
      }

      // Chamada resiliente 2: Dados do Perfil no Banco
      try {
        const profileData = await getUserProfile();
        setUserProfile(profileData);
        if (profileData && profileData.nome) {
          setUserInitial(profileData.nome.trim().charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Erro ao carregar dados de perfil do utilizador:", error);

        // Fallback: tenta recuperar o nome guardado localmente no login se a rota falhar
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
          try {
            const { nome } = JSON.parse(userToken);
            if (nome) {
              setUserInitial(nome.trim().charAt(0).toUpperCase());
              setUserProfile({ nome, sobrenome: "", email: "" });
            }
          } catch {}
        }
      }

      setLoading(false);
    };

    void fetchData();
  }, []);

  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date | null; key: string }> = [];

    for (let i = 0; i < firstDay; i++) cells.push({ date: null, key: `empty-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, key: formatDateKey(date) });
    }

    return cells;
  }, [viewMonth]);

  const stats = useMemo(() => {
    const entries = Array.from(entryMap.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );

    let streak = 0;
    const cursor = new Date(today);
    while (entryMap.has(formatDateKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    const distribution: Record<string, number> = {};
    entries.forEach((e) => {
      distribution[e.emoji] = (distribution[e.emoji] || 0) + 1;
    });

    const total = entries.length;
    const distArr =
      total === 0
        ? []
        : Object.entries(distribution)
            .map(([emoji, count]) => ({
              emoji,
              count,
              pct: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.count - a.count);

    return { streak, distArr, total };
  }, [entryMap, today]);

  const todayKey = formatDateKey(today);

  if (loading) {
    return (
      <main className="profile-container profile-main-content">
        <p className="text-body">Carregando o seu perfil...</p>
      </main>
    );
  }

  return (
    <>
      <main className="profile-container profile-main-content">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header flex items-center gap-4"
        >
          <div className="profile-avatar-lg">{userInitial}</div>
          <div>
            <h1 className="heading-page">
              {userProfile && userProfile.sobrenome
                ? `${userProfile.nome} ${userProfile.sobrenome}`
                : userProfile?.nome || "Meu Perfil"}
            </h1>
            <p className="text-body text-gray-500">{userProfile?.email || "Acompanhe a sua jornada emocional."}</p>
          </div>
        </motion.div>

        <div className="profile-dashboard">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card emotional-calendar"
          >
            <div className="calendar-head">
              <div>
                <h2 className="heading-card">Calendário Emocional</h2>
                <p className="text-small">Toque num dia para ver ou registar uma reflexão.</p>
              </div>
              <div className="calendar-month-nav">
                <button
                  className="calendar-nav-btn"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                  }
                  aria-label="Mês anterior"
                >
                  ‹
                </button>
                <span className="calendar-month-label">
                  {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <button
                  className="calendar-nav-btn"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                  }
                  aria-label="Próximo mês"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="calendar-weekdays">
              {WEEKDAYS.map((d, i) => (
                <span key={i} className="calendar-weekday">
                  {d}
                </span>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((cell, idx) => {
                if (!cell.date) return <div key={cell.key} className="calendar-cell empty" />;

                const entry = entryMap.get(cell.key);
                const isToday = cell.key === todayKey;
                const isFuture = cell.date > today;

                return (
                  <motion.button
                    key={cell.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.008, duration: 0.25 }}
                    whileHover={!isFuture ? { scale: 1.08, y: -2 } : undefined}
                    whileTap={!isFuture ? { scale: 0.95 } : undefined}
                    className={`calendar-cell${entry ? " has-entry" : ""}${isToday ? " today" : ""}${isFuture ? " future" : ""}`}
                    onClick={() => {
                      if (isFuture) return;
                      if (entry) setSelected(entry);
                      else navigate("/home");
                    }}
                    disabled={isFuture}
                  >
                    <span className="calendar-emoji">
                      {entry ? entry.emoji : isFuture ? "" : <Plus size={14} strokeWidth={2.4} />}
                    </span>
                    <span className="calendar-daynum">{cell.date.getDate()}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          <div className="profile-stats-grid">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card stat-card streak-card"
            >
              <div className="stat-icon stat-icon-flame">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-small">Sequência atual</p>
                <p className="stat-value">
                  {stats.streak} {stats.streak === 1 ? "dia" : "dias"}
                </p>
                <p className="text-small">Continue cuidando de si 💛</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card stat-card"
            >
              <h3 className="heading-card">Distribuição de humor</h3>
              <div className="mood-dist-list">
                {stats.distArr.length === 0 ? (
                  <p className="text-small">Nenhum registo ainda.</p>
                ) : (
                  stats.distArr.map((d) => (
                    <div key={d.emoji} className="mood-dist-row">
                      <span className="mood-dist-emoji">{d.emoji}</span>
                      <div className="mood-dist-bar-track">
                        <motion.div
                          className="mood-dist-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${d.pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="mood-dist-pct">{d.pct}%</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <ShortInsightsCard />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelected(null)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
              <div className="modal-emoji">{selected.emoji}</div>
              <h3 className="modal-mood">{selected.mood}</h3>
              <div className="modal-meta">
                <span className="modal-meta-item">
                  <Clock size={13} /> {selected.time}
                </span>
                <span className="modal-meta-item">{selected.dayLabel}</span>
              </div>
              <div className="modal-intensity">
                <span className="text-small">Intensidade emocional</span>
                <div className="modal-intensity-dots">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={`modal-intensity-dot${dot <= selected.intensity ? " active" : ""}`}
                    />
                  ))}
                </div>
              </div>
              <p className="modal-reflection">{selected.fullText}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;