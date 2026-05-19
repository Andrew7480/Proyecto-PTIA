#!/usr/bin/env python3
"""
Script para iniciar frontend + backend simultáneamente
Soluciona problemas de variables de entorno en Windows + PyTorch
"""

import os
import sys
import subprocess
import time
import platform
from pathlib import Path

# Obtener el directorio raíz del proyecto
PROJECT_ROOT = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"

def kill_port(port):
    """Intenta matar procesos en un puerto específico"""
    try:
        if platform.system() == "Windows":
            subprocess.run(f'netstat -ano | find ":{port}" | for /f "tokens=5" %a in (\'more\') do taskkill /PID %a /F', shell=True, capture_output=True)
    except:
        pass

def main():
    print("\n" + "="*60)
    print("EmocionIA - Iniciando aplicacion completa")
    print("="*60 + "\n")
    
    # Liberar puertos si están en uso
    print("[*] Liberando puertos...")
    kill_port(8089)
    kill_port(5173)
    time.sleep(1)
    
    # Configurar variables de entorno para PyTorch en Windows
    env = os.environ.copy()
    env["OMP_NUM_THREADS"] = "1"
    env["MKL_NUM_THREADS"] = "1"
    env["PYTHONUNBUFFERED"] = "1"
    
    print("[1/2] Iniciando Backend en puerto 8089...")
    print("      Backend: http://localhost:8089")
    print("      Docs:    http://localhost:8089/docs\n")
    
    # Iniciar backend
    backend_cmd = [
        sys.executable,
        "-m", "uvicorn",
        "main:app",
        "--host", "127.0.0.1",
        "--port", "8089",
        "--log-level", "info"
    ]
    
    try:
        backend_process = subprocess.Popen(
            backend_cmd,
            cwd=str(BACKEND_DIR),
            env=env,
        )
    except Exception as e:
        print(f"Error iniciando backend: {e}")
        sys.exit(1)
    
    # Esperar a que el backend esté listo
    time.sleep(4)
    
    print("[2/2] Iniciando Frontend en puerto 5173...")
    print("      Frontend: http://localhost:5173\n")
    
    # Iniciar frontend con shell=True para Windows
    try:
        frontend_process = subprocess.Popen(
            "npm run dev",
            cwd=str(FRONTEND_DIR),
            env=env,
            shell=True,
        )
    except Exception as e:
        print(f"Error iniciando frontend: {e}")
        backend_process.terminate()
        sys.exit(1)
    
    # Mostrar resumen
    print("="*60)
    print("Aplicacion iniciada correctamente!")
    print("="*60)
    print("Frontend: http://localhost:5173")
    print("Backend:  http://localhost:8089")
    print("Docs API: http://localhost:8089/docs")
    print("\nPresiona Ctrl+C para detener ambos procesos\n")
    
    try:
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n\nDeteniendo aplicacion...")
        backend_process.terminate()
        frontend_process.terminate()
        
        try:
            backend_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()
            frontend_process.kill()
        
        print("Aplicacion detenida.")
        sys.exit(0)

if __name__ == "__main__":
    main()
