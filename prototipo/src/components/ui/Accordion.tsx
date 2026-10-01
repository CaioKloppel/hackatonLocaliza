import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import styles from './Accordion.module.css'

interface Props {
  id: string
  titulo: string
  icone: ReactNode
  contador?: number
  tag?: ReactNode
  abertoInicial?: boolean
  children: ReactNode
}

export function Accordion({ id, titulo, icone, contador, tag, abertoInicial = true, children }: Props) {
  const [aberto, setAberto] = useState(abertoInicial)
  const painelId = `${id}-painel`
  return (
    <section id={id} className={styles.item}>
      {tag && <div className={styles.tag}>{tag}</div>}
      <h2 className={styles.cabecalho}>
        <button
          type="button"
          className={styles.gatilho}
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={() => setAberto((a) => !a)}
        >
          <span className={styles.icone} aria-hidden="true">{icone}</span>
          <span className={styles.titulo}>{titulo}</span>
          {contador !== undefined && <span className={styles.contador}>{contador}</span>}
          <ChevronDown size={24} aria-hidden="true" className={aberto ? styles.chevronAberto : styles.chevron} />
        </button>
      </h2>
      <div id={painelId} className={styles.painel} hidden={!aberto}>
        {children}
      </div>
    </section>
  )
}
