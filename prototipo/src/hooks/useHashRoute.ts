import { useEffect, useState } from 'react'

export type Rota = 'modelo' | 'assinante'

export interface EstadoHash {
  rota: Rota
  params: URLSearchParams
}

export function lerHash(hash: string): EstadoHash {
  const semCerquilha = hash.replace(/^#/, '')
  const [caminho, query = ''] = semCerquilha.split('?')
  const rota: Rota = caminho === '/assinante' ? 'assinante' : 'modelo'
  return { rota, params: new URLSearchParams(query) }
}

export function useHashRoute(): EstadoHash {
  const [estado, setEstado] = useState(() => lerHash(window.location.hash))
  useEffect(() => {
    const aoMudar = () => setEstado(lerHash(window.location.hash))
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return estado
}

export function limparParamsHash(): void {
  const { rota } = lerHash(window.location.hash)
  const hash = rota === 'assinante' ? '#/assinante' : '#/'
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
}
