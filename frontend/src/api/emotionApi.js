/**
 * emotionApi.js
 * Cliente Axios para comunicarse con el backend FastAPI.
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 30000, // 30 s — el modelo puede tardar en la primera inferencia
  headers: { "Content-Type": "application/json" },
});

/**
 * Envía un texto al backend y obtiene el análisis de emociones.
 * @param {string} text
 * @returns {Promise<{ emotion: string, confidence: number, emoji: string, scores: object }>}
 */
export async function analyzeText(text) {
  const response = await apiClient.post("/analyze", { text });
  return response.data;
}

export default apiClient;
