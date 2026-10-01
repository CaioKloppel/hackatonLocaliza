import { describe, expect, it } from 'vitest'
import { avaliacoes, resumoAvaliacoes } from './avaliacoes'

describe('dados de avaliações', () => {
  it('distribuição soma o total e a média bate com 4,6', () => {
    const { distribuicao, total, media } = resumoAvaliacoes
    const qtd = distribuicao.reduce((s, d) => s + d.qtd, 0)
    const soma = distribuicao.reduce((s, d) => s + d.estrelas * d.qtd, 0)
    expect(qtd).toBe(total)
    expect(Math.round((soma / qtd) * 10) / 10).toBe(media)
  })

  it('cobre todos os tipos e tem negativas com resposta', () => {
    expect(new Set(avaliacoes.map((a) => a.tipo))).toEqual(new Set(['assinante', 'teste', 'aluguel']))
    const negativas = avaliacoes.filter((a) => a.nota <= 3)
    expect(negativas.length).toBeGreaterThanOrEqual(2)
    expect(negativas.every((a) => a.resposta)).toBe(true)
    expect(new Set(avaliacoes.map((a) => a.id)).size).toBe(avaliacoes.length)
  })
})
