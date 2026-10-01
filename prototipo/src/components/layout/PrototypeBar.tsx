import type { Rota } from '../../hooks/useHashRoute'
import { useModo } from '../../modo/ModoContext'
import styles from './PrototypeBar.module.css'

export function PrototypeBar({ rota }: { rota: Rota }) {
  const { modo, setModo } = useModo()
  const proposta = modo === 'proposta'
  return (
    <div className={styles.barra} role="region" aria-label="Controles do protótipo">
      <div className={styles.conteudo}>
        <span className={styles.rotulo}>Protótipo · Ideathon Localiza</span>
        {rota === 'modelo' ? (
          <div className={styles.chave}>
            <span className={proposta ? styles.opcao : styles.opcaoAtiva} aria-hidden="true">Página atual</span>
            <button
              type="button"
              role="switch"
              aria-checked={proposta}
              aria-label="Mostrar proposta"
              className={styles.switch}
              onClick={() => setModo(proposta ? 'atual' : 'proposta')}
            >
              <span className={styles.bolinha} />
            </button>
            <span className={proposta ? styles.opcaoAtiva : styles.opcao} aria-hidden="true">Proposta</span>
          </div>
        ) : (
          <a className={styles.link} href="#/">← Página do modelo</a>
        )}
        {rota === 'modelo' && (
          <a className={styles.linkAssinante} href="#/assinante" onClick={() => setModo('proposta')}>
            Tela do assinante (V3B)
          </a>
        )}
      </div>
    </div>
  )
}
