import { describe, expect, it } from 'vitest'
import {
  arredondarCentavos,
  custoKmCombustao,
  custoKmEletrico,
  economiaEnergiaMensal,
  economiaLiquidaMensal,
  gastoEnergiaMensal,
} from './economia'

describe('economia', () => {
  it('arredonda a centavos', () => {
    expect(arredondarCentavos(0.8 / 6)).toBe(0.13)
    expect(arredondarCentavos(1 / 6)).toBe(0.17)
    expect(arredondarCentavos(2 / 6)).toBe(0.33)
  })

  it('reproduz o exemplo do .md: R$ 240 de economia líquida', () => {
    const comb = custoKmCombustao(6, 12)
    const elet = custoKmEletrico(0.8, 6)
    expect(comb).toBe(0.5)
    expect(elet).toBe(0.13)
    expect(gastoEnergiaMensal(2000, comb)).toBe(1000)
    expect(gastoEnergiaMensal(2000, elet)).toBe(260)
    expect(economiaEnergiaMensal(2000, comb, elet)).toBe(740)
    expect(economiaLiquidaMensal(2000, comb, elet, 500)).toBe(240)
  })

  it('economia líquida fica negativa com recarga pública', () => {
    const comb = custoKmCombustao(6, 12)
    const elet = custoKmEletrico(2, 6)
    expect(economiaLiquidaMensal(2000, comb, elet, 500)).toBe(-160)
  })

  it('rejeita rendimento zero, negativo ou NaN', () => {
    expect(() => custoKmCombustao(6, 0)).toThrow(RangeError)
    expect(() => custoKmEletrico(0.8, -1)).toThrow(RangeError)
    expect(() => custoKmCombustao(6, Number.NaN)).toThrow(RangeError)
  })
})
