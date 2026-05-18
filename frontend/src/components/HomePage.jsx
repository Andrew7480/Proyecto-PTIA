/**
 * HomePage.jsx — Página de inicio con Hero section y categorías de emociones.
 */
import { useNavigate } from "react-router-dom";

const emotions = [
  { label: "Alegría",  emoji: "😊", color: "bg-yellow-50  text-yellow-700 border-yellow-200" },
  { label: "Tristeza", emoji: "😢", color: "bg-blue-50    text-blue-700   border-blue-200"   },
  { label: "Enojo",    emoji: "😠", color: "bg-red-50     text-red-700    border-red-200"    },
  { label: "Miedo",    emoji: "😨", color: "bg-purple-50  text-purple-700 border-purple-200" },
  { label: "Sorpresa", emoji: "😲", color: "bg-orange-50  text-orange-700 border-orange-200" },
  { label: "Disgusto", emoji: "🤢", color: "bg-green-50   text-green-700  border-green-200"  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-center animate-fade-in">
      {/* Badge */}
      <span className="badge mb-6 inline-flex">
        ✨ Análisis de Emociones con IA
      </span>

      {/* Título con degradado */}
      <h1 className="text-5xl font-extrabold leading-tight mb-6"
          style={{ background: "linear-gradient(135deg, #6366f1 20%, #8b5cf6 80%)",
                   WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Detección de Emociones en Texto
      </h1>

      {/* Descripción */}
      <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
        Aprovecha el poder del Procesamiento de Lenguaje Natural para analizar el
        tono emocional en texto. Perfecto para investigadores, estudiantes y
        cualquier persona interesada en el análisis de sentimientos.
      </p>

      {/* CTA */}
      <button
        id="btn-iniciar-analisis"
        className="btn-primary text-base px-10 py-3.5"
        onClick={() => navigate("/analizar")}
      >
        Iniciar Análisis
      </button>

      {/* Categorías */}
      <section className="mt-20 card py-10 animate-slide-up" aria-label="Categorías de emociones">
        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Categorías de Emociones Detectadas
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {emotions.map(({ label, emoji, color }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm ${color} transition-transform hover:scale-105 cursor-default`}
            >
              <span className="text-xl">{emoji}</span>
              {label}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
