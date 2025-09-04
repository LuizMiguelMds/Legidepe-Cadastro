from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class QuestionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class RespostaCorreta(str, Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

# Schemas para User
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('A senha deve ter pelo menos 6 caracteres')
        return v

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Schemas para Question
class QuestionBase(BaseModel):
    tema_principal: str
    subtopico: str
    enunciado: str
    tipo_questao: str
    url_imagem: Optional[str] = None
    descricao_imagem: Optional[str] = None
    fonte_imagem: Optional[str] = None
    nivel_escolar: str
    alternativa_a: str
    alternativa_b: str
    alternativa_c: str
    alternativa_d: str
    alternativa_e: str
    resposta_correta: RespostaCorreta
    texto_alternativa_correta: str
    dica: Optional[str] = None
    fonte_bibliografica: Optional[str] = None
    
    # NOVOS CAMPOS ADICIONADOS
    ano_questao: Optional[int] = None
    banca: Optional[str] = None
    
    @validator('tema_principal', 'subtopico', 'enunciado', 'tipo_questao', 'nivel_escolar')
    def validate_required_fields(cls, v):
        if not v or not v.strip():
            raise ValueError('Este campo é obrigatório e não pode estar vazio')
        return v.strip()
    
    @validator('alternativa_a', 'alternativa_b', 'alternativa_c', 'alternativa_d', 'alternativa_e', 'texto_alternativa_correta')
    def validate_alternatives(cls, v):
        if not v or not v.strip():
            raise ValueError('Todas as alternativas são obrigatórias')
        return v.strip()

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    tema_principal: Optional[str] = None
    subtopico: Optional[str] = None
    enunciado: Optional[str] = None
    tipo_questao: Optional[str] = None
    url_imagem: Optional[str] = None
    descricao_imagem: Optional[str] = None
    fonte_imagem: Optional[str] = None
    nivel_escolar: Optional[str] = None
    alternativa_a: Optional[str] = None
    alternativa_b: Optional[str] = None
    alternativa_c: Optional[str] = None
    alternativa_d: Optional[str] = None
    alternativa_e: Optional[str] = None
    resposta_correta: Optional[RespostaCorreta] = None
    texto_alternativa_correta: Optional[str] = None
    dica: Optional[str] = None
    fonte_bibliografica: Optional[str] = None
    status: Optional[QuestionStatus] = None
    
    # NOVOS CAMPOS ADICIONADOS
    ano_questao: Optional[int] = None
    banca: Optional[str] = None

class Question(QuestionBase):
    id: int
    user_id: int
    data_cadastro: date
    status: QuestionStatus
    created_at: datetime
    updated_at: datetime
    user: User
    
    # NOVOS CAMPOS INCLUÍDOS NA RESPOSTA
    ano_questao: Optional[int] = None
    banca: Optional[str] = None
    
    class Config:
        from_attributes = True

class QuestionList(BaseModel):
    id: int
    tema_principal: str
    subtopico: str
    enunciado: str
    nivel_escolar: str
    status: QuestionStatus
    created_at: datetime
    user: User
    ano_questao: Optional[int] = None
    banca: Optional[str] = None
    url_imagem: Optional[str] = None
    descricao_imagem: Optional[str] = None
    fonte_imagem: Optional[str] = None
    ano_questao: Optional[int] = None
    banca: Optional[str] = None

    class Config:
        from_attributes = True

# Schemas para autenticação
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str