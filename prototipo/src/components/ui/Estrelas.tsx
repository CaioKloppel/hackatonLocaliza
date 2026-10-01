import { Star } from 'lucide-react'
import { formatarNota } from '../../lib/formato'
import styles from './Estrelas.module.css'

interface Props {
  nota: number
  tamanho?: number
}

export function Estrelas({ nota, tamanho = 16 }: Props) {
  return (
    <span className={styles.estrelas} role="img" aria-label={`Nota ${formatarNota(nota)} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const preenchido = Math.max(0, Math.min(1, nota - (i - 1)))
        return (
          <span key={i} className={styles.estrela} style={{ width: tamanho, height: tamanho }}>
            <Star size={tamanho} className={styles.vazia} aria-hidden="true" />
            <span className={styles.cheia} style={{ width: `${preenchido * 100}%` }}>
              <Star size={tamanho} aria-hidden="true" />
            </span>
          </span>
        )
      })}
    </span>
  )
}
