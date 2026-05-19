/**
 * HistoryPage.jsx — Lista de análisis guardados con estado vacío estilizado.
 */
import { useNavigate } from "react-router-dom";

const EMOTION_EMOJIS = {
  alegría: "😊", tristeza: "😢", enojo: "😠",
  miedo: "😨", sorpresa: "😲", disgusto: "🤢",
};

const EMOTION_BADGE_COLORS = {
  alegría:   "bg-yellow-100 text-yellow-700",
  tristeza:  "bg-blue-100   text-blue-700",
  enojo:     "bg-red-100    text-red-700",
  miedo:     "bg-purple-100 text-purple-700",
  sorpresa:  "bg-orange-100 text-orange-700",
  disgusto:  "bg-green-100  text-green-700",
};

function formatDate(iso) {
  return new Date(iso).toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoryPage({ history, onClear }) {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      {/* Encabezado */}
      <div className="text-center mb-10">
        <span className="badge mb-4 inline-flex">🕐 Análisis Guardados</span>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Historial de Análisis
        </h1>
        <p className="text-gray-500">Revisa todos tus análisis anteriores de emociones</p>
      </div>

      {history.length === 0 ? (
        /* Estado vacío */
        <div className="card flex flex-col items-center py-20 gap-4 text-center">
          <span className="text-6xl">📋</span>
          <h2 className="text-xl font-bold text-gray-700">No hay análisis guardados</h2>
          <p className="text-gray-400 text-sm">Comienza analizando texto para ver tu historial aquí</p>
          <button
            id="btn-historial-analizar"
            className="btn-primary mt-2"
            onClick={() => navigate("/analizar")}
          >
            Analizar Texto
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Botón limpiar */}
          <div className="flex justify-end">
            <button
              id="btn-limpiar-historial"
              onClick={onClear}
              className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
            >
              🗑️ Limpiar historial
            </button>
          </div>

          {/* Lista de tarjetas */}
          {[...history].reverse().map((item) => {
            const badgeColor = EMOTION_BADGE_COLORS[item.emotion] ?? "bg-gray-100 text-gray-700";
            const emoji = EMOTION_EMOJIS[item.emotion] ?? "🤔";
            return (
              <article
                key={item.id}
                className="card hover:shadow-md transition-shadow duration-200 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Texto analizado */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-2">
                    "{item.text}"
                  </p>
                  {/* Emoción detectada */}
                  <span className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                    {emoji} {item.emotion}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>Confianza: <strong className="text-gray-600">{item.confidence.toFixed(1)}%</strong></span>
                  <time dateTime={item.timestamp}>{formatDate(item.timestamp)}</time>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
