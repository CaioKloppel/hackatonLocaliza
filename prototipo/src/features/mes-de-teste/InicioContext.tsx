import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { rolarParaOrcamento } from '../../lib/rolagem'

export type Inicio = 'agora' | 'teste'

interface ValorInicio {
  inicio: Inicio
  setInicio: (i: Inicio) => void
  escolherTesteERolar: () => void
}

const InicioCtx = createContext<ValorInicio | null>(null)

export function InicioProvider({ children }: { children: ReactNode }) {
  const [inicio, setInicio] = useState<Inicio>('agora')

  const escolherTesteERolar = useCallback(() => {
    setInicio('teste')
    rolarParaOrcamento()
  }, [])

  const valor = useMemo(() => ({ inicio, setInicio, escolherTesteERolar }), [inicio, escolherTesteERolar])
  return <InicioCtx.Provider value={valor}>{children}</InicioCtx.Provider>
}

export function useInicio(): ValorInicio {
  const ctx = useContext(InicioCtx)
  if (!ctx) throw new Error('useInicio precisa estar dentro de InicioProvider')
  return ctx
}
