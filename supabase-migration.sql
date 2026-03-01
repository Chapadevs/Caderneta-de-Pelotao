-- Execute este script no Supabase SQL Editor para adicionar suporte ao Supabase Auth
-- Supabase Dashboard > SQL Editor > New query > Cole e execute

-- 1. Adicionar coluna auth_user_id na tabela administrador
ALTER TABLE administrador
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- 2. Adicionar coluna auth_user_id na tabela comandante
ALTER TABLE comandante
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- 3. (Opcional) Criar índices para buscas mais rápidas
CREATE INDEX IF NOT EXISTS idx_administrador_auth_user_id ON administrador(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_comandante_auth_user_id ON comandante(auth_user_id);
