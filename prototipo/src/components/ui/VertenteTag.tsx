import styles from './VertenteTag.module.css'

const NOMES = { 1: 'Mês de teste', 2: 'Avaliações', 3: 'Telemetria' } as const

export function VertenteTag({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className={styles.tag}>
      Vertente {n} · {NOMES[n]}
    </span>
  )
}
