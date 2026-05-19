"""
evaluacion.py
=============
Script independiente de evaluación del modelo pysentimiento/robertuito-emotion-analysis.

Hito 3 — Evaluación | Proyecto: Detección de Estados Emocionales en Texto
Curso: Ingeniería de Sistemas — Inteligencia Artificial

Ejecutar (con el venv activado):
    cd backend
    venv\\Scripts\\activate
    pip install scikit-learn matplotlib seaborn
    python evaluacion.py
"""

# ── Dependencias ──────────────────────────────────────────────────────────────
from pysentimiento import create_analyzer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
import numpy as np

# ══════════════════════════════════════════════════════════════════════════════
# DATASET DE PRUEBA — Ground Truth (15 textos en español informal)
# Etiquetas posibles del modelo: joy, sadness, anger, fear, surprise, disgust
# ══════════════════════════════════════════════════════════════════════════════
DATASET = [
    # ── Alegría (joy) — textos positivos claros ────────────────────────────
    {
        "text": "¡Me acabo de enterar que me aceptaron en la beca! Estoy llorando de felicidad 😭🎉",
        "expected": "joy",
        "nota": "Alegría explícita con intensificadores emocionales."
    },
    {
        "text": "Hoy fue el mejor día de mi vida, todo salió perfecto y no puedo estar más agradecido",
        "expected": "joy",
        "nota": "Alegría positiva sin ironía."
    },
    {
        "text": "¡Qué chido! Por fin viernes, se me va a olvidar todo lo que pasó esta semana 🙌",
        "expected": "joy",
        "nota": "Modismo mexicano 'qué chido', alivio y alegría combinados."
    },

    # ── Tristeza (sadness) — pérdida, nostalgia ────────────────────────────
    {
        "text": "Se fue mi abuelita esta madrugada. El dolor que siento no tiene palabras 💔",
        "expected": "sadness",
        "nota": "Duelo directo, emoción intensa."
    },
    {
        "text": "Ya no me contesta los mensajes. Creo que todo terminó y ni cuenta se dio de lo que me dolió.",
        "expected": "sadness",
        "nota": "Ruptura sentimental implícita, tristeza sin palabras directas."
    },
    {
        "text": "Extraño mucho como era antes todo. Ahora nada se siente igual.",
        "expected": "sadness",
        "nota": "Nostalgia y melancolía."
    },

    # ── Enojo (anger) — frustración, rabia ────────────────────────────────
    {
        "text": "Ya me tienen hasta la madre con sus excusas. Siempre lo mismo y nunca cambian nada.",
        "expected": "anger",
        "nota": "Expresión coloquial intensa de rabia, modismo 'hasta la madre'."
    },
    {
        "text": "¡Qué coraje! Me robaron el celular en el camión y nadie hizo nada.",
        "expected": "anger",
        "nota": "Enojo situacional con 'qué coraje', muy común en México."
    },
    {
        "text": "No puedo creer que hayas hecho eso después de todo lo que hicimos por ti. Decepcionante.",
        "expected": "anger",
        "nota": "Enojo combinado con traición."
    },

    # ── Miedo (fear) — ansiedad, amenaza ──────────────────────────────────
    {
        "text": "No puedo dormir pensando en los resultados de mañana. Siento que algo malo va a pasar.",
        "expected": "fear",
        "nota": "Ansiedad anticipatoria, miedo implícito."
    },
    {
        "text": "Escuché pasos en el pasillo a las 3 am y estaba solo. Me paralicé del susto.",
        "expected": "fear",
        "nota": "Miedo situacional concreto."
    },

    # ── Sorpresa (surprise) ────────────────────────────────────────────────
    {
        "text": "¡No lo puedo creer! Me hicieron una fiesta sorpresa y no sospeché absolutamente nada 😮",
        "expected": "surprise",
        "nota": "Sorpresa positiva directa."
    },
    {
        "text": "Me avisaron hoy que tengo que presentar el proyecto mañana. Nadie me había dicho nada.",
        "expected": "surprise",
        "nota": "Sorpresa negativa por información repentina."
    },

    # ── Disgusto (disgust) — con sarcasmo / ambigüedad ────────────────────
    {
        "text": "Qué asco de actitud. Lleva semanas haciéndose el víctima y todo el mundo se lo cree.",
        "expected": "disgust",
        "nota": "Disgusto social con 'qué asco', expresión directa."
    },
    {
        "text": "Sí claro, 'todo va a estar bien'. Igual que la última vez que prometiste algo. Genial.",
        "expected": "disgust",
        "nota": "SARCASMO: tono irónico. El modelo podría clasificarlo como joy o anger. Caso de falla esperado."
    },
]

# ══════════════════════════════════════════════════════════════════════════════
# PASO 1: Cargar el analizador (singleton — se descarga una sola vez)
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "═" * 65)
print("  EVALUACIÓN — EmocionIA | Modelo: robertuito-emotion-analysis")
print("═" * 65)
print("\n[1/4] Cargando modelo pysentimiento …")
analyzer = create_analyzer(task="emotion", lang="es")
print("      ✅ Modelo listo.\n")

# ══════════════════════════════════════════════════════════════════════════════
# PASO 2: Inferencia sobre el dataset
# ══════════════════════════════════════════════════════════════════════════════
print("[2/4] Ejecutando inferencia sobre 15 textos …\n")

LABEL_ES = {
    "joy": "alegría",
    "sadness": "tristeza",
    "anger": "enojo",
    "fear": "miedo",
    "surprise": "sorpresa",
    "disgust": "disgusto",
}

# Etiquetas únicas en el orden canónico del modelo
CLASSES = ["joy", "sadness", "anger", "fear", "surprise", "disgust"]
CLASSES_ES = [LABEL_ES[c] for c in CLASSES]

y_true = []
y_pred = []
results_detail = []

for i, item in enumerate(DATASET):
    output = analyzer.predict(item["text"])
    predicted_label = output.output          # etiqueta ganadora en inglés
    predicted_es = LABEL_ES.get(predicted_label, predicted_label)
    expected_es = LABEL_ES.get(item["expected"], item["expected"])
    correct = predicted_label == item["expected"]

    y_true.append(item["expected"])
    y_pred.append(predicted_label)
    results_detail.append({
        "idx": i + 1,
        "text": item["text"][:70] + ("…" if len(item["text"]) > 70 else ""),
        "expected": item["expected"],
        "predicted": predicted_label,
        "correct": correct,
        "scores": output.probas,
    })

    status = "✅" if correct else "❌"
    print(
        f"  [{i+1:02d}] {status} | Esperado: {item['expected']:<9}"
        f"| Predicho: {predicted_label:<9}"
        f"| Confianza: {output.probas.get(predicted_label, 0):.1%}"
    )
    if not correct:
        print(f"        └─ FALLO: {item['nota']}")

# ══════════════════════════════════════════════════════════════════════════════
# PASO 3: Métricas con scikit-learn
# ══════════════════════════════════════════════════════════════════════════════
print("\n[3/4] Calculando métricas …\n")

accuracy  = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred, average="weighted", zero_division=0)
recall    = recall_score(y_true, y_pred, average="weighted", zero_division=0)
f1        = f1_score(y_true, y_pred, average="weighted", zero_division=0)

sep = "─" * 65
print(sep)
print(f"  {'Accuracy':<20} {accuracy:.4f}   ({accuracy*100:.2f}%)")
print(f"  {'Precision (weighted)':<20} {precision:.4f}   ({precision*100:.2f}%)")
print(f"  {'Recall (weighted)':<20} {recall:.4f}   ({recall*100:.2f}%)")
print(f"  {'F1-Score (weighted)':<20} {f1:.4f}   ({f1*100:.2f}%)")
print(sep)

print("\n  Reporte completo por clase:\n")
print(classification_report(
    y_true, y_pred,
    labels=CLASSES,
    target_names=CLASSES_ES,
    zero_division=0,
))

# ══════════════════════════════════════════════════════════════════════════════
# PASO 4: Matriz de confusión con seaborn/matplotlib
# ══════════════════════════════════════════════════════════════════════════════
print("[4/4] Generando matriz de confusión …\n")

cm = confusion_matrix(y_true, y_pred, labels=CLASSES)

fig, ax = plt.subplots(figsize=(9, 7))
fig.patch.set_facecolor("#f0f4ff")
ax.set_facecolor("#f8f9ff")

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="RdYlGn",
    linewidths=0.5,
    linecolor="#d1d5db",
    xticklabels=CLASSES_ES,
    yticklabels=CLASSES_ES,
    ax=ax,
    cbar_kws={"shrink": 0.8},
    annot_kws={"size": 14, "weight": "bold"},
)

ax.set_xlabel("Emoción Predicha", fontsize=13, labelpad=12, color="#374151")
ax.set_ylabel("Emoción Real (Ground Truth)", fontsize=13, labelpad=12, color="#374151")
ax.set_title(
    "Matriz de Confusión — EmocionIA\n"
    "Modelo: pysentimiento/robertuito-emotion-analysis",
    fontsize=14,
    fontweight="bold",
    pad=18,
    color="#1e1b4b",
)
ax.tick_params(axis="both", labelsize=11, colors="#374151")

# Recuadro de métricas en la figura
metrics_text = (
    f"Accuracy:  {accuracy*100:.1f}%   |   "
    f"Precision: {precision*100:.1f}%   |   "
    f"Recall: {recall*100:.1f}%   |   "
    f"F1-Score: {f1*100:.1f}%"
)
fig.text(
    0.5, 0.01, metrics_text,
    ha="center", va="bottom",
    fontsize=10.5,
    color="#4f46e5",
    fontweight="bold",
    bbox=dict(boxstyle="round,pad=0.4", facecolor="white",
              edgecolor="#c7d2fe", alpha=0.9),
)

plt.tight_layout(rect=[0, 0.06, 1, 1])
output_path = "matriz_confusion.png"
plt.savefig(output_path, dpi=150, bbox_inches="tight")
print(f"  ✅ Imagen guardada como '{output_path}'")
print("\n  Mostrando gráfico …")
plt.show()

print("\n  Evaluación finalizada.\n")
