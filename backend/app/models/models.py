from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relacionamento com questões
    questions = relationship("Question", back_populates="user", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="check_user_role"),
    )

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_cadastro = Column(Date, nullable=False, server_default=func.current_date())
    tema_principal = Column(String(100), nullable=False, index=True)
    subtopico = Column(String(100), nullable=False)
    enunciado = Column(Text, nullable=False)
    tipo_questao = Column(String(50), nullable=False)
    url_imagem = Column(String(255))
    descricao_imagem = Column(Text)
    fonte_imagem = Column(String(255))
    nivel_escolar = Column(String(50), nullable=False, index=True)
    alternativa_a = Column(Text, nullable=False)
    alternativa_b = Column(Text, nullable=False)
    alternativa_c = Column(Text, nullable=False)
    alternativa_d = Column(Text, nullable=False)
    alternativa_e = Column(Text, nullable=False)
    resposta_correta = Column(String(1), nullable=False)
    texto_alternativa_correta = Column(Text, nullable=False)
    dica = Column(Text)
    fonte_bibliografica = Column(Text)
    
    # NOVOS CAMPOS ADICIONADOS
    ano_questao = Column(Integer)
    banca = Column(String(100))
    
    status = Column(String(20), nullable=False, default="pending", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relacionamento com usuário
    user = relationship("User", back_populates="questions")
    
    __table_args__ = (
        CheckConstraint("resposta_correta IN ('A', 'B', 'C', 'D', 'E')", name="check_resposta_correta"),
        CheckConstraint("status IN ('pending', 'approved', 'rejected')", name="check_question_status"),
    )