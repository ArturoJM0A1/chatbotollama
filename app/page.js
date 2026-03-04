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
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-2xl bg-[#121212] rounded-xl shadow-lg border border-red-900/30 overflow-hidden">
        {/* Header minimalista */}
        <div className="px-6 py-4 border-b border-red-900/30">
          <h1 className="text-lg font-medium text-gray-200">
            <span className="mr-2">⚡</span>Chat Ollama
          </h1>
        </div>

        {/* Área de mensajes con scroll personalizado */}
        <div className="h-[28rem] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-red-800/50 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <span className="text-5xl mb-3">💬</span>
              <p className="text-base">Escribe algo para comenzar</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm flex items-start gap-2 ${
                  msg.role === "user"
                    ? "bg-red-950/70 text-gray-100 border border-red-800/30"
                    : "bg-[#1e1e1e] text-gray-200 border border-gray-800"
                }`}
              >
                <span className="text-base">
                  {msg.role === "user" ? "👤" : "🤖"}
                </span>
                <span className="flex-1 break-words">{msg.content}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1e1e1e] text-gray-200 rounded-lg px-4 py-2 border border-gray-800">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-500/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-500/70 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-red-900/30 p-4 flex gap-3 bg-[#121212]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-[#1e1e1e] border border-red-900/30 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-red-950 hover:bg-red-900 disabled:bg-[#2a2a2a] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-gray-200 px-5 py-2 rounded-lg text-sm font-medium border border-red-800/50"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}