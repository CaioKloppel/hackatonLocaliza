import { describe, expect, it } from 'vitest'
import { avaliacoes } from '../data/avaliacoes'
import {
  alternarFiltro,
  FILTROS_VAZIOS,
  filtrarAvaliacoes,
  ordenarRecentes,
  temFiltroAtivo,
} from './filtroAvaliacoes'

describe('filtroAvaliacoes', () => {
  it('sem filtros retorna tudo', () => {
    expect(filtrarAvaliacoes(avaliacoes, FILTROS_VAZIOS)).toHaveLength(10)
    expect(temFiltroAtivo(FILTROS_VAZIOS)).toBe(false)
  })

  it('OU dentro do grupo', () => {
    const r = filtrarAvaliacoes(avaliacoes, { ...FILTROS_VAZIOS, recarga: ['casa', 'trabalho'] })
    expect(r.every((a) => a.recarga === 'casa' || a.recarga === 'trabalho')).toBe(true)
    expect(r).toHaveLength(7)
  })

  it('E entre grupos', () => {
    const r = filtrarAvaliacoes(avaliacoes, { uso: ['estrada'], recarga: ['casa'], tipo: [] })
    expect(r.map((a) => a.id).sort()).toEqual(['a10', 'a8'])
  })

  it('combinação sem resultado retorna vazio', () => {
    expect(filtrarAvaliacoes(avaliacoes, { uso: [], recarga: ['rua'], tipo: ['teste'] })).toEqual([])
  })

  it('alternarFiltro liga e desliga', () => {
    const ligado = alternarFiltro(FILTROS_VAZIOS, 'tipo', 'teste')
    expect(ligado.tipo).toEqual(['teste'])
    expect(temFiltroAtivo(ligado)).toBe(true)
    expect(alternarFiltro(ligado, 'tipo', 'teste').tipo).toEqual([])
    expect(FILTROS_VAZIOS.tipo).toEqual([])
  })

  it('ordena da mais recente para a mais antiga', () => {
    const datas = ordenarRecentes(avaliacoes).map((a) => a.data)
    expect(datas[0]).toBe('2026-09-25')
    expect(datas[datas.length - 1]).toBe('2026-06-18')
  })
})
