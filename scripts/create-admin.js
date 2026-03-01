/**
 * Script para criar um novo administrador.
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env (obtenha em Supabase > Settings > API)
 *
 * Uso: node scripts/create-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env')
    const content = readFileSync(envPath, 'utf-8')
    const env = {}
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
    }
    return env
  } catch {
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/$/, '') || process.env.VITE_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Erro: Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  console.error('Obtenha a chave em: Supabase Dashboard > Settings > API > service_role')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

const nome = 'TC Rodrigo Pedroso'
const email = 'cfsol8bis@eb.mail.br'
const password = 'CMTCFSOL2026'

async function main() {
  try {
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message?.includes('already been registered')) {
        console.log('Usuário já existe em auth.users. Inserindo na tabela administrador...')
        const { data: existing } = await supabase.auth.admin.listUsers()
        const existingUser = existing?.users?.find((u) => u.email === email)
        if (!existingUser) {
          console.error('Não foi possível encontrar o usuário existente.')
          process.exit(1)
        }
        await insertAdmin(existingUser.id)
        console.log('Perfil de administrador vinculado com sucesso.')
        return
      }
      throw authError
    }

    await insertAdmin(userData.user.id)
    console.log('Administrador criado com sucesso!')
    console.log('Email:', email)
    console.log('Senha:', password)
  } catch (err) {
    console.error('Erro:', err.message)
    process.exit(1)
  }
}

async function insertAdmin(authUserId) {
  const { error } = await supabase.from('administrador').insert({
    nome,
    email,
    auth_user_id: authUserId,
    senha: '',
  })

  if (error) {
    if (error.code === '23505') {
      console.log('Administrador já existe na tabela. Tudo certo.')
      return
    }
    throw error
  }
}

main()
