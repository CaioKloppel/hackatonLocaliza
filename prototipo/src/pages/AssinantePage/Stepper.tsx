import styles from './AssinantePage.module.css'

const PASSOS = ['Consentimento', 'Seu uso', 'Recarga', 'Resultado']

export function Stepper({ passoAtual }: { passoAtual: number }) {
  return (
    <ol className={styles.stepper} aria-label="Etapas da recomendação">
      {PASSOS.map((p, i) => {
        const n = i + 1
        const classe = n < passoAtual ? styles.passoFeito : n === passoAtual ? styles.passoAtual : styles.passo
        return (
          <li key={p} className={classe} aria-current={n === passoAtual ? 'step' : undefined}>
            <span className={styles.numeroPasso}>{n}</span>
            <span className={styles.nomePasso}>{p}</span>
          </li>
        )
      })}
    </ol>
  )
}
