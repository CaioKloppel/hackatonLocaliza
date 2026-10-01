import { describe, expect, it } from 'vitest'
import { validarOrcamento, type DadosOrcamento } from './validacao'

const valido: DadosOrcamento = {
  periodo: '48 Meses',
  franquia: '500 Km',
  nome: 'Ana',
  email: 'ana@exemplo.com',
  telefone: '(41) 99999-8888',
  documento: '123.456.789-01',
  cep: '80000-000',
  whatsapp: false,
  marketing: false,
}

describe('validarOrcamento', () => {
  it('aceita dados válidos (CPF ou CNPJ)', () => {
    expect(validarOrcamento(valido)).toEqual({})
    expect(validarOrcamento({ ...valido, documento: '12.345.678/0001-99' })).toEqual({})
  })

  it('rejeita nome só com espaços ou curto', () => {
    expect(validarOrcamento({ ...valido, nome: '   ' }).nome).toBeDefined()
    expect(validarOrcamento({ ...valido, nome: 'A' }).nome).toBeDefined()
  })

  it('rejeita e-mail sem domínio', () => {
    expect(validarOrcamento({ ...valido, email: 'ana@' }).email).toBeDefined()
    expect(validarOrcamento({ ...valido, email: 'ana@exemplo' }).email).toBeDefined()
  })

  it('rejeita telefone com 10 dígitos', () => {
    expect(validarOrcamento({ ...valido, telefone: '(41) 9999-888' }).telefone).toBeDefined()
  })

  it('rejeita documento com 12 dígitos e CEP incompleto', () => {
    const erros = validarOrcamento({ ...valido, documento: '12.345.678/9012', cep: '8000' })
    expect(erros.documento).toBeDefined()
    expect(erros.cep).toBeDefined()
  })
})
