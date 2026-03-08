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

//En Next.js, layout.js se usa para definir la estructura compartida de varias páginas. Es como un contenedor principal donde colocas elementos que se repiten en muchas páginas, por ejemplo:
//Qué es children
//children representa la página actua