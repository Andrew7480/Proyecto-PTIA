# 🧠 EmocionIA — Detección de Estados Emocionales en Texto

<div align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=000" alt="Hugging Face" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br>

> **Proyecto académico desarrollado para el curso de Principios y Tecnologías de Inteligencia Artificial (PTIA) en la Escuela Colombiana de Ingeniería Julio Garavito.**
> 
> MVP funcional de arquitectura cliente-servidor que utiliza modelos Transformer de estado del arte (SOTA) para analizar texto informal en español y clasificarlo en seis estados emocionales: alegría, tristeza, enojo, miedo, sorpresa y disgusto.

---

## 📸 Interfaz del Proyecto


| Análisis de Emociones | Historial de Evaluaciones |
|:---:|:---:|
| <img src="docs/img/analisis.png" width="400" alt="Pantalla de Análisis"> | <img src="docs/img/historial.png" width="400" alt="Pantalla de Historial"> |

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una arquitectura desacoplada para aislar la pesada carga del procesamiento tensorial de la interfaz de usuario:

1. **Frontend (React + Vite):** Captura el texto en tiempo real, gestiona el estado y el historial local (LocalStorage) y renderiza las probabilidades.
2. **Backend (FastAPI):** Expone un endpoint RESTful (`/api/analyze`) con manejo estricto de CORS.
3. **Capa de Inteligencia (Hugging Face / PyTorch):** Utiliza Transfer Learning mediante el modelo `RoBERTuito`, aplicando preprocesamiento nativo para español (normalización de modismos y emojis) e infiriendo vectores de probabilidad mediante *Softmax*.

---

## 🚀 Requisitos Previos

- **Python 3.10+**
- **Node.js 18+** y npm
- Conexión a internet estable (la primera ejecución descargará los pesos del modelo neuronal: ~500 MB).

---

## 🛠️ Instalación y Ejecución

### 1. Backend (Servidor de IA)

Abre una terminal y ejecuta:

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias exactas para evitar conflictos
pip install -r requirements.txt

# Levantar servidor
uvicorn main:app --reload

```

> La API estará disponible en: `http://localhost:8000`  
> Documentación interactiva (Swagger UI): `http://localhost:8000/docs`

### 2. Frontend (Interfaz de Usuario)

Abre una **segunda terminal**, mantén el backend corriendo, y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

> La aplicación web estará disponible en: `http://localhost:5173`

---

## 📡 Endpoint de la API

### `POST /api/analyze`

**Request Body:**
```json
{ 
  "text": "¡Qué coraje! Me robaron el celular en el camión y nadie hizo nada." 
}

**Response:**

```json
{
  "emotion": "Enojo",
  "confidence": 89.5,
  "emoji": "😠",
  "scores": {
    "Alegría":  0.9,
    "Tristeza":  0.8,
    "Enojo":     89.5,
    "Miedo":     0.9,
    "Sorpresa":  1.4,
    "Disgusto":  4.1,
    "Others":    2.4
  }
}
```
## 🧠 Modelo de IA

- **Modelo Base:** `pysentimiento/robertuito-emotion-analysis`
- **Técnica:** Transfer Learning / Zero-shot inference
- **Corpus de Entrenamiento:** TASS / Tweets en español (Latinoamérica y España).
- **Métricas MVP:** Accuracy: 66.7% | F1-Score: 61.0% (Evaluado con dataset de prueba informal incluyendo modismos y sarcasmo).

---

## 👨‍💻 Autores

- **María Paula Rodríguez Muñoz**
- **Andrés Felipe Cardozo Martínez**

**Repositorio oficial:** [Andrew7480/Proyecto-PTIA](https://github.com/Andrew7480/Proyecto-PTIA)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Siéntete libre de utilizarlo y modificarlo con fines académicos o personales.