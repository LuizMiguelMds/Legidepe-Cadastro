from sqlalchemy.orm import Session, joinedload
from app.models.models import Question, User
from app.schemas.schemas import QuestionCreate, QuestionUpdate, QuestionStatus
from typing import List, Optional

def get_question(db: Session, question_id: int):
    return db.query(Question).options(joinedload(Question.user)).filter(Question.id == question_id).first()

def get_questions(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    user_id: Optional[int] = None,
    status: Optional[QuestionStatus] = None,
    tema_principal: Optional[str] = None,
    nivel_escolar: Optional[str] = None
):
    query = db.query(Question).options(joinedload(Question.user))
    
    if user_id:
        query = query.filter(Question.user_id == user_id)
    if status:
        query = query.filter(Question.status == status)
    if tema_principal:
        query = query.filter(Question.tema_principal.ilike(f"%{tema_principal}%"))
    if nivel_escolar:
        query = query.filter(Question.nivel_escolar.ilike(f"%{nivel_escolar}%"))
    
    return query.offset(skip).limit(limit).all()

def get_questions_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Question).options(joinedload(Question.user)).filter(Question.user_id == user_id).offset(skip).limit(limit).all()

def create_question(db: Session, question: QuestionCreate, user_id: int):
    db_question = Question(
        user_id=user_id,
        tema_principal=question.tema_principal,
        subtopico=question.subtopico,
        enunciado=question.enunciado,
        tipo_questao=question.tipo_questao,
        url_imagem=question.url_imagem,
        descricao_imagem=question.descricao_imagem,
        fonte_imagem=question.fonte_imagem,
        nivel_escolar=question.nivel_escolar,
        alternativa_a=question.alternativa_a,
        alternativa_b=question.alternativa_b,
        alternativa_c=question.alternativa_c,
        alternativa_d=question.alternativa_d,
        alternativa_e=question.alternativa_e,
        resposta_correta=question.resposta_correta,
        texto_alternativa_correta=question.texto_alternativa_correta,
        dica=question.dica,
        fonte_bibliografica=question.fonte_bibliografica,
        
        # NOVOS CAMPOS ADICIONADOS
        ano_questao=question.ano_questao,
        banca=question.banca
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def update_question(db: Session, question_id: int, question_update: QuestionUpdate):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        update_data = question_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_question, field, value)
        db.commit()
        db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question

def update_question_status(db: Session, question_id: int, status: QuestionStatus):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        db_question.status = status
        db.commit()
        db.refresh(db_question)
    return db_question

def get_questions_count(db: Session, user_id: Optional[int] = None, status: Optional[QuestionStatus] = None):
    query = db.query(Question)
    if user_id:
        query = query.filter(Question.user_id == user_id)
    if status:
        query = query.filter(Question.status == status)
    return query.count()

def get_questions_for_export(db: Session, status: Optional[QuestionStatus] = None):
    query = db.query(Question).options(joinedload(Question.user))
    if status:
        query = query.filter(Question.status == status)
    return query.all()