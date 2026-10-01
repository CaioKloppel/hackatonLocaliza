import { describe, expect, it } from 'vitest'
import { custoKmCombustao, custoKmEletrico } from '../lib/economia'
import { kmDiarios } from './assinante'
import { EFICIENCIA_DOLPHIN, fatosFrota, PRECO_GASOLINA, tarifas } from './telemetria'

describe('dados de telemetria', () => {
  it('km diários têm as propriedades da spec', () => {
    expect(kmDiarios).toHaveLength(365)
    expect(Math.max(...kmDiarios)).toBe(310)
    expect(kmDiarios.filter((km) => km > 290)).toHaveLength(3)
    expect(kmDiarios.filter((km) => km > 190)).toHaveLength(29)
    const soma = kmDiarios.reduce((a, b) => a + b, 0)
    expect(soma).toBeGreaterThan(23900)
    expect(soma).toBeLessThan(24100)
  })

  it('redução de custo por km é coerente com as premissas', () => {
    const comb = custoKmCombustao(PRECO_GASOLINA, 12)
    const elet = custoKmEletrico(tarifas.casa, EFICIENCIA_DOLPHIN)
    expect(Math.round((1 - elet / comb) * 100)).toBe(fatosFrota.reducaoCustoKmPct)
  })
})
