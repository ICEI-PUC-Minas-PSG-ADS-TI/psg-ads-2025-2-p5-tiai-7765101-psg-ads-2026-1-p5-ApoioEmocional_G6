import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Shield } from "lucide-react";
import { sendChatMessage, getTodayMessages } from "../../services/chat";
import "./Chat.css";
import { ChatHistoryMessage, ChatHistoryMessageDto, Message } from "@/types/chat";

const quickActions = [
  { label: "Estou me sentindo ansioso(a)", emoji: "😰" },
  { label: "Estou triste", emoji: "😢" },
  { label: "Preciso conversar", emoji: "💬" },
];


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
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getTodayMessages();

        if (response.messages.length > 0) {
          setMessages(response.messages.map((message) => ({
            id: message.id,
            role: message.role === "user" ? "user" : "ai",
            text: message.content,
          })));
        }
      } catch {
        // historico de chat falhou; manter mensagem inicial
      } finally {
        setIsLoadingHistory(false);
      }
    };

    void loadHistory();
  }, []);

  const buildHistory = (nextUserMessage: string): ChatHistoryMessage[] => {
    const history = messages.flatMap((message) => {
      if (message.id === 0) {
        return [];
      }

      return [
        {
          role: message.role === "user" ? "user" : "assistant",
          content: message.text,
        },
      ];
    });

    return [
      ...history,
      {
        role: "user",
        content: nextUserMessage,
      },
    ];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (isSending) return;

    const trimmedText = text.trim();
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setIsSending(true);

    try {
      const aiText = await sendChatMessage(trimmedText, buildHistory(trimmedText));

      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
        setIsSending(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", text: aiText },
        ]);
      }, 900);
    } catch {
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
        setIsSending(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", text: "Ocorreu um erro. Tente novamente." },
        ]);
      }, 700);
    }

    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chat-root">
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
                {isLoadingHistory ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="chat-loading"
                  >
                    <div className="chat-loading-text">Carregando suas mensagens do dia...</div>
                  </motion.div>
                ) : (
                  messages.map((msg) => (
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
                  ))
                )}
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

          <div className="chat-footer">
            {/* Quick actions */}
            <div className="chat-quick-actions">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => sendMessage(action.label)}
                  className="chat-quick-btn"
                  disabled={isSending}
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
                  disabled={!input.trim() || isSending}
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
    </div>
  );
};

export default Chat;
