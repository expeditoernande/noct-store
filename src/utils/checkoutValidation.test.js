import { describe, it, expect } from 'vitest'
import { validateStepErrors, isStepValid } from './checkoutValidation'

const validPersonal = {
  nome: 'Ana Lima',
  email: 'ana@email.com',
  cpf: '123.456.789-09',
  telefone: '11 98765-4321',
}

const validAddress = {
  cep: '01001-000',
  rua: 'Rua Principal',
  numero: '120',
  bairro: 'Centro',
  cidade: 'São Paulo',
  uf: 'SP',
}

function form(overrides = {}) {
  return { ...validPersonal, ...validAddress, ...overrides }
}

describe('validação da etapa Dados pessoais (step 0)', () => {
  it('aceita dados preenchidos corretamente', () => {
    expect(validateStepErrors(0, form())).toEqual({})
    expect(isStepValid(0, form())).toBe(true)
  })

  it('acusa nome em branco', () => {
    const errors = validateStepErrors(0, form({ nome: '   ' }))
    expect(errors.nome).toBe('Informe seu nome completo.')
  })

  it('acusa e-mail inválido', () => {
    const errors = validateStepErrors(0, form({ email: 'ana@' }))
    expect(errors.email).toBe('Informe um e-mail válido.')
  })

  it('acusa CPF sem 11 dígitos', () => {
    const errors = validateStepErrors(0, form({ cpf: '123.456.789-0' }))
    expect(errors.cpf).toBe('Informe um CPF com 11 dígitos.')
  })

  it('acusa telefone com menos de 10 dígitos', () => {
    const errors = validateStepErrors(0, form({ telefone: '119999' }))
    expect(errors.telefone).toBe('Informe um telefone válido.')
  })

  it('retorna vários erros ao mesmo tempo', () => {
    const errors = validateStepErrors(0, form({ nome: '', email: 'x', cpf: '', telefone: '' }))
    expect(Object.keys(errors).sort()).toEqual(['cpf', 'email', 'nome', 'telefone'])
    expect(isStepValid(0, form({ nome: '', email: 'x', cpf: '', telefone: '' }))).toBe(false)
  })
})

describe('validação da etapa Endereço (step 1)', () => {
  it('aceita endereço preenchido corretamente', () => {
    expect(validateStepErrors(1, form())).toEqual({})
    expect(isStepValid(1, form())).toBe(true)
  })

  it('acusa CEP sem 8 dígitos', () => {
    const errors = validateStepErrors(1, form({ cep: '01001-00' }))
    expect(errors.cep).toBe('Informe um CEP com 8 dígitos.')
  })

  it('acusa rua e número em branco', () => {
    const errors = validateStepErrors(1, form({ rua: '', numero: '', bairro: '', cidade: '' }))
    expect(errors.rua).toBe('Informe a rua ou avenida.')
    expect(errors.numero).toBe('Informe o número.')
    expect(errors.bairro).toBe('Informe o bairro.')
    expect(errors.cidade).toBe('Informe a cidade.')
  })

  it('acusa UF sem exatamente 2 letras', () => {
    const errors = validateStepErrors(1, form({ uf: 'SPA' }))
    expect(errors.uf).toBe('Informe a UF com 2 letras.')
  })
})

describe('etapas não dependem umas das outras', () => {
  it('step 0 só valida dados pessoais, mesmo com endereço vazio', () => {
    expect(
      validateStepErrors(0, {
        ...validPersonal,
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
      }),
    ).toEqual({})
  })

  it('step 1 só valida endereço, mesmo com dados pessoais vazios', () => {
    expect(
      validateStepErrors(1, {
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        ...validAddress,
      }),
    ).toEqual({})
  })
})