-- Criação das tabelas para o sistema de questões de geografia

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de questões
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
    tema_principal VARCHAR(100) NOT NULL,
    subtopico VARCHAR(100) NOT NULL,
    enunciado TEXT NOT NULL,
    tipo_questao VARCHAR(50) NOT NULL,
    url_imagem VARCHAR(255),
    descricao_imagem TEXT,
    fonte_imagem VARCHAR(255),
    nivel_escolar VARCHAR(50) NOT NULL,
    alternativa_a TEXT NOT NULL,
    alternativa_b TEXT NOT NULL,
    alternativa_c TEXT NOT NULL,
    alternativa_d TEXT NOT NULL,
    alternativa_e TEXT NOT NULL,
    resposta_correta VARCHAR(1) NOT NULL CHECK (resposta_correta IN ('A', 'B', 'C', 'D', 'E')),
    texto_alternativa_correta TEXT NOT NULL,
    dica TEXT,
    fonte_bibliografica TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_tema_principal ON questions(tema_principal);
CREATE INDEX idx_questions_nivel_escolar ON questions(nivel_escolar);

-- Inserir usuário administrador padrão
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@legidepe.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtO5S5EM.S', 'admin');
-- Senha padrão: admin123 (deve ser alterada em produção)

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

