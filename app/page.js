"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Error al conectar." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🌐 Error de red." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden p-4">
      {/* Fondo animado con gradiente en movimiento y partículas */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-purple-950 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" />
      
      {/* Efecto de ruido sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.1%22/%3E%3C/svg%3E')] opacity-20 mix-blend-overlay" />

      {/* Contenedor principal con efecto glass + neón */}
      <div className="relative w-full max-w-2xl backdrop-blur-2xl bg-white/5 border border-red-500/30 shadow-2xl shadow-red-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:border-red-400/50 hover:shadow-red-400/30">
        
        {/* Header con brillo dinámico */}
        <div className="relative bg-black/40 backdrop-blur-md border-b border-red-500/30 px-6 py-4 flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-purple-500/10 animate-shimmer" />
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-300 tracking-wide drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            ⚡ Chat Ollama
          </h1>
          <span className="flex items-center gap-2 text-sm text-red-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Online
          </span>
        </div>

        {/* Área de mensajes con scroll personalizado */}
        <div className="h-[28rem] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
              <span className="text-6xl mb-4 animate-float">💬</span>
              <p className="text-lg font-light">Escribe algo para comenzar...</p>
              <p className="text-sm text-zinc-500 mt-2">La conversación se iluminará</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-slide-in`}
            >
              <div
                className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-lg backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  msg.role === "user"
                    ? "bg-red-600/80 text-white border-red-400/50 rounded-br-none shadow-red-600/20"
                    : "bg-white/10 text-zinc-200 border-white/20 rounded-bl-none shadow-white/10"
                }`}
              >
                {/* Efecto de brillo en la esquina */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full blur-sm opacity-50" />
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {msg.role === "user" ? "👤" : "🤖"}
                  </span>
                  <span className="flex-1 break-words">{msg.content}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-slide-in">
              <div className="relative bg-white/10 text-zinc-300 rounded-2xl rounded-bl-none px-4 py-3 backdrop-blur-md border border-white/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formulario con input neón */}
        <form
          onSubmit={handleSubmit}
          className="relative border-t border-red-500/30 p-4 flex gap-3 bg-black/40 backdrop-blur-md"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-white/5 text-white placeholder-zinc-400 border border-red-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400 backdrop-blur-md transition-all duration-300 shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="group relative bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:cursor-not-allowed transition-all duration-300 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              ⚡
              <span className="hidden sm:inline">Enviar</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl" />
          </button>
        </form>
      </div>

      {/* Estilos personalizados para animaciones (se pueden poner en un archivo CSS, pero aquí van inline con style para mantener todo junto) */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}