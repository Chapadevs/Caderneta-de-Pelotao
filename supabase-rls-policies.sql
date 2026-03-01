-- Políticas RLS para permitir registro de administrador e comandante
-- Execute no Supabase SQL Editor

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Usuario pode inserir próprio perfil admin" ON administrador;
DROP POLICY IF EXISTS "Usuario pode ler próprio perfil admin" ON administrador;
DROP POLICY IF EXISTS "Usuario pode inserir próprio perfil comandante" ON comandante;
DROP POLICY IF EXISTS "Usuario pode ler próprio perfil comandante" ON comandante;
DROP POLICY IF EXISTS "comandante_update_own" ON comandante;

-- ADMINISTRADOR: inserir quando auth_user_id = usuário logado
CREATE POLICY "admin_insert_own" ON administrador
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- ADMINISTRADOR: ler próprio perfil
CREATE POLICY "admin_select_own" ON administrador
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- ADMINISTRADOR: atualizar próprio perfil
CREATE POLICY "admin_update_own" ON administrador
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- COMANDANTE: inserir quando auth_user_id = usuário logado
CREATE POLICY "comandante_insert_own" ON comandante
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- COMANDANTE: ler próprio perfil
CREATE POLICY "comandante_select_own" ON comandante
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- COMANDANTE: ler todos (admin precisa listar comandantes)
CREATE POLICY "comandante_select_all" ON comandante
  FOR SELECT TO authenticated
  USING (true);

-- COMANDANTE: atualizar e excluir (admin gerencia comandantes)
CREATE POLICY "comandante_update" ON comandante
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "comandante_delete" ON comandante
  FOR DELETE TO authenticated USING (true);

-- PELOTAO: permitir todas operações para autenticados
ALTER TABLE pelotao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pelotao_all" ON pelotao;
CREATE POLICY "pelotao_all" ON pelotao FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- MILITAR: permitir todas operações para autenticados
ALTER TABLE militar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "militar_all" ON militar;
CREATE POLICY "militar_all" ON militar FOR ALL TO authenticated USING (true) WITH CHECK (true);
