import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { lerModo, ModoProvider, useModo } from './ModoContext'

const wrapper = ({ children }: { children: ReactNode }) => <ModoProvider>{children}</ModoProvider>

describe('modo', () => {
  it('padrão é proposta; ?modo=atual abre no modo atual', () => {
    expect(lerModo('')).toBe('proposta')
    expect(lerModo('?modo=xyz')).toBe('proposta')
    expect(lerModo('?modo=atual')).toBe('atual')
  })

  it('setModo atualiza o estado e a query string sem perder o hash', () => {
    window.history.replaceState(null, '', '/#/assinante')
    const { result } = renderHook(() => useModo(), { wrapper })
    expect(result.current.modo).toBe('proposta')
    act(() => result.current.setModo('atual'))
    expect(result.current.modo).toBe('atual')
    expect(window.location.search).toBe('?modo=atual')
    expect(window.location.hash).toBe('#/assinante')
  })
})
