/**
 * AnalyzePage.jsx
 * Página de análisis: textarea, ejemplos clickeables, botón analizar y resultado.
 */
import { useState } from "react";
import { analyzeText } from "../api/emotionApi";
import ResultCard from "./ResultCard";

const MAX_CHARS = 2000; // alineado con el validador Pydantic del backend

const EXAMPLES = [
  { text: "¡Estoy tan feliz hoy! Todo está saliendo maravillosamente.", color: "text-blue-600 hover:text-blue-800" },
  { text: "No puedo creer que esto haya pasado. Estoy muy enojado ahora mismo.", color: "text-red-600 hover:text-red-800" },
  { text: "Los extraño mucho. Me siento muy triste hoy.", color: "text-green-700 hover:text-green-900" },
];

export default function AnalyzePage({ onAddToHistory }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeText(text.trim());
      setResult(data);
      // Guardar en historial global
      onAddToHistory({
        id: Date.now(),
        text: text.trim(),
        timestamp: new Date().toISOString(),
        ...data,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "No se pudo conectar con el servidor. ¿Está el backend corriendo?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      {/* Título */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Analizar Emoción del Texto
        </h1>
        <p className="text-base leading-relaxed"
           style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Ingresa un mensaje, conversación de chat o publicación en redes sociales
          para detectar su tono emocional.
        </p>
      </div>

      {/* Tarjeta principal */}
      <div className="card space-y-5">
        {/* Label + Textarea */}
        <div>
          <label htmlFor="emotion-textarea" className="block text-sm font-semibold text-gray-700 mb-2">
            Ingresa tu texto
          </label>
          <textarea
            id="emotion-textarea"
            className="w-full h-44 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                       text-gray-700 placeholder-gray-400 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                       transition"
            placeholder={"Ingresa un mensaje o texto...\n\nEjemplo: '¡Estoy tan feliz hoy! Todo está saliendo maravillosamente.'"}
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); setError(null); }}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {text.length} caracteres
          </p>
        </div>

        {/* Ejemplos */}
        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">💡 Prueba estos ejemplos:</p>
          {EXAMPLES.map(({ text: ex, color }) => (
            <button
              key={ex}
              className={`block text-left text-sm ${color} transition-colors duration-150 hover:underline`}
              onClick={() => { setText(ex); setResult(null); setError(null); }}
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Botón analizar */}
        <button
          id="btn-analizar-emocion"
          className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analizando…
            </>
          ) : (
            "Analizar Emoción"
          )}
        </button>
      </div>

      {/* Resultado */}
      {result && <ResultCard result={result} />}
    </main>
  );
}
