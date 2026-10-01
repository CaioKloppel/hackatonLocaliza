import type { ReactNode } from 'react'
import styles from './Chip.module.css'

interface Props {
  selecionado: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selecionado, onClick, children }: Props) {
  return (
    <button type="button" aria-pressed={selecionado} className={selecionado ? styles.ativo : styles.chip} onClick={onClick}>
      {children}
    </button>
  )
}
