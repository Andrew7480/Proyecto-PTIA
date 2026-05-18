/**
 * ResultCard.jsx — Tarjeta que muestra el resultado del análisis de emoción.
 * Recibe la respuesta del backend y renderiza:
 *  - Emoji + nombre de emoción ganadora
 *  - Barra de confianza animada
 *  - Mini tabla con los 6 puntajes
 */

const EMOTION_COLORS = {
  alegría:   { bar: "from-yellow-400 to-amber-500",  bg: "bg-yellow-50",  text: "text-yellow-700"  },
  tristeza:  { bar: "from-blue-400   to-blue-600",   bg: "bg-blue-50",    text: "text-blue-700"    },
  enojo:     { bar: "from-red-400    to-red-600",    bg: "bg-red-50",     text: "text-red-700"     },
  miedo:     { bar: "from-purple-400 to-purple-600", bg: "bg-purple-50",  text: "text-purple-700"  },
  sorpresa:  { bar: "from-orange-400 to-orange-500", bg: "bg-orange-50",  text: "text-orange-700"  },
  disgusto:  { bar: "from-green-400  to-green-600",  bg: "bg-green-50",   text: "text-green-700"   },
};

const EMOTION_EMOJIS = {
  alegría: "😊", tristeza: "😢", enojo: "😠",
  miedo: "😨", sorpresa: "😲", disgusto: "🤢",
};

export default function ResultCard({ result }) {
  if (!result) return null;
  const { emotion, confidence, scores } = result;
  const palette = EMOTION_COLORS[emotion] ?? { bar: "from-indigo-400 to-purple-500", bg: "bg-indigo-50", text: "text-indigo-700" };
  const emoji = EMOTION_EMOJIS[emotion] ?? "🤔";

  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="card animate-slide-up mt-6 space-y-6">
      {/* Emoción principal */}
      <div className={`${palette.bg} rounded-xl p-6 flex flex-col items-center gap-3`}>
        <span className="text-7xl drop-shadow">{emoji}</span>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Emoción Detectada</p>
        <h2 className={`text-3xl font-extrabold capitalize ${palette.text}`}>{emotion}</h2>

        {/* Barra de confianza */}
        <div className="w-full mt-2">
          <div className="flex justify-between text-sm font-medium mb-1.5">
            <span className="text-gray-500">Nivel de Confianza</span>
            <span className={`font-bold ${palette.text}`}>{confidence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${palette.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
              role="progressbar"
              aria-valuenow={confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Confianza: ${confidence.toFixed(1)}%`}
            />
          </div>
        </div>
      </div>

      {/* Tabla de puntajes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Distribución de emociones
        </h3>
        <div className="space-y-2.5">
          {sortedScores.map(([emo, score]) => {
            const p = EMOTION_COLORS[emo] ?? { bar: "from-gray-300 to-gray-400" };
            return (
              <div key={emo} className="flex items-center gap-3">
                <span className="text-lg">{EMOTION_EMOJIS[emo] ?? "❓"}</span>
                <span className="w-20 text-sm font-medium text-gray-600 capitalize">{emo}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${p.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-12 text-right">
                  {score.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
