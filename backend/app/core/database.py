import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Usar DATABASE_URL do Railway ou construir URL local
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    # Fallback para desenvolvimento local
    "postgresql://admin:admin123@localhost:5432/geografia_db"
)

# Se a URL vier do Railway, pode ter 'postgres://' que precisa ser 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()