import { describe, expect, it } from 'vitest'
import {
  formatarData,
  formatarNota,
  formatarNumero,
  formatarPct,
  formatarReais,
  formatarReaisCentavos,
  formatarReaisComSinal,
} from './formato'

describe('formato', () => {
  it('formata números inteiros com separador de milhar', () => {
    expect(formatarNumero(2000)).toBe('2.000')
    expect(formatarNumero(739.6)).toBe('740')
  })

  it('formata reais sem centavos', () => {
    expect(formatarReais(740)).toBe('R$ 740')
    expect(formatarReais(8880)).toBe('R$ 8.880')
    expect(formatarReais(-160)).toBe('−R$ 160')
  })

  it('formata reais com sinal', () => {
    expect(formatarReaisComSinal(-740)).toBe('−R$ 740')
    expect(formatarReaisComSinal(500)).toBe('+R$ 500')
    expect(formatarReaisComSinal(0)).toBe('R$ 0')
  })

  it('formata reais com centavos', () => {
    expect(formatarReaisCentavos(0.8)).toBe('R$ 0,80')
    expect(formatarReaisCentavos(6)).toBe('R$ 6,00')
  })

  it('formata nota com uma casa e vírgula', () => {
    expect(formatarNota(4.6)).toBe('4,6')
    expect(formatarNota(5)).toBe('5,0')
  })

  it('formata porcentagem arredondando para baixo', () => {
    expect(formatarPct(362 / 365)).toBe('99%')
    expect(formatarPct(336 / 365)).toBe('92%')
    expect(formatarPct(0.95)).toBe('95%')
  })

  it('formata data ISO sem depender de fuso', () => {
    expect(formatarData('2026-09-12')).toBe('12/09/2026')
  })
})
