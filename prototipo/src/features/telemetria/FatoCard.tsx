import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './DadosFrotaSection.module.css'

interface Props {
  pergunta: string
  icone: LucideIcon
  children: ReactNode
}

export function FatoCard({ pergunta, icone: Icone, children }: Props) {
  return (
    <div className={styles.fato}>
      <h3 className={styles.pergunta}>
        <Icone size={20} aria-hidden="true" className={styles.iconeFato} />
        {pergunta}
      </h3>
      <div className={styles.resposta}>{children}</div>
    </div>
  )
}
