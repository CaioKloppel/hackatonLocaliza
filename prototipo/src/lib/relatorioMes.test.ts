import { describe, expect, it } from 'vitest'
import { diasDeTeste } from '../data/mesDeTeste'
import { PRECO_GASOLINA, tarifas } from '../data/telemetria'
import { consolidarMes, type DiaDeUso } from './relatorioMes'

const opcoes = { autonomiaKm: 290, tarifas, precoGasolina: PRECO_GASOLINA, kmPorLitro: 12 }

describe('consolidarMes', () => {
  it('soma km, média e o dia de maior uso', () => {
    const r = consolidarMes(diasDeTeste, opcoes)
    expect(r.dias).toBe(25)
    expect(r.kmTotal).toBe(1212)
    expect(r.kmMediaDia).toBe(48)
    expect(r.diaMaiorUso).toEqual({ dia: 13, km: 210 })
  })

  it('conta recargas por local', () => {
    const r = consolidarMes(diasDeTeste, opcoes)
    expect(r.recargas).toEqual({ casa: 6, trabalho: 2, rua: 1 })
    expect(r.totalRecargas).toBe(9)
  })

  it('autonomia sobrou em todos os dias e registra a menor carga', () => {
    const r = consolidarMes(diasDeTeste, opcoes)
    expect(r.diasAcimaAutonomia).toEqual([])
    expect(r.menorCarga).toEqual({ dia: 13, pct: 31 })
  })

  it('compara energia (por local de recarga) com gasolina', () => {
    const r = consolidarMes(diasDeTeste, opcoes)
    expect(r.gastoEnergia).toBe(191)
    expect(r.gastoCombustivel).toBe(606)
    expect(r.economia).toBe(415)
    expect(r.economiaProjetada30).toBe(498)
  })

  it('lista os dias que passaram da autonomia', () => {
    const dias: DiaDeUso[] = [
      { dia: 1, km: 100, menorCargaPct: 60 },
      { dia: 2, km: 320, menorCargaPct: 5, recarga: { local: 'rua', kWh: 30 } },
      { dia: 3, km: 300, menorCargaPct: 8 },
    ]
    expect(consolidarMes(dias, opcoes).diasAcimaAutonomia).toEqual([2, 3])
  })

  it('rejeita mês sem dias', () => {
    expect(() => consolidarMes([], opcoes)).toThrow(RangeError)
  })
})
