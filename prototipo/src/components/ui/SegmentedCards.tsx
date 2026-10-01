import styles from './SegmentedCards.module.css'

export interface OpcaoSegmentada<T extends string> {
  valor: T
  titulo: string
  descricao?: string
  selo?: string
}

interface Props<T extends string> {
  nome: string
  rotulo: string
  opcoes: OpcaoSegmentada<T>[]
  valor: T | null
  onChange: (v: T) => void
  compacto?: boolean
}

export function SegmentedCards<T extends string>({ nome, rotulo, opcoes, valor, onChange, compacto = false }: Props<T>) {
  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.legenda}>{rotulo}</legend>
      <div className={compacto ? styles.linhaCompacta : styles.linha}>
        {opcoes.map((o) => (
          <label key={o.valor} className={o.valor === valor ? styles.cardAtivo : styles.card}>
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={o.valor === valor}
              onChange={() => onChange(o.valor)}
              className={styles.radio}
            />
            <span className={styles.titulo}>
              {o.titulo}
              {o.selo && <span className={styles.selo}>{o.selo}</span>}
            </span>
            {o.descricao && <span className={styles.descricao}>{o.descricao}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
