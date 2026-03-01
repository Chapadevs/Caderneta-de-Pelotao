-- Corrige a coluna endereco para aceitar endereços com letras (ex: "Rua das Flores")
-- Execute no Supabase SQL Editor se endereços com letras estiverem sendo rejeitados

-- Altera endereco para TEXT se estiver como INTEGER ou tipo numérico
ALTER TABLE militar 
ALTER COLUMN endereco TYPE TEXT 
USING CASE 
  WHEN endereco IS NULL THEN NULL 
  ELSE endereco::TEXT 
END;
