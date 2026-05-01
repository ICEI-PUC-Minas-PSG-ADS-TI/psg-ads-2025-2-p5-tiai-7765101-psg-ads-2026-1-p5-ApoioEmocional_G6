import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Shield } from "lucide-react";
import "./Chat.css";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const quickActions = [
  { label: "Estou me sentindo ansioso(a)", emoji: "😰" },
  { label: "Estou triste", emoji: "😢" },
  { label: "Preciso conversar", emoji: "💬" },
];

const aiResponses: Record<string, string> = {
  "Estou me sentindo ansioso(a)":
    "Eu te escuto. A ansiedade pode ser intensa, mas voce nao esta sozinho(a). Respire devagar: inspire por 4 segundos, segure por 4 e solte por 4. Quer tentar um exercicio guiado de respiracao?",
  "Estou triste":
    "Obrigado por compartilhar isso. Reconhecer como voce se sente exige coragem. A tristeza faz parte da vida, e tudo bem acolher esse sentimento. O que voce acha que pode estar por tras disso?",
  "Preciso conversar":
    "Estou aqui com voce. Va no seu tempo, sem pressa. Pode compartilhar o que estiver passando pela sua mente, e eu vou te ouvir sem julgamentos. 💙",
};

const defaultResponse =
  "Obrigado por compartilhar. Estou aqui para te ouvir e apoiar. Lembre-se: todo sentimento e valido, e se expressar e um sinal de forca. Quer explorar um pouco mais o que voce esta sentindo?";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: "Ola 💙 Bem-vindo(a) ao seu espaco seguro. Estou aqui para te ouvir e apoiar, sem julgamentos e sem pressa. Como voce esta se sentindo agora?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const response = aiResponses[text.trim()] || defaultResponse;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: response },
      ]);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="page-full" style={{ display: "flex", flexDirection: "column" }}>
      <div className="chat-page">
        {/* Side accent */}
        <div className="chat-side-accent">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="chat-side-content"
          >
            <Heart size={20} className="chat-side-icon" />
            <p className="chat-side-title">Seu Espaco Seguro</p>
            <p className="chat-side-text">
              Expresse-se livremente. Tudo o que voce compartilha aqui fica entre nos.
            </p>

            <div className="chat-side-tips">
              <p className="chat-side-tips-title">Sugestoes</p>
              <div className="chat-side-tip">🌊 Tente uma respiracao profunda</div>
              <div className="chat-side-tip">📝 Escreva no seu diario</div>
              <div className="chat-side-tip">🎵 Ouça uma musica calma</div>
            </div>
          </motion.div>
        </div>

        {/* Main chat area */}
        <div className="chat-main">
          {/* Messages */}
          <div className="chat-messages">
            <div className="chat-messages-inner">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`chat-bubble-wrap ${msg.role}`}
                  >
                    <div className={`chat-bubble ${msg.role}`}>
                      {msg.role === "ai" && (
                        <span className="chat-bubble-avatar">💙</span>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="chat-bubble-wrap ai"
                  >
                    <div className="chat-bubble ai">
                      <span className="chat-bubble-avatar">💙</span>
                      <div className="typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick actions */}
          <div className="chat-quick-actions">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => sendMessage(action.label)}
                className="chat-quick-btn"
              >
                <span>{action.emoji}</span>
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="chat-input-area">
            <div className="chat-input-wrap">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Compartilhe o que esta passando na sua mente..."
                className="chat-input"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="chat-send-btn"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </motion.button>
            </div>

            {/* Disclaimer */}
            <p className="chat-disclaimer">
              <Shield size={12} />
              Este chat oferece apoio emocional e nao substitui acompanhamento psicologico profissional.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
