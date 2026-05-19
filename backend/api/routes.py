"""
routes.py
---------
Router FastAPI con el endpoint POST /analyze.
Valida el body con Pydantic, llama al modelo y retorna el resultado.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, field_validator
from models.emotion_model import predict
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


# ── Esquemas Pydantic ─────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def text_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("El texto no puede estar vacío.")
        if len(v) > 2000:
            raise ValueError("El texto no puede superar los 2000 caracteres.")
        return v


class AnalyzeResponse(BaseModel):
    emotion: str
    confidence: float
    emoji: str
    scores: dict[str, float]


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analiza el tono emocional de un texto en español",
    tags=["Análisis"],
)
async def analyze_emotion(body: AnalyzeRequest) -> AnalyzeResponse:
    """
    Recibe un texto, lo pasa por el modelo RoBERTuito y devuelve:
    - **emotion**: emoción dominante (alegría, tristeza, enojo, miedo, sorpresa, disgusto)
    - **confidence**: porcentaje de confianza (0-100)
    - **emoji**: emoji representativo
    - **scores**: diccionario con los puntajes de las 6 emociones
    """
    logger.info("Analizando texto: %r (len=%d)", body.text[:60], len(body.text))
    try:
        result = predict(body.text)
        return AnalyzeResponse(**result)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        )
    except HTTPException:
        raise  # re-propagar HTTPExceptions sin envolverlas
    except Exception as exc:
        logger.exception("Error inesperado al analizar: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar el texto.",
        )
