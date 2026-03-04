# 🤖 Chat con Ollama + Next.js (Local)

Aplicación web construida con **Next.js** que permite interactuar con un modelo de lenguaje **llama3.2:1b** ejecutándose localmente mediante **Ollama**. Todo el procesamiento se realiza en tu propia máquina, sin necesidad de conexión a internet (una vez descargado el modelo).

## ✨ Características

- Interfaz de chat limpia y responsive (con Tailwind CSS)
- Comunicación con la API local de Ollama (`http://localhost:11434`)
- Historial de mensajes en tiempo real
- Indicador de "escribiendo..." mientras el modelo genera la respuesta
- Manejo de errores básico

## 🛠️ Tecnologías

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://reactjs.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Ollama](https://ollama.com/) (modelo `llama3.2:1b`)

## 📋 Requisitos previos

- **Node.js** 18 o superior ([descargar](https://nodejs.org/))
- **Ollama** instalado ([descargar](https://ollama.com/)) y el modelo `llama3.2:1b` descargado:
  ```bash
  ollama pull llama3.2:1b
  ```
  (Asegúrate de que el servicio de Ollama esté corriendo; normalmente se inicia automáticamente al ejecutar cualquier comando de Ollama)

## 🚀 Instalación y ejecución

Sigue estos pasos para poner en marcha la aplicación:

### 1. Clona o crea la carpeta del proyecto

```bash
mkdir mi-app-ollama
cd mi-app-ollama
```

### 2. Inicializa el proyecto con npm

```bash
npm init -y
```

### 3. Instala las dependencias

```bash
npm install next@14.2.5 react@18 react-dom@18
npm install -D tailwindcss@3 postcss autoprefixer
```

### 4. Crea la estructura de carpetas

```bash
mkdir app
mkdir app/api
mkdir app/api/chat
```

### 5. Agrega los archivos de configuración y código

Copia y pega el contenido de cada archivo según se indica a continuación.

#### 📄 `package.json` (reemplaza el contenido generado)

```json
{
  "name": "mi-app-ollama",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6"
  }
}
```

#### 📄 `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

#### 📄 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 📄 `postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 📄 `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
```

#### 📄 `app/layout.js`

```jsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat con Ollama",
  description: "Interactúa con un modelo local de Ollama (llama3.2:1b)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### 📄 `app/page.js`

```jsx
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        console.error("Error:", data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error al conectar con Ollama." },
        ]);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de red." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3">
          <h1 className="text-xl font-bold">Chat con Ollama (llama3.2:1b)</h1>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-500">
              Envía un mensaje para comenzar a chatear.
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                <span className="animate-pulse">Escribiendo...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}
```

#### 📄 `app/api/chat/route.js`

```js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "El campo 'prompt' es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error desde Ollama:", response.status, errorText);
      return NextResponse.json(
        { error: `Ollama respondió con error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("Error en API route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

### 6. ¡Ejecuta la aplicación!

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador y empieza a chatear.

## 📁 Estructura del proyecto

```
mi-app-ollama/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js        # Endpoint que llama a Ollama
│   ├── layout.js                # Layout principal (metadatos, fuentes)
│   ├── page.js                  # Interfaz del chat
│   └── globals.css              # Estilos globales (Tailwind)
├── public/                      # Archivos públicos (vacío por ahora)
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Configuración adicional

- Si Ollama corre en un puerto diferente o en otra máquina, modifica la URL en `app/api/chat/route.js`.
- Para cambiar el modelo, reemplaza `llama3.2:1b` por otro que tengas instalado (ej. `mistral`, `llama2`, etc.).

## ⚠️ Posibles errores y soluciones

- **Error de Tailwind/PostCSS**: Si al ejecutar `npm run dev` aparece un error relacionado con PostCSS, asegúrate de tener instaladas las versiones correctas (Tailwind CSS v3) como se indica en la instalación.
- **Ollama no responde**: Verifica que el servicio de Ollama esté corriendo (`ollama serve`). También puedes probar con `curl`:
  ```bash
  curl http://localhost:11434/api/generate -d '{"model": "llama3.2:1b", "prompt": "Hola"}'
  ```
- **El modelo no está descargado**: Ejecuta `ollama pull llama3.2:1b`.

## 📌 Mejoras posibles

- Implementar streaming de respuestas para una experiencia más fluida.
- Guardar el historial en `localStorage`.
- Añadir selección de modelos disponibles.
- Mejorar el diseño con más componentes.

## 📄 Licencia

Este proyecto es de uso libre y educativo. Si lo utilizas, agradecería una mención.

---

¡Disfruta chateando con tu modelo local! Si tienes dudas o sugerencias, no dudes en abrir un issue. 😊