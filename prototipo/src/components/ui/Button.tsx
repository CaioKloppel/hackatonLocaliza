import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variante = 'primary' | 'secondary' | 'outline' | 'outlineDark' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamanho?: 'md' | 'sm'
  larguraTotal?: boolean
  icone?: ReactNode
}

export function Button({
  variante = 'primary',
  tamanho = 'md',
  larguraTotal = false,
  icone,
  className,
  children,
  type = 'button',
  ...resto
}: Props) {
  const classes = [styles.btn, styles[variante], styles[tamanho], larguraTotal ? styles.total : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={classes} {...resto}>
      {icone}
      {children}
    </button>
  )
}
