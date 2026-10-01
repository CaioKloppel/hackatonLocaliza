import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Modo = 'atual' | 'proposta'

export function lerModo(search: string): Modo {
  return new URLSearchParams(search).get('modo') === 'atual' ? 'atual' : 'proposta'
}

interface ValorModo {
  modo: Modo
  setModo: (m: Modo) => void
}

const ModoCtx = createContext<ValorModo | null>(null)

export function ModoProvider({ children }: { children: ReactNode }) {
  const [modo, setModoEstado] = useState<Modo>(() => lerModo(window.location.search))

  const setModo = useCallback((m: Modo) => {
    setModoEstado(m)
    const url = new URL(window.location.href)
    url.searchParams.set('modo', m)
    window.history.replaceState(null, '', url)
  }, [])

  const valor = useMemo(() => ({ modo, setModo }), [modo, setModo])
  return <ModoCtx.Provider value={valor}>{children}</ModoCtx.Provider>
}

export function useModo(): ValorModo {
  const ctx = useContext(ModoCtx)
  if (!ctx) throw new Error('useModo precisa estar dentro de ModoProvider')
  return ctx
}
