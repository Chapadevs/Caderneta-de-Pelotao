/**
 * Funções de validação reutilizáveis para formulários
 */

export function isRequired(value, fieldName) {
  const trimmed = typeof value === 'string' ? value.trim() : value
  if (!trimmed) return `${fieldName} é obrigatório.`
  return null
}

export function minLength(value, min, fieldName) {
  if (!value) return null
  if (value.length < min) return `${fieldName} deve ter no mínimo ${min} caracteres.`
  return null
}

export function isValidEmail(email) {
  if (!email?.trim()) return 'Email é obrigatório.'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email.trim())) return 'Informe um email válido.'
  return null
}

export function validateLogin({ email, password }) {
  const errors = {}
  const emailErr = isValidEmail(email)
  if (emailErr) errors.email = emailErr
  const pwdErr = isRequired(password, 'Senha')
  if (pwdErr) errors.password = pwdErr
  return Object.keys(errors).length ? errors : null
}

export function validateRegister({ nome, email, password, role, idPelotao, pelotoes }) {
  const errors = {}
  const nomeErr = isRequired(nome, 'Nome completo')
  if (nomeErr) errors.nome = nomeErr
  const emailErr = isValidEmail(email)
  if (emailErr) errors.email = emailErr
  const pwdErr = isRequired(password, 'Senha')
  if (pwdErr) errors.password = pwdErr
  else {
    const pwdMinErr = minLength(password, 6, 'Senha')
    if (pwdMinErr) errors.password = pwdMinErr
  }
  if (role === 'comandante') {
    if (!idPelotao?.trim()) errors.idPelotao = 'Selecione um pelotão.'
    else if (pelotoes?.length === 0) errors.idPelotao = 'Nenhum pelotão cadastrado. Registre-se como Administrador primeiro.'
  }
  return Object.keys(errors).length ? errors : null
}

export function validateMilitar({ nome }) {
  const errors = {}
  const nomeErr = isRequired(nome, 'Nome')
  if (nomeErr) errors.nome = nomeErr
  return Object.keys(errors).length ? errors : null
}

export function validatePelotao({ nome }) {
  const errors = {}
  const nomeErr = isRequired(nome, 'Nome do pelotão')
  if (nomeErr) errors.nome = nomeErr
  return Object.keys(errors).length ? errors : null
}

export function validateComandante({ nome, email, password, idPelotao }) {
  const errors = {}
  const nomeErr = isRequired(nome, 'Nome')
  if (nomeErr) errors.nome = nomeErr
  const emailErr = isValidEmail(email)
  if (emailErr) errors.email = emailErr
  const pwdErr = isRequired(password, 'Senha')
  if (pwdErr) errors.password = pwdErr
  else {
    const pwdMinErr = minLength(password, 6, 'Senha')
    if (pwdMinErr) errors.password = pwdMinErr
  }
  if (!idPelotao?.trim()) errors.idPelotao = 'Selecione um pelotão.'
  return Object.keys(errors).length ? errors : null
}

export function validateEditarPerfil({ nome, password }) {
  const errors = {}
  const nomeErr = isRequired(nome, 'Nome')
  if (nomeErr) errors.nome = nomeErr
  if (password && password.length > 0 && password.length < 6) {
    errors.password = 'A senha deve ter no mínimo 6 caracteres.'
  }
  return Object.keys(errors).length ? errors : null
}
