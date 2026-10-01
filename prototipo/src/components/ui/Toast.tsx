import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Toast.module.css'

export const MSG_DESATIVADO = 'Link desativado no protótipo'

const ToastCtx = createContext<(mensagem: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const mostrar = useCallback((m: string) => {
    setMensagem(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMensagem(null), 2500)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastCtx.Provider value={mostrar}>
      {children}
      <div role="status" aria-live="polite" className={styles.regiao}>
        {mensagem && <div className={styles.toast}>{mensagem}</div>}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): (mensagem: string) => void {
  return useContext(ToastCtx)
}
