/**
 * App.jsx
 * Root de la aplicación: React Router, estado global del historial y localStorage.
 */
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header      from "./components/Header";
import HomePage    from "./components/HomePage";
import AnalyzePage from "./components/AnalyzePage";
import HistoryPage from "./components/HistoryPage";
import AboutPage   from "./components/AboutPage";

const STORAGE_KEY = "emocionia_history";

export default function App() {
  // ── Estado global del historial ──────────────────────────────────────────
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistir en localStorage cada vez que cambia el historial
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/analizar" element={<AnalyzePage onAddToHistory={addToHistory} />} />
          <Route path="/historial" element={<HistoryPage history={history} onClear={clearHistory} />} />
          <Route path="/acerca"   element={<AboutPage />} />
          {/* 404 */}
          <Route path="*" element={
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-10">
              <span className="text-7xl">🔍</span>
              <h1 className="text-3xl font-bold text-gray-700">Página no encontrada</h1>
              <p className="text-gray-400">La ruta que buscas no existe.</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
