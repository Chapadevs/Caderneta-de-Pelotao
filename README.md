# Caderneta do Comandante de Pelotão

Sistema de gestão militar para o Exército Brasileiro. Permite que comandantes de pelotão gerenciem seus efetivos e que administradores gerenciem pelotões e comandantes.

## Tecnologias

- **Frontend:** Vite, React, TailwindCSS, React Router
- **Backend:** Supabase (Auth + SQL)

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz com suas credenciais Supabase:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

3. Execute o projeto:

```bash
npm run dev
```

## Schema Supabase

As tabelas `administrador` e `comandante` devem ter a coluna `auth_user_id UUID REFERENCES auth.users(id)` para integração com Supabase Auth.

**Primeira configuração:** Execute o script `supabase-migration.sql` no Supabase:
1. Abra o **Supabase Dashboard** → **SQL Editor** → **New query**
2. Copie o conteúdo de `supabase-migration.sql` e execute

## Criando o primeiro administrador

O login usa **Supabase Auth** (`auth.users`), não as tabelas `administrador`/`comandante` diretamente. Se você criou um admin apenas na tabela `administrador`, o login falhará com "Invalid login credentials".

**Opção 1 – Usar a página de Registro (recomendado)**  
Acesse `/registro`, escolha "Administrador", preencha os dados e clique em Registrar. Isso cria o usuário em `auth.users` e o perfil em `administrador`.

**Opção 2 – Criar pelo painel do Supabase**  
1. Supabase → **Authentication** → **Users** → **Add user**  
2. Informe email e senha, marque **Auto Confirm User**  
3. Copie o **UUID** do usuário criado  
4. **Table Editor** → tabela `administrador` → **Insert row**  
5. Preencha: `nome`, `email`, `auth_user_id` (UUID copiado)  
6. Faça login no app com o mesmo email e senha usados no passo 1

## Deploy (GitHub Pages)

1. Adicione os secrets no repositório: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
2. Em Settings > Pages, configure a fonte como "GitHub Actions"
3. O workflow `.github/workflows/deploy.yml` fará o deploy em cada push na branch `main`

A aplicação estará disponível em: `https://seu-usuario.github.io/Caderneta-de-Pelotao/`
