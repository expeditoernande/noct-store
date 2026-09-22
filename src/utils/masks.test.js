import { describe, it, expect } from 'vitest'
import { maskCPF, maskPhone, maskCEP } from './masks'

describe('máscara de CPF', () => {
  it('formata 000.000.000-00', () => {
    expect(maskCPF('52998224725')).toBe('529.982.247-25')
  })

  it('formata progressivamente enquanto digita', () => {
    expect(maskCPF('529')).toBe('529')
    expect(maskCPF('5299')).toBe('529.9')
    expect(maskCPF('5299822')).toBe('529.982.2')
    expect(maskCPF('5299822472500')).toBe('529.982.247-25')
  })

  it('ignora caracteres não numéricos', () => {
    expect(maskCPF('529.982.247-25')).toBe('529.982.247-25')
  })
})

describe('máscara de telefone', () => {
  it('formata celular com 11 dígitos', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formata fixo com 10 dígitos', () => {
    expect(maskPhone('1123456789')).toBe('(11) 2345-6789')
  })

  it('formata progressivamente', () => {
    expect(maskPhone('11')).toBe('11')
    expect(maskPhone('119')).toBe('(11) 9')
    expect(maskPhone('119876')).toBe('(11) 9876')
  })
})

describe('máscara de CEP', () => {
  it('adiciona o hífen sozinho a partir do 6º dígito', () => {
    expect(maskCEP('01310')).toBe('01310')
    expect(maskCEP('0131010')).toBe('01310-10')
    expect(maskCEP('01310100')).toBe('01310-100')
  })

  it('limita a 8 dígitos', () => {
    expect(maskCEP('0131010000')).toBe('01310-100')
  })
})