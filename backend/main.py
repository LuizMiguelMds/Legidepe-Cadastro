from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, questions, admin
from app.core.database import engine
from app.models import models
import os

# Criar tabelas se não existirem
models.Base.metadata.create_all(bind=engine)

# Criar aplicação FastAPI
app = FastAPI(
    title="Sistema de Questões de Geografia - Laboratório Legidepe",
    description="API para cadastro e gerenciamento de questões de geografia",
    version="1.0.0"
)

# CORRIGIR CORS - MAIS ESPECÍFICO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Específico para Vite
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Criar diretório de uploads se não existir
os.makedirs("uploads", exist_ok=True)

# Servir arquivos estáticos (imagens)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir roteadores
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "message": "Sistema de Questões de Geografia - Laboratório Legidepe",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)