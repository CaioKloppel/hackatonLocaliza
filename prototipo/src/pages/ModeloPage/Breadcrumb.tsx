import { ArrowLeft, ChevronRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import styles from './Breadcrumb.module.css'

export function Breadcrumb() {
  const toast = useToast()
  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }
  return (
    <div className={styles.linha}>
      <button type="button" className={styles.voltar} aria-label="Voltar" onClick={desativado}>
        <ArrowLeft size={24} aria-hidden="true" />
      </button>
      <nav aria-label="Trilha de navegação">
        <ol className={styles.lista}>
          <li><a href="#/" onClick={desativado} className={styles.item}>...</a></li>
          <li>
            <ChevronRight size={16} aria-hidden="true" className={styles.sep} />
            <a href="#/" onClick={desativado} className={styles.item}>Modelos disponíveis</a>
          </li>
          <li>
            <ChevronRight size={16} aria-hidden="true" className={styles.sep} />
            <span aria-current="page" className={styles.atual}>BYD Dolphin</span>
          </li>
        </ol>
      </nav>
    </div>
  )
}
