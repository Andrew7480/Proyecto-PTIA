"""
main.py
-------
Entry point de la aplicación FastAPI.
- Configura CORS para el frontend local (Vite en :5173)
- Carga el modelo al iniciar (lifespan event)
- Monta el router de análisis en /api
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.emotion_model import load_model
from api.routes import router

# ── Logging básico ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan: carga el modelo UNA SOLA VEZ al iniciar ────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Iniciando EmocionIA Backend …")
    load_model()          # bloquea hasta tener el modelo listo
    yield
    logger.info("👋 Cerrando EmocionIA Backend.")


# ── Aplicación FastAPI ────────────────────────────────────────────────────────
app = FastAPI(
    title="EmocionIA API",
    description="Análisis de emociones en texto en español usando RoBERTuito.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — permite peticiones desde el frontend local de Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar rutas bajo /api
app.include_router(router, prefix="/api")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "EmocionIA API está funcionando ✅"}
