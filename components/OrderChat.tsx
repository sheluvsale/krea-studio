"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, Send, X, Loader2, User } from "lucide-react";

interface ChatMessage {
  id: number;
  remitente_id: number;
  contenido: string;
  tipo: string;
  estado: string;
  creado_en: string;
  remitente_nombre: string;
  remitente_apellido: string;
  remitente_avatar?: string;
}

interface OrderChatProps {
  pedidoId: number;
  pedidoNumero: string;
  triggerLabel?: string;
}

export default function OrderChat({
  pedidoId,
  pedidoNumero,
  triggerLabel = "Chat",
}: OrderChatProps) {
  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [conversacionId, setConversacionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Obtener current user id
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.isLoggedIn) setCurrentUserId(d.user.id);
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Obtener o crear conversación ligada al pedido
  const initConversation = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/conversations`);
      const data = await res.json();
      if (data.conversations) {
        const conv = data.conversations.find(
          (c: Record<string, unknown>) => Number(c.pedido_id) === pedidoId,
        );
        if (conv) {
          setConversacionId(Number(conv.id));
          return;
        }
      }

      const createRes = await fetch(`/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedidoId,
          tipo: "pedido",
          asunto: `Pedido ${pedidoNumero}`,
        }),
      });
      const createData = await createRes.json();
      if (createData.id) {
        setConversacionId(createData.id);
      }
    } catch {
      setError("No se pudo iniciar el chat.");
    }
  }, [pedidoId, pedidoNumero]);

  const fetchMessages = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/chat/messages?conversacion_id=${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch {
      // Silencioso para polling
    }
  }, []);

  const markRead = useCallback(async (convId: number) => {
    try {
      await fetch(`/api/chat/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversacion_id: convId }),
      });
    } catch {
      // Silencioso
    }
  }, []);

  useEffect(() => {
    if (open && !conversacionId) {
      initConversation();
    }
  }, [open, conversacionId, initConversation]);

  useEffect(() => {
    if (!conversacionId || !open) return;

    fetchMessages(conversacionId);
    markRead(conversacionId);
    scrollToBottom();

    pollRef.current = setInterval(() => {
      fetchMessages(conversacionId);
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversacionId, open, fetchMessages, markRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversacionId || sending) return;

    setSending(true);
    const tempContent = input.trim();
    setInput("");

    const tempMsg: ChatMessage = {
      id: Date.now(),
      remitente_id: currentUserId || 0,
      contenido: tempContent,
      tipo: "texto",
      estado: "enviado",
      creado_en: new Date().toISOString(),
      remitente_nombre: "Tú",
      remitente_apellido: "",
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/chat/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversacion_id: conversacionId,
          contenido: tempContent,
        }),
      });
      if (!res.ok) throw new Error("Error");
      fetchMessages(conversacionId);
    } catch {
      setError("No se pudo enviar el mensaje.");
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    if (isToday) return "Hoy";
    return d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  };

  const isOwnMessage = (msg: ChatMessage) =>
    currentUserId !== null && msg.remitente_id === currentUserId;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[1.5px] font-[family-name:var(--font-heading)] font-medium text-krea-text-secondary hover:text-krea-accent transition-colors border border-krea-border hover:border-krea-accent px-3 py-1.5 bg-transparent cursor-pointer"
      >
        <MessageCircle size={14} strokeWidth={1.5} />
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-end sm:items-center sm:justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full sm:w-[480px] h-[100dvh] sm:h-[600px] bg-krea-bg border border-krea-border flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-krea-border bg-krea-bg-secondary shrink-0">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-[2px] font-semibold text-krea-text">
                  Chat del Pedido
                </h3>
                <p className="text-[10px] text-krea-text-secondary uppercase tracking-[1.5px] mt-0.5">
                  #{pedidoNumero}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-krea-text-secondary hover:text-krea-text transition-colors bg-transparent border-none cursor-pointer p-1"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2
                    size={20}
                    className="animate-spin text-krea-text-secondary"
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-krea-bg-tertiary border border-krea-border flex items-center justify-center mb-4">
                    <MessageCircle
                      size={20}
                      strokeWidth={1.5}
                      className="text-krea-text-secondary"
                    />
                  </div>
                  <p className="text-krea-text-secondary text-sm font-[family-name:var(--font-heading)]">
                    Chat iniciado
                  </p>
                  <p className="text-krea-text-secondary/60 text-xs mt-1 max-w-[240px]">
                    Escribe un mensaje para comunicarte sobre este pedido.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const showDate =
                    idx === 0 ||
                    formatDate(msg.creado_en) !==
                      formatDate(messages[idx - 1].creado_en);
                  const own = isOwnMessage(msg);
                  const isSystem = msg.tipo === "sistema";

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="h-px bg-krea-border flex-1" />
                          <span className="px-3 text-[10px] uppercase tracking-[1.5px] text-krea-text-secondary/50">
                            {formatDate(msg.creado_en)}
                          </span>
                          <div className="h-px bg-krea-border flex-1" />
                        </div>
                      )}

                      {isSystem ? (
                        <div className="flex justify-center my-3">
                          <div className="bg-krea-bg-tertiary/50 border border-krea-border/50 px-4 py-2 rounded text-[11px] text-krea-text-secondary/70 text-center max-w-[320px]">
                            {msg.contenido}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex gap-2.5 ${own ? "flex-row-reverse" : ""}`}
                        >
                          <div className="shrink-0 w-7 h-7 rounded-full bg-krea-bg-tertiary border border-krea-border flex items-center justify-center overflow-hidden">
                            {msg.remitente_avatar ? (
                              <img
                                src={msg.remitente_avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User
                                size={12}
                                strokeWidth={1.5}
                                className="text-krea-text-secondary"
                              />
                            )}
                          </div>

                          <div
                            className={`max-w-[75%] ${own ? "items-end" : "items-start"} flex flex-col`}
                          >
                            <div
                              className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                                own
                                  ? "bg-krea-accent text-krea-bg rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl"
                                  : "bg-krea-bg-tertiary border border-krea-border text-krea-text rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                              }`}
                            >
                              {msg.contenido}
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                              <span className="text-[10px] text-krea-text-secondary/40">
                                {formatTime(msg.creado_en)}
                              </span>
                              {own && (
                                <span className="text-[10px] text-krea-text-secondary/40">
                                  {msg.estado === "leido"
                                    ? "Visto"
                                    : msg.estado === "entregado"
                                      ? "Entregado"
                                      : "Enviado"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="px-5 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="px-4 py-3 border-t border-krea-border bg-krea-bg-secondary shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Escribe un mensaje..."
                  disabled={sending || !conversacionId}
                  className="flex-1 bg-krea-bg border border-krea-border text-krea-text text-sm px-4 py-2.5 rounded focus:outline-none focus:border-krea-text-secondary placeholder:text-krea-text-secondary/30 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !input.trim() || !conversacionId}
                  className="shrink-0 w-10 h-10 bg-krea-accent text-krea-bg rounded flex items-center justify-center hover:bg-krea-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-none"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
