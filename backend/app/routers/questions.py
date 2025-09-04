from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_active_user, get_admin_user
from app.crud.crud_question import (
    get_question, get_questions, get_questions_by_user, create_question,
    update_question, delete_question, update_question_status, get_questions_count
)
from app.schemas.schemas import Question, QuestionCreate, QuestionUpdate, QuestionList, QuestionStatus, User
from app.models.models import User as UserModel
import os
import shutil
from uuid import uuid4

router = APIRouter(prefix="/questions", tags=["Questões"])

@router.post("/", response_model=Question, status_code=status.HTTP_201_CREATED)
def create_new_question(
    question: QuestionCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Criar nova questão"""
    return create_question(db=db, question=question, user_id=current_user.id)

@router.get("/", response_model=List[QuestionList])
def list_questions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[QuestionStatus] = None,
    tema_principal: Optional[str] = None,
    nivel_escolar: Optional[str] = None,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Listar questões (usuário vê apenas as suas, admin vê todas)"""
    if current_user.role == "admin":
        return get_questions(
            db, skip=skip, limit=limit, status=status,
            tema_principal=tema_principal, nivel_escolar=nivel_escolar
        )
    else:
        return get_questions(
            db, skip=skip, limit=limit, user_id=current_user.id,
            status=status, tema_principal=tema_principal, nivel_escolar=nivel_escolar
        )

@router.get("/my", response_model=List[QuestionList])
def list_my_questions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Listar questões do usuário logado"""
    return get_questions_by_user(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/count")
def count_questions(
    status: Optional[QuestionStatus] = None,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Contar questões"""
    if current_user.role == "admin":
        total = get_questions_count(db, status=status)
    else:
        total = get_questions_count(db, user_id=current_user.id, status=status)
    
    return {"total": total}

@router.get("/{question_id}", response_model=Question)
def get_question_detail(
    question_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obter detalhes de uma questão"""
    question = get_question(db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    # Usuário comum só pode ver suas próprias questões
    if current_user.role != "admin" and question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    return question

@router.put("/{question_id}", response_model=Question)
def update_question_detail(
    question_id: int,
    question_update: QuestionUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Atualizar questão"""
    question = get_question(db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    # Usuário comum só pode editar suas próprias questões
    if current_user.role != "admin" and question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    return update_question(db=db, question_id=question_id, question_update=question_update)

@router.delete("/{question_id}")
def delete_question_detail(
    question_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deletar questão"""
    question = get_question(db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    # Usuário comum só pode deletar suas próprias questões
    if current_user.role != "admin" and question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    delete_question(db=db, question_id=question_id)
    return {"message": "Questão deletada com sucesso"}

@router.post("/{question_id}/upload-image")
def upload_question_image(
    question_id: int,
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload de imagem para questão"""
    question = get_question(db, question_id=question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    # Usuário comum só pode fazer upload para suas próprias questões
    if current_user.role != "admin" and question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verificar tipo de arquivo
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    try:
        # Gerar nome único para o arquivo
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid4()}.{file_extension}"
        
        # Criar diretório se não existir
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Salvar arquivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Atualizar questão com URL da imagem
        question_update = QuestionUpdate(url_imagem=f"/uploads/{unique_filename}")
        updated_question = update_question(db=db, question_id=question_id, question_update=question_update)
        
        return {"message": "Imagem enviada com sucesso", "url": f"/uploads/{unique_filename}"}
    
    except Exception as e:
        print(f"Erro no upload: {e}")  # Log do erro
        raise HTTPException(status_code=500, detail=f"Erro ao salvar imagem: {str(e)}")