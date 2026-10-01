import { describe, expect, it } from 'vitest'
import { clienteTelemetria } from '../data/assinante'
import { modelosEletricos, tarifas } from '../data/telemetria'
import { cobertura, recomendar, type PerfilRecarga } from './recomendacao'

function avaliacaoDe(id: string, perfil: PerfilRecarga, margem?: number) {
  const r = recomendar(clienteTelemetria, perfil, modelosEletricos, tarifas, margem)
  return r.avaliados.find((a) => a.modelo.id === id)!
}

describe('cobertura', () => {
  it('é a fração de dias dentro da autonomia', () => {
    expect(cobertura([100, 200, 300, 400], 250)).toBe(0.5)
    expect(cobertura([], 250)).toBe(0)
  })

  it('Dolphin cobre ~99% e Mini ~92% dos dias do cliente', () => {
    expect(cobertura(clienteTelemetria.kmDiarios, 290)).toBeGreaterThanOrEqual(0.99)
    expect(cobertura(clienteTelemetria.kmDiarios, 190)).toBeCloseTo(336 / 365, 5)
  })
})

describe('recomendar', () => {
  it('recarga em casa: recomenda o Dolphin com R$ 240', () => {
    const r = recomendar(clienteTelemetria, 'casa', modelosEletricos, tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin')
    expect(r.recomendado?.economiaLiquida).toBe(240)
    expect(r.custoKmCombustao).toBe(0.5)
    expect(r.avaliados).toHaveLength(4)
  })

  it('recarga no trabalho: recomenda o Dolphin com R$ 160', () => {
    const r = recomendar(clienteTelemetria, 'trabalho', modelosEletricos, tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin')
    expect(r.recomendado?.economiaLiquida).toBe(160)
  })

  it('só recarga na rua: nenhuma recomendação', () => {
    const r = recomendar(clienteTelemetria, 'rua', modelosEletricos, tarifas)
    expect(r.recomendado).toBeNull()
    expect(avaliacaoDe('dolphin', 'rua').motivosExclusao).toEqual([
      'A economia com energia não cobre a diferença de mensalidade',
    ])
  })

  it('Dolphin Mini é excluído por cobertura e por categoria', () => {
    expect(avaliacaoDe('dolphin-mini', 'casa').motivosExclusao).toEqual([
      'Cobre só 92% dos seus dias (mínimo 95%)',
      'Categoria inferior ao seu carro atual',
    ])
  })

  it('Geely EX5 é excluído por economia negativa', () => {
    const ex5 = avaliacaoDe('geely-ex5', 'casa')
    expect(ex5.cobertura).toBe(1)
    expect(ex5.economiaLiquida).toBe(-520)
    expect(ex5.motivosExclusao).toEqual(['A economia com energia não cobre a diferença de mensalidade'])
  })

  it('economia positiva abaixo da margem exclui o modelo', () => {
    expect(avaliacaoDe('dolphin', 'trabalho').motivosExclusao).toEqual([])
    expect(avaliacaoDe('dolphin', 'trabalho', 200).motivosExclusao).toEqual([
      'Economia abaixo da margem de segurança',
    ])
  })

  it('entre elegíveis, escolhe a maior economia', () => {
    const outro = { ...modelosEletricos[2], id: 'dolphin-b', nome: 'Dolphin B', deltaMensalidade: 400 }
    const r = recomendar(clienteTelemetria, 'casa', [...modelosEletricos, outro], tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin-b')
    expect(r.recomendado?.economiaLiquida).toBe(340)
  })
})
