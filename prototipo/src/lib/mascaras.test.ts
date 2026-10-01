import { describe, expect, it } from 'vitest'
import { mascaraCep, mascaraDocumento, mascaraTelefone, somenteDigitos } from './mascaras'

describe('máscaras', () => {
  it('extrai só dígitos', () => {
    expect(somenteDigitos('(41) 9a9-9')).toBe('41999')
  })

  it('telefone', () => {
    expect(mascaraTelefone('')).toBe('')
    expect(mascaraTelefone('4')).toBe('(4')
    expect(mascaraTelefone('41')).toBe('(41')
    expect(mascaraTelefone('419')).toBe('(41) 9')
    expect(mascaraTelefone('41 9999')).toBe('(41) 9999')
    expect(mascaraTelefone('41999998888')).toBe('(41) 99999-8888')
    expect(mascaraTelefone('419999988889999')).toBe('(41) 99999-8888')
    expect(mascaraTelefone('abc')).toBe('')
  })

  it('CPF até 11 dígitos', () => {
    expect(mascaraDocumento('123')).toBe('123')
    expect(mascaraDocumento('1234')).toBe('123.4')
    expect(mascaraDocumento('12345678901')).toBe('123.456.789-01')
    expect(mascaraDocumento('123.456.789-01abc')).toBe('123.456.789-01')
  })

  it('CNPJ de 12 a 14 dígitos e limite de 14', () => {
    expect(mascaraDocumento('123456789012')).toBe('12.345.678/9012')
    expect(mascaraDocumento('12345678000199')).toBe('12.345.678/0001-99')
    expect(mascaraDocumento('12345678000199123456')).toBe('12.345.678/0001-99')
  })

  it('CEP', () => {
    expect(mascaraCep('800')).toBe('800')
    expect(mascaraCep('80000000')).toBe('80000-000')
    expect(mascaraCep('80000-0001234')).toBe('80000-000')
  })
})
