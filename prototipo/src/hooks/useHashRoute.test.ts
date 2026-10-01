import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lerHash, limparParamsHash, useHashRoute } from './useHashRoute'

describe('lerHash', () => {
  it('vazio ou #/ é a página do modelo', () => {
    expect(lerHash('').rota).toBe('modelo')
    expect(lerHash('#/').rota).toBe('modelo')
  })

  it('reconhece a tela do assinante', () => {
    expect(lerHash('#/assinante').rota).toBe('assinante')
  })

  it('lê parâmetros depois do ? dentro do hash', () => {
    const { rota, params } = lerHash('#/?teste=1')
    expect(rota).toBe('modelo')
    expect(params.get('teste')).toBe('1')
  })

  it('hash desconhecido cai na página do modelo', () => {
    expect(lerHash('#avaliacoes').rota).toBe('modelo')
  })
})

describe('useHashRoute', () => {
  it('reage a hashchange', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current.rota).toBe('modelo')
    act(() => {
      window.location.hash = '#/assinante'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current.rota).toBe('assinante')
  })
})

describe('limparParamsHash', () => {
  it('remove os parâmetros mantendo a rota e a query de modo', () => {
    window.history.replaceState(null, '', '/?modo=proposta#/?teste=1')
    limparParamsHash()
    expect(window.location.hash).toBe('#/')
    expect(window.location.search).toBe('?modo=proposta')
  })
})
