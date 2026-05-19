"""
emotion_model.py
----------------
Carga el modelo pysentimiento/robertuito-emotion-analysis de manera nativa 
para aprovechar su preprocesamiento de texto en español informal (emojis, exclamaciones).
"""

from pysentimiento import create_analyzer
import logging
import threading

logger = logging.getLogger(__name__)
_model_lock = threading.Lock()

# ── Mapeo de etiquetas del modelo → español ──────────────────────
LABEL_MAP: dict[str, str] = {
    "joy": "Alegría",
    "sadness": "Tristeza",
    "anger": "Enojo",
    "fear": "Miedo",
    "surprise": "Sorpresa",
    "disgust": "Disgusto",
    "others": "Others", # pysentimiento a veces incluye esta clase
}

EMOJI_MAP: dict[str, str] = {
    "Alegría": "😊",
    "Tristeza": "😢",
    "Enojo": "😠",
    "Miedo": "😨",
    "Sorpresa": "😲",
    "Disgusto": "🤢",
    "Others": "❓",
}

# ── Singleton: se carga una sola vez al iniciar la aplicación ─────────────────
_analyzer = None


def load_model() -> None:
    """Carga el analizador de emociones en memoria (thread-safe)."""
    global _analyzer
    if _analyzer is not None:
        return  # ya cargado — fast path sin lock

    with _model_lock:               # solo un hilo entra a cargar
        if _analyzer is not None:
            return                  # double-checked locking
        logger.info("Cargando analizador nativo pysentimiento (RoBERTuito)...")
        try:
            # Usamos create_analyzer en lugar de pipeline crudo para aprovechar el preprocesamiento
            _analyzer = create_analyzer(task="emotion", lang="es")
            logger.info("✅ Modelo cargado correctamente.")
        except Exception as exc:
            logger.exception("❌ Error al cargar el modelo: %s", exc)
            raise RuntimeError(f"No se pudo cargar el modelo: {exc}") from exc


def _normalize_label(raw_label: str) -> str:
    """Convierte la etiqueta cruda del modelo a nombre formateado."""
    clean = raw_label.lower().strip()
    return LABEL_MAP.get(clean, clean.capitalize())


def predict(text: str) -> dict:
    """
    Ejecuta la inferencia sobre `text` y retorna un diccionario compatible con React:
      - emotion    : nombre en español de la emoción ganadora
      - confidence : porcentaje de confianza (float 0-100)
      - emoji      : emoji representativo
      - scores     : dict con los puntajes (valores 0-100)
    """
    global _analyzer

    if _analyzer is None:
        load_model()

    # Inferencia con preprocesamiento nativo
    result = _analyzer.predict(text)

    # Construir diccionario de scores normalizados
    scores: dict[str, float] = {}
    for raw_label, proba in result.probas.items():
        label_es = _normalize_label(raw_label)
        scores[label_es] = round(float(proba) * 100, 2)

    # Asegurarnos de que las emociones base existan en el dict (por si acaso)
    for emo in ["Alegría", "Tristeza", "Enojo", "Miedo", "Sorpresa", "Disgusto", "Others"]:
        scores.setdefault(emo, 0.0)

    # Emoción ganadora
    top_emotion = _normalize_label(result.output)
    confidence = scores.get(top_emotion, 0.0)
    emoji = EMOJI_MAP.get(top_emotion, "🤔")

    return {
        "emotion": top_emotion,
        "confidence": confidence,
        "emoji": emoji,
        "scores": scores,
    }