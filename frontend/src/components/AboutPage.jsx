/**
 * AboutPage.jsx — Página "Acerca de" con información académica del proyecto.
 */
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 animate-fade-in space-y-8">
      {/* Encabezado */}
      <div className="text-center">
        <span className="badge mb-4 inline-flex">🎓 Proyecto Académico de Investigación</span>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Acerca de Este Proyecto
        </h1>
        <p className="text-base leading-relaxed"
           style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Un sistema de detección de emociones impulsado por IA para investigación
          y aprendizaje académico.
        </p>
      </div>

      {/* Card: Descripción del Proyecto */}
      <div className="card space-y-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🔬</span> Descripción del Proyecto
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Esta aplicación web es parte de un{" "}
          <strong>proyecto del curso de Inteligencia Artificial</strong>, enfocado
          en aplicar técnicas de Procesamiento de Lenguaje Natural (PLN) para
          analizar y clasificar emociones en datos de texto.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          El sistema utiliza modelos de aprendizaje automático entrenados en
          conjuntos de datos etiquetados con emociones para predecir el tono
          emocional de textos cortos como mensajes de chat, publicaciones en redes
          sociales o declaraciones breves.
        </p>
      </div>

      {/* Card: Conceptos Clave de IA */}
      <div className="card space-y-5">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">💡</span> Conceptos Clave de IA
        </h2>

        {[
          {
            title: "Procesamiento de Lenguaje Natural (PLN)",
            desc: "Rama de la IA que permite a las computadoras entender e interpretar lenguaje humano para extraer significado emocional del texto.",
          },
          {
            title: "Clasificación de Aprendizaje Automático",
            desc: "El modelo categoriza texto en 6 clases de emociones (alegría, tristeza, enojo, miedo, sorpresa, disgusto) usando técnicas de aprendizaje supervisado.",
          },
          {
            title: "Análisis de Emociones",
            desc: "Identifica sentimientos específicos más allá del sentimiento básico (positivo/negativo), proporcionando visión profunda de patrones de comunicación.",
          },
          {
            title: "Transfer Learning con RoBERTuito",
            desc: "Se usa el modelo preentrenado pysentimiento/robertuito-emotion-analysis, especializado en español coloquial de Twitter, sin entrenamiento desde cero.",
          },
        ].map(({ title, desc }) => (
          <div key={title}>
            <h3 className="font-semibold text-gray-700 text-sm mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Aviso de prototipo */}
      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 leading-relaxed">
        ⚠️ <strong>Prototipo Educativo:</strong> Este es un prototipo de interfaz
        navegable diseñado para validar la experiencia del usuario. La detección
        de emociones utiliza el modelo{" "}
        <strong>RoBERTuito (pysentimiento)</strong> vía API de HuggingFace.
        Requiere Python + FastAPI corriendo en el backend local.
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          id="btn-probar-prototipo"
          className="btn-primary"
          onClick={() => navigate("/analizar")}
        >
          Probar el Prototipo
        </button>
      </div>
    </main>
  );
}
