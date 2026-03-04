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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Fondo con partículas animadas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenedor principal con efecto glass */}
      <div className="relative w-full max-w-3xl mx-4 backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header con gradiente neón */}
        <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30">
              <span className="text-2xl filter drop-shadow-lg">⚡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent">
                NEON CHAT
              </h1>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Conectado a Ollama
              </p>
            </div>
          </div>
        </div>

        {/* Área de mensajes con scroll personalizado */}
        <div className="h-[32rem] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/70">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <div className="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                <span className="text-5xl animate-pulse">💬</span>
              </div>
              <p className="text-lg font-medium bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent">
                ¿En qué puedo ayudarte?
              </p>
              <p className="text-sm text-gray-500 mt-2">Escribe un mensaje para comenzar</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div
                className={`flex items-start gap-3 max-w-[70%] group ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white"
                      : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 border border-white/10"
                  }`}
                >
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>

                {/* Burbuja de mensaje con efecto glass */}
                <div
                  className={`relative px-4 py-3 rounded-2xl backdrop-blur-md ${
                    msg.role === "user"
                      ? "bg-purple-500/20 border border-purple-500/30 text-gray-100 rounded-tr-none"
                      : "bg-gray-800/40 border border-white/10 text-gray-200 rounded-tl-none"
                  } shadow-xl hover:scale-[1.02] transition-transform duration-200`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                  <div
                    className={`absolute bottom-0 w-3 h-3 ${
                      msg.role === "user"
                        ? "right-0 translate-x-1/2 translate-y-1/2 rotate-45 bg-purple-500/20 border-r border-b border-purple-500/30"
                        : "left-0 -translate-x-1/2 translate-y-1/2 rotate-45 bg-gray-800/40 border-l border-t border-white/10"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-white/10 rounded-tl-none">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formulario con input neón */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-gray-900/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 hover:border-white/20"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></div>
            </button>
          </div>
        </form>
      </div>

      {/* Estilos adicionales para animaciones */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}