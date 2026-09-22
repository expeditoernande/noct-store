const digits = (value) => String(value ?? '').replace(/\D/g, '')

const FIELDS_STEP_PERSONAL = {
  nome: 'Informe seu nome completo.',
  email: 'Informe um e-mail válido.',
  cpf: 'Informe um CPF com 11 dígitos.',
  telefone: 'Informe um telefone válido.',
}

const FIELDS_STEP_ADDRESS = {
  cep: 'Informe um CEP com 8 dígitos.',
  rua: 'Informe a rua ou avenida.',
  numero: 'Informe o número.',
  bairro: 'Informe o bairro.',
  cidade: 'Informe a cidade.',
  uf: 'Informe a UF com 2 letras.',
}

export function validateStepErrors(step, form) {
  const nextErrors = {}

  if (step === 0) {
    if (!form.nome.trim()) nextErrors.nome = FIELDS_STEP_PERSONAL.nome
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = FIELDS_STEP_PERSONAL.email
    if (digits(form.cpf).length !== 11) nextErrors.cpf = FIELDS_STEP_PERSONAL.cpf
    if (digits(form.telefone).length < 10) nextErrors.telefone = FIELDS_STEP_PERSONAL.telefone
  }

  if (step === 1) {
    if (digits(form.cep).length !== 8) nextErrors.cep = FIELDS_STEP_ADDRESS.cep
    if (!form.rua.trim()) nextErrors.rua = FIELDS_STEP_ADDRESS.rua
    if (!form.numero.trim()) nextErrors.numero = FIELDS_STEP_ADDRESS.numero
    if (!form.bairro.trim()) nextErrors.bairro = FIELDS_STEP_ADDRESS.bairro
    if (!form.cidade.trim()) nextErrors.cidade = FIELDS_STEP_ADDRESS.cidade
    if (!/^[a-zA-Z]{2}$/.test(form.uf.trim())) nextErrors.uf = FIELDS_STEP_ADDRESS.uf
  }

  return nextErrors
}

export function isStepValid(step, form) {
  return Object.keys(validateStepErrors(step, form)).length === 0
}