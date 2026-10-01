import { describe, expect, it } from 'vitest'
import { normalizar } from './texto'

describe('normalizar', () => {
  it('remove acentos e deixa minúsculo', () => {
    expect(normalizar('Autonomia ELÉTRICA')).toBe('autonomia eletrica')
    expect(normalizar('Câmbio')).toBe('cambio')
  })
})
